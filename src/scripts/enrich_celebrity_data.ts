import * as fs from 'fs/promises';
import * as path from 'path';
import { JSDOM } from 'jsdom';

interface WikipediaPageInfo {
    extract: string;
    description: string;
    thumbnail?: {
        source: string;
    };
    content_urls?: {
        desktop: {
            page: string;
        };
    };
}

interface EnrichedCelebrity {
    id: number;
    name: string;
    date_of_birth: string;
    date_of_death?: string;
    zodiac_sign: string;
    gender: string;
    nationality: string;
    profession: string;
    biography: string;
    image_url: string;
    social_links: string;
    famous_works: string[];
    popularity_score: number;
    created_at: string;
}

async function getWikipediaInfo(name: string): Promise<WikipediaPageInfo | null> {
    const encodedName = encodeURIComponent(name);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedName}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Error fetching Wikipedia info for ${name}:`, error);
        return null;
    }
}

async function getWikipediaPageDetails(url: string): Promise<{ birthDate?: string; deathDate?: string; contentLength: number }> {
    try {
        const response = await fetch(url);
        if (!response.ok) return { contentLength: 0 };
        
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Find birth date in the infobox (hidden span with ISO date)
        const birthDateSpan = document.querySelector('.bday');
        const birthDate = birthDateSpan?.textContent ?? undefined;

        // Find death date in the infobox (hidden span with ISO date)
        const deathDateCell = Array.from(document.querySelectorAll('.infobox-label'))
            .find(el => (el as HTMLElement).textContent?.trim() === 'Died') as HTMLElement | undefined;
        
        const deathDateValue = deathDateCell?.nextElementSibling as HTMLElement | undefined;
        
        const deathDate = deathDateValue
            ?.querySelector('span[style="display:none"]')
            ?.textContent
            ?.replace(/[()]/g, ''); // Remove parentheses from (YYYY-MM-DD)

        // Calculate content length as a rough popularity score
        const contentLength = html.length;

        return {
            birthDate,
            deathDate,
            contentLength,
        };
    } catch (error) {
        console.error(`Error fetching Wikipedia page details:`, error);
        return { contentLength: 0 };
    }
}

function getZodiacSign(dateStr: string): string {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
}

async function enrichCelebrity(name: string): Promise<EnrichedCelebrity | null> {
    const info = await getWikipediaInfo(name);
    if (!info || !info.extract || !info.content_urls?.desktop.page) return null;

    const pageDetails = await getWikipediaPageDetails(info.content_urls.desktop.page);
    
    if (!pageDetails.birthDate) {
        console.warn(`No birth date found for ${name}`);
        return null;
    }

    // Use a placeholder image if none is available
    const imageUrl = info.thumbnail?.source || 'https://loremflickr.com/640/480/abstract';

    // Extract profession and nationality from description
    const professionMatch = info.description?.match(/(actor|actress|singer|musician|athlete|director|producer|basketball player)/i);
    const nationalityMatch = info.description?.match(/(American|British|Canadian|Australian|French|German|Italian|Mexican|Spanish|Japanese|Korean|Chinese)/i);

    // Calculate normalized popularity score (0-100)
    console.log(`Content length: ${pageDetails.contentLength}`);
    const popularityScore = Math.min(100, Math.round((pageDetails.contentLength / 1000000) * 100));

    return {
        name,
        date_of_birth: pageDetails.birthDate,
        ...(pageDetails.deathDate && { date_of_death: pageDetails.deathDate }),
        zodiac_sign: getZodiacSign(pageDetails.birthDate),
        gender: info.extract?.toLowerCase().includes('she ') ? 'Female' : 'Male',
        nationality: nationalityMatch?.[1] || 'Unknown',
        profession: professionMatch?.[1] || 'Unknown',
        biography: info.extract,
        image_url: imageUrl,
        social_links: info.content_urls.desktop.page,
        famous_works: [],
        popularity_score: popularityScore,
        created_at: new Date().toISOString(),
        id: Math.floor(Math.random() * 1000000)
    };
}

async function main() {
    const inputPath = path.join(process.cwd(), 'src', 'data', 'celebrities.json');
    const outputPath = path.join(process.cwd(), 'src', 'data', 'enriched_celebrities.json');
    
    try {
        // Create data directory if it doesn't exist
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

        const rawData = await fs.readFile(inputPath, 'utf8');
        const celebrities: string[] = JSON.parse(rawData);
        const enrichedCelebrities: EnrichedCelebrity[] = [];

        for (const celebrity of celebrities) {
            console.log(`Processing ${celebrity}...`);
            const enriched = await enrichCelebrity(celebrity);
            if (enriched) {
                enrichedCelebrities.push(enriched);
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        await fs.writeFile(
            outputPath,
            JSON.stringify(enrichedCelebrities, null, 2)
        );

        console.log(`Enriched ${enrichedCelebrities.length} celebrities`);
        console.log(`Data saved to ${outputPath}`);
    } catch (error) {
        console.error('Error processing celebrities:', error);
    }
}

// Only run main if this file is the main module
if (require.main === module) {
    main().catch(console.error);
}