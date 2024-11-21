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
    additionalData: Record<string, unknown>;
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

async function getWikipediaPageDetails(url: string): Promise<{
    birthDate?: string;
    deathDate?: string;
    fullName?: string;
    birthPlace?: string;
    occupations?: string[];
    organizations?: string[];
    contentLength: number;
    additionalData: Record<string, string | string[]>;
}> {
    try {
        const response = await fetch(url);
        if (!response.ok) return { contentLength: 0, additionalData: {} };
        
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const details: {
            birthDate?: string;
            deathDate?: string;
            fullName?: string;
            birthPlace?: string;
            occupations?: string[];
            organizations?: string[];
            contentLength: number;
            additionalData: Record<string, string | string[]>;
        } = {
            contentLength: 0,
            additionalData: {}
        };

        // Get infobox data
        const infobox = document.querySelector('.infobox');
        if (infobox) {
            const rows = infobox.querySelectorAll('tr');
            rows.forEach(row => {
                const label = row.querySelector('.infobox-label')?.textContent?.toLowerCase().trim();
                const data = row.querySelector('.infobox-data');
                
                if (label && data) {
                    // Function to clean text content
                    const cleanTextContent = (element: Element): string => {
                        // Remove style tags
                        const styleElements = Array.from(element.querySelectorAll('style'));
                        styleElements.forEach(el => el.remove());

                        // Replace special characters and whitespace
                        return element.textContent?.replace(/\u200B/g, '') // Remove zero-width space
                            .replace(/\s+/g, ' ') // Normalize whitespace
                            .trim() || '';
                    };

                    // Get birth date from the hidden span with class bday
                    if (label.includes('born')) {
                        const bdaySpan = data.querySelector('.bday');
                        if (bdaySpan) {
                            details.birthDate = bdaySpan.textContent?.trim();
                        }
                        const birthplaceDiv = data.querySelector('.birthplace');
                        if (birthplaceDiv) {
                            details.birthPlace = cleanTextContent(birthplaceDiv);
                        }
                    } 
                    // Get death date from hidden span
                    else if (label.includes('died')) {
                        const deathDateSpan = data.querySelector('span[style*="display:none"]');
                        if (deathDateSpan) {
                            const deathDate = deathDateSpan.textContent?.trim().match(/\d{4}-\d{2}-\d{2}/)?.[0];
                            if (deathDate) details.deathDate = deathDate;
                        }
                    }
                    
                    // Store all data dynamically, analyzing if it's a list or plain text
                    const key = label.replace(/\s+/g, '_');
                    
                    // Check if the data contains a list
                    const listItems = Array.from(data.querySelectorAll('li'))
                        .map(li => cleanTextContent(li))
                        .filter(text => text.length > 0);
                    
                    if (listItems.length > 0) {
                        // It's a list
                        details.additionalData[key] = listItems;
                    } else if (data.querySelector('div.plainlist')) {
                        // Handle plainlist format
                        const plainListItems = Array.from(data.querySelectorAll('div.plainlist li'))
                            .map(li => cleanTextContent(li))
                            .filter(text => text.length > 0);
                        details.additionalData[key] = plainListItems.length > 0 ? plainListItems : [cleanTextContent(data)];
                    } else if (data.querySelector('.hlist')) {
                        // Handle hlist format
                        const hlistItems = Array.from(data.querySelectorAll('.hlist li'))
                            .map(li => cleanTextContent(li))
                            .filter(text => text.length > 0);
                        details.additionalData[key] = hlistItems.length > 0 ? hlistItems : [cleanTextContent(data)];
                    } else {
                        // It's plain text
                        const value = cleanTextContent(data);
                        // Check if it might be a comma-separated list
                        if (value.includes(',')) {
                            details.additionalData[key] = value.split(',')
                                .map(item => item.trim())
                                .filter(item => item.length > 0);
                        } else {
                            details.additionalData[key] = value;
                        }
                    }

                    // Special handling for occupations
                    if (label.includes('occupation')) {
                        const occupations = Array.from(data.querySelectorAll('li'))
                            .map(li => cleanTextContent(li))
                            .filter(text => text.length > 0);
                        details.occupations = occupations.length > 0 ? 
                            occupations : 
                            cleanTextContent(data).split(',').map(o => o.trim()).filter(o => o.length > 0);
                    }
                }
            });
        }

        // Get organizations/teams
        const organizationsList = document.querySelectorAll('a[href*="team"], a[href*="club"], a[href*="organization"]');
        details.organizations = Array.from(organizationsList)
            .map(org => org.textContent?.trim())
            .filter((org): org is string => !!org);

        // Get content length as a rough measure of notability
        details.contentLength = document.querySelector('#mw-content-text')?.textContent?.length || 0;

        return details;
    } catch (error) {
        console.error('Error fetching Wikipedia page details:', error);
        return { contentLength: 0, additionalData: {} };
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

    // Create additionalData object with new information
    const additionalData: Record<string, unknown> = {
        fullName: pageDetails.fullName || name,
        birthPlace: pageDetails.birthPlace,
        organizations: pageDetails.organizations,
        wikiUrl: info.content_urls.desktop.page,
        ...pageDetails.additionalData
    };

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
        id: Math.floor(Math.random() * 1000000),
        additionalData,
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