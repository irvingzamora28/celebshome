import ZodiacGrid from '../components/ZodiacGrid';
import FeaturedCelebrities from '../components/FeaturedCelebrities';
import { ICelebrity } from '@/models/Celebrity';

async function getFeaturedCelebrities(): Promise<ICelebrity[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/celebrities/featured`, {
    cache: 'no-store'  // Disable caching to always get fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch featured celebrities');
  }
  return response.json();
}

export default async function Home() {
  const featuredCelebrities = await getFeaturedCelebrities();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Celebrity Zodiac Signs
          </h1>
          <p className="text-xl text-gray-600">
            Discover your favorite celebrities by their zodiac signs
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Browse by Zodiac Sign
          </h2>
          <ZodiacGrid />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Featured Celebrities
          </h2>
          <FeaturedCelebrities celebrities={featuredCelebrities} />
        </section>
      </div>
    </main>
  );
}
