import { NextResponse } from 'next/server';
import { CelebrityController } from '../../../../controllers/CelebrityController';

export async function GET() {
    const startTime = Date.now();
    console.log('Start processing /api/celebrities/featured');
  
    try {
      const controller = CelebrityController.getInstance();
      const celebrities = await controller.getFeaturedCelebrities(10);
  
      console.log(`Fetched ${celebrities.length} celebrities`);
      return NextResponse.json(celebrities);
    } catch (error) {
      console.error('Error in /api/celebrities/featured:', error);
      return NextResponse.json(
        { error: 'Failed to fetch featured celebrities' },
        { status: 500 }
      );
    } finally {
      const endTime = Date.now();
      console.log(`Finished processing in ${endTime - startTime}ms`);
    }
}
