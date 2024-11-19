import { ICelebrity } from '@/models/Celebrity';
import Image from 'next/image';

interface FeaturedCelebritiesProps {
    celebrities: ICelebrity[];
}

export default function FeaturedCelebrities({ celebrities }: FeaturedCelebritiesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {celebrities.map((celebrity) => (
                <div
                    key={celebrity.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="relative h-48 w-full">
                        <Image
                            src={celebrity.imageUrl}
                            alt={celebrity.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {celebrity.name}
                            </h3>
                            <span className="text-2xl" title={celebrity.zodiacSign}>
                                {getZodiacEmoji(celebrity.zodiacSign)}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                            {celebrity.profession}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-2">
                            {celebrity.biography}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {new Date(celebrity.dateOfBirth).toLocaleDateString()}
                            </span>
                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getZodiacEmoji(sign: string): string {
    const zodiacEmojis: { [key: string]: string } = {
        'Aries': '♈',
        'Taurus': '♉',
        'Gemini': '♊',
        'Cancer': '♋',
        'Leo': '♌',
        'Virgo': '♍',
        'Libra': '♎',
        'Scorpio': '♏',
        'Sagittarius': '♐',
        'Capricorn': '♑',
        'Aquarius': '♒',
        'Pisces': '♓'
    };
    return zodiacEmojis[sign] || '⭐';
}
