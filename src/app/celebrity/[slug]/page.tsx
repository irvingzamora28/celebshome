import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ICelebrity } from '@/models/Celebrity';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCelebrityProfile(slug: string): Promise<ICelebrity> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/celebrities/profile/${slug}`, {
    cache: 'force-cache', // Enable caching
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch celebrity profile');
  }

  return response.json();
}

function getZodiacEmoji(sign: string): string {
  const zodiacEmojis: { [key: string]: string } = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };
  return zodiacEmojis[sign] || '⭐';
}

export default async function CelebrityProfile({ params }: PageProps) {
  // Await the `params` object
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  console.log(`Fetching celebrity profile for ${slug}`);
  
  const celebrity = await getCelebrityProfile(slug);
  const birthDate = new Date(celebrity.dateOfBirth);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href={`/zodiac/${celebrity.zodiacSign.toLowerCase()}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to {celebrity.zodiacSign}
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-64 md:h-80">
            <Image
              src={celebrity.imageUrl}
              alt={celebrity.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {celebrity.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-lg opacity-90">
                  {celebrity.profession}
                </p>
                <span className="text-3xl" title={celebrity.zodiacSign}>
                  {getZodiacEmoji(celebrity.zodiacSign)}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Birth Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-indigo-900">Birth Date</h2>
                <p className="text-indigo-600">
                  {birthDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-indigo-900">Zodiac Sign</h2>
                <p className="text-indigo-600 flex items-center gap-2">
                  {celebrity.zodiacSign}
                  <span className="text-2xl">{getZodiacEmoji(celebrity.zodiacSign)}</span>
                </p>
              </div>
            </div>

            {/* Biography */}
            {celebrity.biography && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-indigo-900">Biography</h2>
                <p className="text-gray-600 leading-relaxed">
                  {celebrity.biography}
                </p>
              </div>
            )}

            {/* Career Highlights */}
            {(celebrity.additionalData?.careerHighlights as string[]) && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-indigo-900">Career Highlights</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {(celebrity.additionalData?.careerHighlights as string[])?.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
