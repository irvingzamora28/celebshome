import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";

interface WikipediaPageInfo {
    extract: string;
    description: string;
    birthDate?: string;
    thumbnail?: {
        source: string;
    };
    image?: {
        source: string;
    };
}

interface EnrichedCelebrity {
    name: string;
    date_of_birth: string;
    zodiac_sign: string;
    biography: string;
    image_url: string;
    profession: string;
    nationality: string;
    social_links: Record<string, string>;
    famous_works: string[];
}

function getZodiacSign(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    const zodiacSigns = {
        'Capricorn': (month === 12 && day >= 22) || (month === 1 && day <= 19),
        'Aquarius': (month === 1 && day >= 20) || (month === 2 && day <= 18),
        'Pisces': (month === 2 && day >= 19) || (month === 3 && day <= 20),
        'Aries': (month === 3 && day >= 21) || (month === 4 && day <= 19),
        'Taurus': (month === 4 && day >= 20) || (month === 5 && day <= 20),
        'Gemini': (month === 5 && day >= 21) || (month === 6 && day <= 20),
        'Cancer': (month === 6 && day >= 21) || (month === 7 && day <= 22),
        'Leo': (month === 7 && day >= 23) || (month === 8 && day <= 22),
        'Virgo': (month === 8 && day >= 23) || (month === 9 && day <= 22),
        'Libra': (month === 9 && day >= 23) || (month === 10 && day <= 22),
        'Scorpio': (month === 10 && day >= 23) || (month === 11 && day <= 21),
        'Sagittarius': (month === 11 && day >= 22) || (month === 12 && day <= 21),
    };

    return Object.entries(zodiacSigns).find(([_, condition]) => condition)?.[0] || 'Unknown';
}

async function getWikipediaInfo(name: string): Promise<WikipediaPageInfo | null> {
    const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name);
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching info for ${name}:`, error);
        return null;
    }
}

async function enrichCelebrity(name: string): Promise<EnrichedCelebrity | null> {
    const info = await getWikipediaInfo(name);
    if (!info || !info.extract) return null;

    // Use a placeholder image if none is available
    const imageUrl = info.thumbnail?.source || 'https://loremflickr.com/640/480/abstract';

    // Extract profession and nationality from description
    const professionMatch = info.description?.match(/(actor|actress|singer|musician|athlete|director|producer)/i);
    const nationalityMatch = info.description?.match(/(American|British|Canadian|Australian|French|German|Italian|Mexican|Spanish|Japanese|Korean|Chinese)/i);

    return {
        name,
        date_of_birth: info.birthDate || new Date().toISOString().split('T')[0],
        zodiac_sign: info.birthDate ? getZodiacSign(info.birthDate) : 'Unknown',
        biography: info.extract,
        image_url: imageUrl,
        profession: professionMatch?.[0] || 'Unknown',
        nationality: nationalityMatch?.[0] || 'Unknown',
        social_links: {
            wikipedia: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`
        },
        famous_works: []
    };
}

async function main() {
    const inputPath = join(Deno.cwd(), 'data', 'celebrities.json');
    const outputPath = join(Deno.cwd(), 'data', 'enriched_celebrities.json');
    
    if (!await Deno.stat(inputPath).catch(() => false)) {
        console.error('Please run fetch_celebrities.ts first to generate the input file');
        Deno.exit(1);
    }

    const fileContent = await Deno.readTextFile(inputPath);
    const celebrities = JSON.parse(fileContent);
    const enrichedCelebrities: EnrichedCelebrity[] = [];
    
    // Process celebrities in batches to avoid rate limiting
    const BATCH_SIZE = 10;
    for (let i = 0; i < celebrities.length; i += BATCH_SIZE) {
        const batch = celebrities.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i / BATCH_SIZE + 1}/${Math.ceil(celebrities.length / BATCH_SIZE)}`);
        
        const enrichedBatch = await Promise.all(
            batch.map(async (name: string) => {
                const enriched = await enrichCelebrity(name);
                if (enriched) {
                    console.log(`Successfully enriched data for ${name}`);
                    return enriched;
                }
                console.log(`Failed to enrich data for ${name}`);
                return null;
            })
        );

        enrichedCelebrities.push(...enrichedBatch.filter((c): c is EnrichedCelebrity => c !== null));
        
        // Save progress after each batch
        await ensureDir(join(Deno.cwd(), 'data'));
        await Deno.writeTextFile(
            outputPath,
            JSON.stringify(enrichedCelebrities, null, 2)
        );
        
        // Wait a bit between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Enriched ${enrichedCelebrities.length} celebrities`);
    console.log(`Data saved to ${outputPath}`);
}

if (import.meta.main) {
    main().catch(console.error);
}
