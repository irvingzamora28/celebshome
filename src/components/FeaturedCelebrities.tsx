'use client';

import { ICelebrity } from '../models/Celebrity';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FeaturedCelebrities() {
    const [celebrities, setCelebrities] = useState<ICelebrity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedCelebrities = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
                const response = await fetch(`${baseUrl}/api/celebrities/featured`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch featured celebrities');
                }

                const data = await response.json();
                setCelebrities(data);
            } catch (error) {
                console.error('Error fetching featured celebrities:', error);
                setError('Failed to load featured celebrities');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedCelebrities();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden animate-pulse">
                        <div className="relative aspect-video bg-gray-200"></div>
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-8">
                <p>{error}</p>
            </div>
        );
    }

    if (!celebrities.length) {
        return (
            <div className="text-center text-gray-600 py-8">
                <p>No featured celebrities available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {celebrities.map((celebrity) => (
                <div
                    key={celebrity.id}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2"
                >
                    <Link
                        href={`/celebrity/${encodeURIComponent(celebrity.name)}-birth-${encodeURIComponent(celebrity.dateOfBirth)}`}
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