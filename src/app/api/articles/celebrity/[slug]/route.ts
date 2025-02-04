// src/app/api/articles/celebrity/[slug]/route.ts
import { CelebrityController } from '@/controllers/CelebrityController';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest
) {
  try {
    // Extract the "slug" parameter from the URL
    const slug = request.nextUrl.pathname.split("/").pop();

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid request: missing slug" },
        { status: 400 }
      );
    }

    const controller = CelebrityController.getInstance();
    const celebrity = await controller.getCelebrityBySlug(slug);
    console.log("celebrity", celebrity);
    
    if (!celebrity) {
        return NextResponse.json(
          { error: "Celebrity not found" },
          { status: 404 }
        );
      }

    const { data, error } = await supabase
      .from('articles')
      .select('id, title, content, created_at')
      .eq('celebrity_id', celebrity.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(data);
    if (!data || data.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}