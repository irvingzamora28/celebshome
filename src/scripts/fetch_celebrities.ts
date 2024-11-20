import path from 'path';
import fs from 'fs/promises';

const CATEGORIES = [
    "Category:Lists of actors by nationality"
];

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
        const url = new URL('https://en.wikipedia.org/w/api.php');
        url.search = new URLSearchParams({
            action: 'query',
            list: 'categorymembers',
            cmtitle: category,
            cmlimit: ITEMS_PER_PAGE.toString(),
            format: 'json',
            origin: '*'
        }).toString();

        if (continueToken) {
            url.searchParams.append('cmcontinue', continueToken);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json() as WikipediaResponse;
            
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
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
        action: 'query',
        prop: 'links',
        titles: title,
        pllimit: '500',
        format: 'json',
        origin: '*'
    }).toString();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const pages = Object.values(data.query.pages) as Array<{ links?: Array<{ title: string }> }>;
        const links = pages[0]?.links?.map(link => link.title) || [];
        return links.filter((link: string) => !link.includes(':') && !link.includes('List'));
    } catch (error) {
        console.error(`Error fetching page ${title}:`, error);
        return [];
    }
}

async function main() {
    console.log('Starting celebrity data fetch...');
    const allCelebrities = new Set<string>();
    
    for (const category of CATEGORIES) {
        console.log(`Processing category: ${category}`);
        const lists = await getCategoryMembers(category);
        console.log(`Found ${lists.length} items in category ${category}`);
        
        for (const list of lists) {
            console.log(`Processing list: ${list}`);
            const celebrities = await getPageContent(list);
            celebrities.forEach(celebrity => allCelebrities.add(celebrity));
        }
    }
    
    const outputDir = path.join(process.cwd(), 'src', 'data');
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'celebrities.json');
    await fs.writeFile(
        outputPath,
        JSON.stringify(Array.from(allCelebrities), null, 2)
    );
    
    console.log(`Saved ${allCelebrities.size} unique celebrities to ${outputPath}`);
}

main().catch(error => {
    console.error('Error running script:', error);
    process.exit(1);
});
