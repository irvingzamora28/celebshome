import { NextRequest, NextResponse } from 'next/server';
import { CelebrityController } from '../../../../controllers/CelebrityController';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    const controller = new CelebrityController();
    const celebrities = await controller.searchCelebrities(query);

    return NextResponse.json(celebrities);
  } catch (error) {
    console.error('Error searching celebrities:', error);
    return NextResponse.json(
      { error: 'Failed to search celebrities' },
      { status: 500 }
    );
  }
}
