// scripts/article-generator.ts
import { OpenAI } from "openai";
import { getRecentNews } from "./news-aggregator";
import { storeArticle } from "./content-storage";
import path from "path";
import { readFile } from "fs/promises";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerationOptions {
  name: string;
  maxArticles: number;
  file?: boolean;
  outputFormat: "md" | "json";
}

export async function generateCelebrityArticle(options: GenerationOptions) {
  try {
    console.log("Generating article for:", options.name);
    let content;
    let sources: string[] = [];
    if (options.file) {
      const filePath = path.join(
        process.cwd(),
        "src",
        "data",
        "article",
        "data.txt"
      );
      // Print the contents
      content = await readFile(filePath, "utf8");
      sources = ["local"];
      console.log(content);
    } else {
      // 1. Gather News
      const newsArticles = await getRecentNews(options.name, options.maxArticles);
      const storedArticles: { filePath: string }[] = [];
      

      for (const [index, article] of newsArticles.entries()) {
        console.log("Article title :", article.title)
        console.log("Article content :", article.content)
        // Skip if content is empty
        if (!article.content) {
          console.log(`Skipping article ${index + 1} - empty content`);
          continue;
        }
        try {
          const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a celebrity news writer. Generate a comprehensive article in markup format using this source: ${article.content}, the article is about ${options.name}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          });
          const generatedContent = gptResponse.choices[0].message.content ?? "";
          // Remove the ``` in the beginning and end
          const cleanedContent = generatedContent.replace(/^```markdown/m, "").replace(/```$/m, "");
          const articleTitle = cleanedContent.match(/^#\s*(.+)/m)?.[1] || `${article.title} - ${index + 1}`;

          storedArticles.push(await storeArticle({
            celebrityName: options.name,
            title: articleTitle,
            content: cleanedContent,
            format: options.outputFormat,
            sources: [article.url],
          }));
        } catch (error) {
          console.error(`Failed to process article ${index + 1}:`, error);
        }
      }

      return {
        success: storedArticles.length > 0,
        generatedCount: storedArticles.length,
        paths: storedArticles.map(a => a.filePath)
      };
    }
  } catch (error: unknown) {
    throw new Error(
      `Article generation failed: ${
        (error as Error).message ?? "unknown error"
      }`
    );
  }
}
