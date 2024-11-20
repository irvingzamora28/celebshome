import { Celebrity } from '../models/Celebrity';
import JsonDataService from '../services/JsonDataService';

export class CelebrityController {
    private static instance: CelebrityController;
    private dataService: JsonDataService;

    private constructor() {
        this.dataService = JsonDataService.getInstance();
    }

    public static getInstance(): CelebrityController {
        if (!CelebrityController.instance) {
            CelebrityController.instance = new CelebrityController();
        }
        return CelebrityController.instance;
    }

    public async getFeaturedCelebrities(limit: number = 10): Promise<Celebrity[]> {
        try {
            return await this.dataService.getFeaturedCelebrities(limit);
        } catch (error) {
            console.error('Error fetching featured celebrities:', error);
            throw new Error('Failed to fetch featured celebrities');
        }
    }

    public async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
        try {
            return await this.dataService.getCelebritiesByZodiac(zodiacSign);
        } catch (error) {
            console.error('Error fetching celebrities by zodiac:', error);
            throw new Error('Failed to fetch celebrities by zodiac sign');
        }
    }

    public async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
        try {
            return await this.dataService.searchCelebrities(searchTerm);
        } catch (error) {
            console.error('Error searching celebrities:', error);
            throw new Error('Failed to search celebrities');
        }
    }

    public async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
        try {
            return await this.dataService.getCelebrityBySlug(slug);
        } catch (error) {
            console.error('Error fetching celebrity by slug:', error);
            throw new Error('Failed to fetch celebrity profile');
        }
    }
}
