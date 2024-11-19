import { NextResponse } from 'next/server';
import { CelebrityController } from '@/controllers/CelebrityController';

export async function GET() {
    try {
        const controller = new CelebrityController();
        const celebrities = await controller.getFeaturedCelebrities();
        return NextResponse.json(celebrities);
    } catch (error) {
        console.error('Error in featured celebrities API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured celebrities' },
            { status: 500 }
        );
    }
}
