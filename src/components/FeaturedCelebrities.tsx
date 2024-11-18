import Image from 'next/image';
import { Celebrity } from '../types/celebrity';

interface FeaturedCelebritiesProps {
    celebrities: Celebrity[];
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
                            src={celebrity.image_url}
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
                            <span className="text-2xl" title={celebrity.zodiac_sign}>
                                {getZodiacEmoji(celebrity.zodiac_sign)}
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
                                {new Date(celebrity.date_of_birth).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                                {Object.entries(JSON.parse(celebrity.social_links)).map(([platform, link]) => (
                                    <a
                                        key={platform}
                                        href={String(link)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {platform}
                                    </a>
                                ))}
                            </div>
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
