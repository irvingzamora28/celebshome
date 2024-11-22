import { Celebrity } from '../models/Celebrity';
import { supabase } from '../lib/supabase';

export class SupabaseCelebrityService {
  private static instance: SupabaseCelebrityService;

  private constructor() {}

  public static getInstance(): SupabaseCelebrityService {
    if (!SupabaseCelebrityService.instance) {
      SupabaseCelebrityService.instance = new SupabaseCelebrityService();
    }
    return SupabaseCelebrityService.instance;
  }

  public async getCelebrityBySlug(slug: string): Promise<Celebrity | null> {
    try {
      const [name, birthDateStr] = decodeURIComponent(slug).split('-birth-');
      if (!name || !birthDateStr) {
        throw new Error(`Invalid slug format: ${slug}`);
      }

      const { data, error } = await supabase
        .from('celebrities')
        .select()
        .eq('name', name)
        .eq('date_of_birth', birthDateStr)
        .single();

      if (error) throw error;
      return data ? Celebrity.fromDatabaseRow(data) : null;
    } catch (error) {
      console.error('Error in getCelebrityBySlug:', error);
      return null;
    }
  }

  public async getFeaturedCelebrities(limit: number = 10): Promise<Celebrity[]> {
    const { data, error } = await supabase
      .from('celebrities')
      .select()
      .order('popularity_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured celebrities:', error);
      return [];
    }

    return data.map(row => Celebrity.fromDatabaseRow(row));
  }

  public async searchCelebrities(searchTerm: string): Promise<Celebrity[]> {
    const { data, error } = await supabase
      .from('celebrities')
      .select()
      .or(`name.ilike.%${searchTerm}%,biography.ilike.%${searchTerm}%`)
      .order('popularity_score', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching celebrities:', error);
      return [];
    }

    return data.map(row => Celebrity.fromDatabaseRow(row));
  }

  public async getCelebritiesByZodiac(zodiacSign: string): Promise<Celebrity[]> {
    const { data, error } = await supabase
      .from('celebrities')
      .select()
      .eq('zodiac_sign', zodiacSign)
      .order('popularity_score', { ascending: false });

    if (error) {
      console.error('Error fetching celebrities by zodiac:', error);
      return [];
    }

    return data.map(row => Celebrity.fromDatabaseRow(row));
  }
}
