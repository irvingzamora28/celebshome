// scripts/content-storage.ts
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '../../lib/supabase';


// src/scripts/articles/content-storage.ts
interface ArticleData {
    celebrityName: string; // Changed from celebrityId
    title: string;
    content: string;
    format: 'md' | 'json';
    sources: string[];
  }
  
  export async function storeArticle(data: ArticleData) {
    try {
      // Fetch celebrity ID
      const { data: celebrity, error: celebError } = await supabase
        .from('celebrities')
        .select('id')
        .eq('name', data.celebrityName)
        .single();
  
      if (celebError || !celebrity) {
        throw new Error(`Celebrity "${data.celebrityName}" not found`);
      }
  
      // Local storage
      const fileName = `${data.celebrityName.toLowerCase().replace(/ /g, '_')}_${Date.now()}.${data.format}`;
      const filePath = path.join(process.cwd(), 'articles', fileName);
      
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, data.content);
      
      // Supabase storage
      const { error } = await supabase
        .from('articles')
        .insert([{
          celebrity_id: celebrity.id, // Use fetched ID
          content: data.content,
          title: data.title,
          format: data.format,
          sources: data.sources,
          local_path: fileName
        }]);
  
      if (error) throw error;
  
      return { filePath };
    } catch (error: unknown) {
      throw new Error(`Storage failed: ${(error as Error).message ?? 'unknown error'}`);
    }
  }