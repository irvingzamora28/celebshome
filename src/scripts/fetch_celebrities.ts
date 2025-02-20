import path from 'path';
import fs from 'fs/promises';

const CATEGORIES = [
    'Category:Actors from Alabama',
    'Category:Actors from Alaska',
    'Category:Actors from Arizona',
    'Category:Actors from Arkansas',
    'Category:Actors from California',
    'Category:Actors from Colorado',
    'Category:Actors from Connecticut',
    'Category:Actors from Delaware',
    'Category:Actors from Florida',
    'Category:Actors from Georgia (U.S. state)',
    'Category:Actors from Hawaii',
    'Category:Actors from Idaho',
    'Category:Actors from Illinois',
    'Category:Actors from Indiana',
    'Category:Actors from Iowa',
    'Category:Actors from Kansas',
    'Category:Actors from Kentucky',
    'Category:Actors from Louisiana',
    'Category:Actors from Maine',
    'Category:Actors from Maryland',
    'Category:Actors from Massachusetts',
    'Category:Actors from Michigan',
    'Category:Actors from Minnesota',
    'Category:Actors from Mississippi',
    'Category:Actors from Missouri',
    'Category:Actors from Montana',
    'Category:Actors from Nebraska',
    'Category:Actors from Nevada',
    'Category:Actors from New Hampshire',
    'Category:Actors from New Jersey',
    'Category:Actors from New Mexico',
    'Category:Actors from New York (state)',
    'Category:Actors from North Carolina',
    'Category:Actors from North Dakota',
    'Category:Actors from Ohio',
    'Category:Actors from Oklahoma',
    'Category:Actors from Oregon',
    'Category:Actors from Pennsylvania',
    'Category:Actors from Rhode Island',
    'Category:Actors from South Carolina',
    'Category:Actors from South Dakota',
    'Category:Actors from Tennessee',
    'Category:Actors from Texas',
    'Category:Actors from Utah',
    'Category:Actors from Vermont',
    'Category:Actors from Virginia',
    'Category:Actors from Washington (state)',
    'Category:Actors from West Virginia',
    'Category:Actors from Wisconsin',
    'Category:Actors from Wyoming',
    'Category:American actresses by medium',
    'Category:Lists_of_actors_by_nationality',
    'Category:Lists_of_musicians_by_nationality',
    'Category:Lists_of_singers_by_nationality',
    'Category:Lists_of_athletes_by_nationality',
    'Category:American_men\'s_basketball_players',
    'Category:American_women\'s_basketball_players',
];

const DIRECT_PAGES = [
    'Forbes Celebrity 100',
    'List of highest-paid film actors',
    'List of highest-paid television actors',
    'Forbes_list_of_the_world\'s_highest-paid_athletes'
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
        prop: 'links|extracts',  // Add extracts
        titles: title,
        pllimit: '500',
        exintro: '1',
        explaintext: '1',
        format: 'json',
        origin: '*'
    }).toString();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const pages = Object.values(data.query.pages) as Array<{ links?: Array<{ title: string }>; extracts?: string }>;
        const page = pages[0];
        if (!page) return [];
        const links = page.links?.map(link => link.title) || [];
                
        // Filter out obvious non-person entries
        return links.filter(link => {
            const lower = link.toLowerCase();
            return !link.includes(':') && 
                   !link.includes('List') &&
                   !lower.includes('list') &&
                   !lower.includes('film') &&
                   !lower.includes('movie') &&
                   !lower.includes('tv series') &&
                   !lower.includes('show') &&
                   !lower.includes('episode') &&
                   !lower.includes('building') &&
                   !lower.includes('company') &&
                   !lower.includes('game') &&
                   !lower.includes('book') &&
                   !lower.includes('album') &&
                   !lower.includes('award') &&
                   !lower.includes('franchise') &&
                   !lower.includes('brand');
        });
    } catch (error) {
        console.error(`Error fetching page ${title}:`, error);
        return [];
    }
}

async function main() {
    console.log('Starting celebrity data fetch...');
    const allCelebrities = new Set<string>();
    
    // Process categories first
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

    // Process direct pages
    console.log('\nProcessing direct pages...');
    for (const page of DIRECT_PAGES) {
        console.log(`Processing page: ${page}`);
        const celebrities = await getPageContent(page);
        celebrities.forEach(celebrity => allCelebrities.add(celebrity));
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
