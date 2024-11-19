import { DatabaseService } from '@/services/DatabaseService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: {
    sign: string;
  };
}

function getZodiacEmoji(sign: string): string {
  const zodiacEmojis: { [key: string]: string } = {
    'aries': '♈',
    'taurus': '♉',
    'gemini': '♊',
    'cancer': '♋',
    'leo': '♌',
    'virgo': '♍',
    'libra': '♎',
    'scorpio': '♏',
    'sagittarius': '♐',
    'capricorn': '♑',
    'aquarius': '♒',
    'pisces': '♓'
  };
  return zodiacEmojis[sign.toLowerCase()] || '⭐';
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default async function ZodiacPage({ params }: PageProps) {
  const sign = params.sign.toLowerCase();
  const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  if (!validSigns.includes(sign)) {
    notFound();
  }

  const dbService = DatabaseService.getInstance();
  const celebrities = await dbService.getCelebritiesByZodiac(capitalizeFirstLetter(sign));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Zodiac Signs
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {capitalizeFirstLetter(sign)}
              </h1>
              <span className="text-5xl md:text-6xl" title={sign}>
                {getZodiacEmoji(sign)}
              </span>
            </div>
            <p className="text-xl text-gray-600">
              Discover celebrities born under the {sign} zodiac sign
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {celebrities.map((celebrity) => (
            <div
              key={celebrity.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={celebrity.imageUrl}
                  alt={celebrity.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {celebrity.name}
                  </h2>
                  <span className="text-xl" title={celebrity.zodiacSign}>
                    {getZodiacEmoji(celebrity.zodiacSign)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {celebrity.profession}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(celebrity.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {celebrities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No celebrities found for {capitalizeFirstLetter(sign)} at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
