import { DatabaseService } from "../services/DatabaseService";
import { Celebrity } from "../models/Celebrity";

export class CelebrityController {
    private dbService: DatabaseService;

    constructor() {
        this.dbService = DatabaseService.getInstance();
    }

    async getFeaturedCelebrities(): Promise<Celebrity[]> {
        try {
            return await this.dbService.getFeaturedCelebrities(10);
        } catch (error) {
            console.error("Error fetching featured celebrities:", error);
            throw new Error("Failed to fetch featured celebrities");
        }
    }

    async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
        try {
            return await this.dbService.getCelebritiesByZodiac(zodiacSign);
        } catch (error) {
            console.error(`Error fetching celebrities for zodiac sign ${zodiacSign}:`, error);
            throw new Error(`Failed to fetch celebrities for zodiac sign ${zodiacSign}`);
        }
    }

    async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
        try {
            return await this.dbService.searchCelebrities(searchTerm);
        } catch (error) {
            console.error(`Error searching celebrities with term ${searchTerm}:`, error);
            throw new Error("Failed to search celebrities");
        }
    }

    async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
        try {
            return await this.dbService.getCelebrityBySlug(slug);
        } catch (error) {
            console.error(`Error fetching celebrity by slug ${slug}:`, error);
            throw new Error(`Failed to fetch celebrity by slug ${slug}`);
        }
    }
}
