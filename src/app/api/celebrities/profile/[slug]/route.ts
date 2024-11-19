import { NextRequest, NextResponse } from 'next/server';
import { CelebrityController } from '@/controllers/CelebrityController';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const controller = new CelebrityController();
    const celebrity = await controller.getCelebrityBySlug(params.slug);

    if (!celebrity) {
      return NextResponse.json(
        { error: 'Celebrity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(celebrity);
  } catch (error) {
    console.error('Error fetching celebrity profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch celebrity profile' },
      { status: 500 }
    );
  }
}
