import { ICelebrity } from '@/models/Celebrity';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedCelebritiesProps {
    celebrities: ICelebrity[];
}

export default function FeaturedCelebrities({ celebrities }: FeaturedCelebritiesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {celebrities.map((celebrity) => (
                <div
                    key={celebrity.id}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
                >
                    <Link
                        href={`/celebrity/${encodeURIComponent(celebrity.name)}-${encodeURIComponent(celebrity.dateOfBirth)}`}
                        className="block"
                    >
                        <div className="relative aspect-video">
                            <Image
                                src={celebrity.imageUrl}
                                alt={celebrity.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-bold text-indigo-900">
                                    {celebrity.name}
                                </h3>
                                <span className="text-3xl" title={celebrity.zodiacSign}>
                                    {getZodiacEmoji(celebrity.zodiacSign)}
                                </span>
                            </div>
                            <p className="text-indigo-600 text-sm mb-2 font-medium">
                                {celebrity.profession === 'Unknown' ? '' : celebrity.profession}
                            </p>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {celebrity.biography}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Born: {new Date(celebrity.dateOfBirth).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

function getZodiacEmoji(sign: string): string {
    const zodiacEmojis: { [key: string]: string } = {
        'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 
        'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 
        'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    return zodiacEmojis[sign] || '⭐';
}