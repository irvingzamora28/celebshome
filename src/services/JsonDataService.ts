import { Celebrity, type DatabaseRow } from '../models/Celebrity';
import celebritiesData from '../data/enriched_celebrities.json';

class JsonDataService {
    private static instance: JsonDataService;
    private celebrities: DatabaseRow[];
    private searchIndex: Map<string, DatabaseRow[]> = new Map();

    private constructor() {
        this.celebrities = celebritiesData as DatabaseRow[];
        this.buildSearchIndex();
    }

    public static getInstance(): JsonDataService {
        if (!JsonDataService.instance) {
            JsonDataService.instance = new JsonDataService();
        }
        return JsonDataService.instance;
    }

    private buildSearchIndex(): void {
        // Index by name words
        this.celebrities.forEach(celeb => {
            const nameWords = celeb.name.toLowerCase().split(/\s+/);
            nameWords.forEach(word => {
                if (word.length > 2) { // Skip very short words
                    const existing = this.searchIndex.get(word) || [];
                    existing.push(celeb);
                    this.searchIndex.set(word, existing);
                }
            });
        });
    }

    public async getFeaturedCelebrities(limit: number = 10): Promise<Celebrity[]> {
        const sortedCelebs = [...this.celebrities]
            .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
            .slice(0, limit);
        return sortedCelebs.map(row => Celebrity.fromDatabaseRow(row));
    }

    public async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
        const matchingCelebs = this.celebrities
            .filter(celeb => celeb.zodiac_sign.toLowerCase() === zodiacSign.toLowerCase())
            .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
        return matchingCelebs.map(row => Celebrity.fromDatabaseRow(row));
    }

    public async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
        const terms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length > 2);
        if (terms.length === 0) return [];

        // First try exact name matches
        const exactMatches = new Set(
            this.celebrities.filter(celeb => 
                celeb.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        // Then try indexed word matches
        const indexMatches = new Set<DatabaseRow>();
        terms.forEach(term => {
            const matches = this.searchIndex.get(term) || [];
            matches.forEach(match => indexMatches.add(match));
        });

        // If we have very few matches, try biography search
        if (exactMatches.size + indexMatches.size < 5) {
            const bioMatches = this.celebrities.filter(celeb => 
                celeb.biography.toLowerCase().includes(searchTerm.toLowerCase())
            );
            bioMatches.forEach(match => indexMatches.add(match));
        }

        // Combine and sort results
        const allMatches = [...new Set([...exactMatches, ...indexMatches])]
            .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));

        return allMatches.map(row => Celebrity.fromDatabaseRow(row));
    }

    public async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
        try {
            const decodedSlug = decodeURIComponent(slug);
            const [name, birthDateStr] = decodedSlug.split('-birth-');
            if (!name || !birthDateStr) {
                throw new Error(`Invalid slug format: ${slug}`);
            }

            const celebrity = this.celebrities.find(
                celeb => celeb.name === name && celeb.date_of_birth === birthDateStr
            );

            return celebrity ? Celebrity.fromDatabaseRow(celebrity) : null;
        } catch (error) {
            console.error('Error in getCelebrityBySlug:', error);
            return null;
        }
    }
}

export default JsonDataService;
