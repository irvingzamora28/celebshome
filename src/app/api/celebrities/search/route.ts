import { NextRequest, NextResponse } from 'next/server';
import { CelebrityController } from '../../../../controllers/CelebrityController';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const controller = CelebrityController.getInstance();
    const celebrities = await controller.searchCelebrities(query);

    return NextResponse.json(celebrities);
  } catch (error) {
    console.error('Error in /api/celebrities/search:', error);
    return NextResponse.json(
      { error: 'Failed to search celebrities' },
      { status: 500 }
    );
  }
}
