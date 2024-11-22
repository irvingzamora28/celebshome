import { JSDOM } from 'jsdom';
import { type DatabaseRow } from '../models/Celebrity';

export interface WikipediaPageInfo {
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

export async function getWikipediaInfo(name: string): Promise<WikipediaPageInfo | null> {
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

export async function getWikipediaPageDetails(url: string): Promise<{
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
                            if (deathDate) {
                                details.deathDate = deathDate;
                            }
                        }
                    }
                    // Get occupation
                    else if (label.includes('occupation')) {
                        const occupations = Array.from(data.querySelectorAll('a'))
                            .map(a => cleanTextContent(a))
                            .filter(Boolean);
                        if (occupations.length > 0) {
                            details.occupations = occupations;
                        }
                    }
                    // Get organizations/companies
                    else if (label.includes('organization') || label.includes('employer')) {
                        const organizations = Array.from(data.querySelectorAll('a'))
                            .map(a => cleanTextContent(a))
                            .filter(Boolean);
                        if (organizations.length > 0) {
                            details.organizations = organizations;
                        }
                    }
                    // Store other relevant information
                    else {
                        details.additionalData[label] = cleanTextContent(data);
                    }
                }
            });
        }

        // Get content length
        const content = document.querySelector('#mw-content-text');
        if (content) {
            details.contentLength = content.textContent?.length || 0;
        }

        return details;
    } catch (error) {
        console.error(`Error fetching Wikipedia page details:`, error);
        return { contentLength: 0, additionalData: {} };
    }
}

export function getZodiacSign(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
}

export async function enrichCelebrity(name: string): Promise<DatabaseRow | null> {
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
    const popularityScore = Math.min(100, Math.round((pageDetails.contentLength / 100000) * 100));

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
        popularity_score: popularityScore,
        created_at: new Date().toISOString(),
        id: Math.floor(Math.random() * 1000000),
        additional_data: additionalData,
    };
}
