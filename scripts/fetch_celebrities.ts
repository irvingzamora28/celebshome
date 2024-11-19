import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { CATEGORIES } from "./categories.ts";

interface WikipediaResponse {
    query: {
        categorymembers: Array<{
            title: string;
            pageid: number;
        }>;
        continue?: {
            cmcontinue: string;
            continue: string;
        };
    };
}

const MAX_PAGES = 10;
const ITEMS_PER_PAGE = 500;

async function getCategoryMembers(category: string): Promise<string[]> {
    const allMembers: string[] = [];
    let continueToken: string | undefined;
    let pageCount = 0;

    while (pageCount < MAX_PAGES) {
        const url = 'https://en.wikipedia.org/w/api.php';
        const params = new URLSearchParams({
            action: 'query',
            list: 'categorymembers',
            cmtitle: category,
            cmlimit: ITEMS_PER_PAGE.toString(),
            format: 'json',
            origin: '*'
        });

        if (continueToken) {
            params.append('cmcontinue', continueToken);
        }

        try {
            const response = await fetch(`${url}?${params}`);
            const data: WikipediaResponse = await response.json();
            
            const members = data.query.categorymembers.map(member => member.title);
            allMembers.push(...members);

            if (!data.query.continue?.cmcontinue) {
                break; // No more pages
            }

            continueToken = data.query.continue.cmcontinue;
            pageCount++;
            
            console.log(`Fetched page ${pageCount} of category ${category}, got ${members.length} members`);
            
            // Add a small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`Error fetching category ${category} page ${pageCount + 1}:`, error);
            break;
        }
    }

    return allMembers;
}

async function getPageContent(title: string): Promise<string[]> {
    const url = 'https://en.wikipedia.org/w/api.php';
    const params = new URLSearchParams({
        action: 'query',
        prop: 'links',
        titles: title,
        pllimit: '500',
        format: 'json',
        origin: '*'
    });

    try {
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        const pages = Object.values(data.query.pages);
        const links = pages[0].links?.map((link: { title: string }) => link.title) || [];
        return links.filter((link: string) => !link.includes(':') && !link.includes('List'));
    } catch (error) {
        console.error(`Error fetching page ${title}:`, error);
        return [];
    }
}

async function main() {
    const allCelebrities = new Set<string>();
    
    for (const category of CATEGORIES) {
        console.log(`Processing category: ${category}`);
        const lists = await getCategoryMembers(category);
        console.log(`Found ${lists.length} items in category ${category}`);
        
        for (const list of lists) {
            console.log(`Processing list: ${list}`);
            const celebrities = await getPageContent(list);
            celebrities.forEach(celeb => allCelebrities.add(celeb));
        }
    }

    const outputPath = join(Deno.cwd(), 'data', 'celebrities.json');
    await ensureDir(join(Deno.cwd(), 'data'));
    await Deno.writeTextFile(
        outputPath,
        JSON.stringify(Array.from(allCelebrities), null, 2)
    );

    console.log(`Found ${allCelebrities.size} unique celebrities`);
    console.log(`Data saved to ${outputPath}`);
}

if (import.meta.main) {
    main().catch(console.error);
}
