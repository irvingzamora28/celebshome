// scripts/news-aggregator.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  content: string;
  date: Date;
}

export async function getRecentNews(celebrityName: string, maxArticles: number): Promise<NewsArticle[]> {
  try {
    const searchQuery = encodeURIComponent(`${celebrityName} latest news`);
    const googleNewsUrl = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await axios.get(googleNewsUrl);
    const $ = cheerio.load(response.data, { xmlMode: true });
    
    const articles: NewsArticle[] = [];
    $('item').slice(0, maxArticles).each((_, element) => {
      const title = $(element).find('title').text();
      const source = $(element).find('source').text();
      const url = $(element).find('link').text();
      const pubDate = new Date($(element).find('pubDate').text());
      
      articles.push({
        title,
        source,
        url,
        content: '', // Will be populated later
        date: pubDate
      });
    });

    // Fetch full content for each article
    const contentPromises = articles.map(async (article) => {
      try {
        const pageResponse = await axios.get(article.url);
        const $page = cheerio.load(pageResponse.data);
        const content = $page('article').text() || $page('body').text();
        return { ...article, content: content.substring(0, 5000) }; // Limit content
      } catch (error) {
        console.error(`Error fetching ${article.url}:`, error);
        return article;
      }
    });

    return Promise.all(contentPromises);
  } catch (error: unknown) {
    throw new Error(`News aggregation failed: ${(error as Error).message ?? 'unknown error'}`);
  }
}