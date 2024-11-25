'use client';

import { ICelebrity } from '../models/Celebrity';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { getZodiacEmoji } from "../utils/zodiac";
import { useImageDimensions } from '../hooks/useImageDimensions';
import { useRouter } from 'next/navigation';

const CelebrityCard = ({ 
    celebrity, 
    isLoading,
    isActiveCard, 
    onCardClick 
}: { 
    celebrity: ICelebrity;
    isLoading: boolean;
    isActiveCard: boolean;
    onCardClick: (celebrity: ICelebrity) => void;
}) => {
    const dimensions = useImageDimensions(celebrity.imageUrl);
    const aspectRatioClass = dimensions?.isPortrait ? 'aspect-[3/4]' : 'aspect-video';

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLoading) return;
        onCardClick(celebrity);
    };

    return (
        <div 
            className={`relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${isLoading ? 'cursor-wait' : 'cursor-pointer'} ${isActiveCard ? 'opacity-50' : ''}`}
            onClick={handleClick}
        >
            {isActiveCard && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <div className="block group">
                <div className={`relative ${aspectRatioClass} overflow-hidden`}>
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
                        <h3 className="text-xl font-bold text-indigo-900 line-clamp-1">
                            {celebrity.name}
                        </h3>
                        <span className="text-3xl flex-shrink-0 ml-2" title={celebrity.zodiacSign}>
                            {getZodiacEmoji(celebrity.zodiacSign)}
                        </span>
                    </div>
                    <p className="text-indigo-600 text-sm mb-2 font-medium line-clamp-1">
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
            </div>
        </div>
    );
};

export default function FeaturedCelebrities() {
    const [celebrities, setCelebrities] = useState<ICelebrity[]>([]);
    const [isPending, startTransition] = useTransition();
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const router = useRouter();

    const handleCardClick = (celebrity: ICelebrity) => {
        setActiveCardId(`${celebrity.name}-${celebrity.dateOfBirth}`);
        startTransition(() => {
            router.push(`/celebrity/${encodeURIComponent(celebrity.name)}-birth-${encodeURIComponent(celebrity.dateOfBirth)}`);
        });
    };

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
            } finally {
            }
        };

        fetchFeaturedCelebrities();
    }, []);

    if (!celebrities.length) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden animate-pulse">
                        <div className="relative aspect-[3/4] bg-gray-200"></div>
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900">Featured Celebrities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {celebrities.map((celebrity) => {
                    const cardId = `${celebrity.name}-${celebrity.dateOfBirth}`;
                    return (
                        <CelebrityCard 
                            key={cardId}
                            celebrity={celebrity}
                            isLoading={isPending}
                            isActiveCard={cardId === activeCardId}
                            onCardClick={handleCardClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}
