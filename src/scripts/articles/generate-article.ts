// scripts/generate-article.ts
import { Command } from 'commander';
import { generateCelebrityArticle } from './article-generator';

const program = new Command();

program
  .name('generate-article')
  .description('CLI tool to generate celebrity articles')
  .requiredOption('-n, --name <string>', 'Celebrity name')
  .option('-m, --max-articles <number>', 'Max news articles to process', '5')
  .option('-o, --output <type>', 'Output format (md|json)', 'md')
  .option('-f, --file', 'Use file instead of API', true)
  .parse(process.argv);

const options = program.opts();

(async () => {
  try {
    console.log('Generating article...'); // Add logging for debugging
    const result = await generateCelebrityArticle({
      name: options.name,
      maxArticles: parseInt(options.maxArticles),
      outputFormat: options.output,
      file: options.file === true
    });
    
    console.log('Article generated successfully:', result); // Add logging for debugging
    process.exit(0);
  } catch (error) {
    console.error('Error generating article:', error);
    process.exit(1);
  }
})();