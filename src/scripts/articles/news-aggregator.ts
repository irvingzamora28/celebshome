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
    // Append "&hl=en" to the URL to ensure the results are in English
    const googleNewsUrl = `https://www.google.com/search?q=${searchQuery}&tbm=nws&hl=en`;
    
    const response = await axios.get(googleNewsUrl);
    const $ = cheerio.load(response.data);
    // Print content of response
    // console.log(response.data);
    // Place all the urls into an array
    const articles: NewsArticle[] = [];

    $('a').each((_, element) => {
      const $anchor = $(element);
      const url = $anchor.attr('href') || '';
      const urlDetector = '/url?q=';
      if (url.startsWith(urlDetector + 'https') && !url.includes('google.com')) {
        // Cutoff the url where you find the fist &
        const finalUrl = url.replace(urlDetector, '').slice(0, url.indexOf('&') - urlDetector.length);
        articles.push({
          title: $anchor.find('.n0jPhd').text().trim(),
          source: $anchor.find('.MgUUmf span').first().text().trim(),
          url: finalUrl,
          content: '', // Will be populated later
          date: new Date($anchor.find('.OSrXXb span').text().trim()) || new Date() // Add proper date parsing if needed
        });
      }
    });
    console.log("Found ", articles.length, " articles");

    // Fetch full content for each article
    const contentPromises = articles.slice(0, maxArticles).map(async (article) => {
      try {
        console.log(`Fetching content for ${article.url}`);
        
        const pageResponse = await axios.get(article.url, {
          validateStatus: (status) => status >= 200 && status < 500
        });
        if (pageResponse.status === 404 || pageResponse.status === 500 || pageResponse.status === 403) {
          console.warn(`Skipping ${article.url} as it returned a ${pageResponse.status}`);
          return Promise.resolve(null);
        }
        const $page = cheerio.load(pageResponse.data);
        const content = $page('article p').text() || $page('body').text();
        const cleanedContent = content
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/\s*(READ MORE|LATEST|Find out more)\s*/gi, '')
          .trim();
        
        return { ...article, content: cleanedContent.substring(0, 5000) }; // Limit content
      } catch (error) {
        if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 500 || error.response?.status === 403)) {
          console.warn(`Skipping ${article.url} as it returned a ${error.response?.status}`);
          return Promise.resolve(null);
        }
        console.error(`Error fetching ${article.url}:`, error);
        return article;
      }
    });
    // Remove articles that returned a 404
    const validPromises = contentPromises.filter(promise => promise !== null);

    return Promise.all(validPromises.filter(Boolean)).then((articlesWithContent) => {
      return articlesWithContent.filter(Boolean) as NewsArticle[];
    });
  } catch (error: unknown) {
    throw new Error(`News aggregation failed: ${(error as Error).message ?? 'unknown error'}`);
  }
}