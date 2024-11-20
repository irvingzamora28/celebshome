import { Celebrity, type DatabaseRow } from '../models/Celebrity';
import celebritiesData from '../data/enriched_celebrities.json';

class JsonDataService {
    private static instance: JsonDataService;
    private celebrities: DatabaseRow[];

    private constructor() {
        this.celebrities = celebritiesData as DatabaseRow[];
    }

    public static getInstance(): JsonDataService {
        if (!JsonDataService.instance) {
            JsonDataService.instance = new JsonDataService();
        }
        return JsonDataService.instance;
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
        const term = searchTerm.toLowerCase();
        
        const matchingCelebs = this.celebrities
            .filter(celeb => 
                celeb.name.toLowerCase().includes(term) || 
                celeb.biography.toLowerCase().includes(term)
            )
            .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
        return matchingCelebs.map(row => Celebrity.fromDatabaseRow(row));
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
