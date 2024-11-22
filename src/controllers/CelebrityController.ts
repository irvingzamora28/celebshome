import { Celebrity } from '../models/Celebrity';
import { SupabaseCelebrityService } from '../services/SupabaseCelebrityService';

export class CelebrityController {
  private static instance: CelebrityController;
  private dataService: SupabaseCelebrityService;

  private constructor() {
    this.dataService = SupabaseCelebrityService.getInstance();
  }

  public static getInstance(): CelebrityController {
    if (!CelebrityController.instance) {
      CelebrityController.instance = new CelebrityController();
    }
    return CelebrityController.instance;
  }

  public async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
    try {
      return await this.dataService.getCelebrityBySlug(slug);
    } catch (error) {
      console.error('Error fetching celebrity by slug:', error);
      throw new Error('Failed to fetch celebrity profile');
    }
  }

  public async getFeaturedCelebrities(limit?: number): Promise<Celebrity[]> {
    try {
      return await this.dataService.getFeaturedCelebrities(limit);
    } catch (error) {
      console.error('Error fetching featured celebrities:', error);
      return [];
    }
  }

  public async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
    try {
      return await this.dataService.searchCelebrities(searchTerm);
    } catch (error) {
      console.error('Error searching celebrities:', error);
      return [];
    }
  }

  public async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
    try {
      return await this.dataService.getCelebritiesByZodiac(zodiacSign);
    } catch (error) {
      console.error('Error fetching celebrities by zodiac:', error);
      return [];
    }
  }
}
