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
      content = await getRecentNews(options.name, options.maxArticles);
      sources = content.map((a) => a.url);
      console.log(content);
    }
    // 2. Generate Article
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a celebrity news writer. Generate a comprehensive article in ${
            options.outputFormat
          } format using these sources: ${JSON.stringify(content)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedContent = gptResponse.choices[0].message.content ?? "";
    console.log(generatedContent);

    // Extract title from generated content
    const titleMatch = generatedContent.match(/^#\s*(.+)/m);
    const title = titleMatch
      ? titleMatch[1]
      : `Latest News About ${options.name}`;

    // 3. Store Content
    const storedArticle = await storeArticle({
      celebrityName: options.name,
      title, // Pass title
      content: generatedContent,
      format: options.outputFormat,
      sources,
    });
    return {
      success: true,
      path: storedArticle.filePath,
      wordCount: generatedContent.split(" ").length,
    };
  } catch (error: unknown) {
    throw new Error(
      `Article generation failed: ${
        (error as Error).message ?? "unknown error"
      }`
    );
  }
}
