'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ICelebrity } from '../models/Celebrity';
import { getZodiacEmoji } from "../utils/zodiac";

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ICelebrity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchCache = useState<Map<string, ICelebrity[]>>(new Map())[0];

  useEffect(() => {
    const searchCelebrities = async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setResults([]);
        return;
      }

      if (searchCache.has(trimmedQuery)) {
        setResults(searchCache.get(trimmedQuery)!);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/celebrities/search?query=${encodeURIComponent(trimmedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          searchCache.set(trimmedQuery, data);
          if (searchCache.size > 50) {
            const keys = Array.from(searchCache.keys());
            if (keys.length > 0) {
              searchCache.delete(keys[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error searching celebrities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCelebrities, 400);
    return () => clearTimeout(debounceTimer);
  }, [query, searchCache]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search celebrities..."
          className="w-full px-6 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg border-2 border-indigo-100 dark:border-indigo-900 focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:outline-none transition-all text-lg text-slate-600 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        )}
      </div>

      {showResults && (query.trim() !== '') && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900 max-h-96 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((celebrity) => (
                <Link
                  key={celebrity.id}
                  href={`/celebrity/${encodeURIComponent(celebrity.name)}-birth-${encodeURIComponent(celebrity.dateOfBirth)}`}
                  className="flex items-center gap-4 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={celebrity.imageUrl}
                      alt={celebrity.name}
                      fill
                      sizes="48px"
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">{celebrity.name}</h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-300">{celebrity.profession}</p>
                  </div>
                  <div className="text-2xl" title={celebrity.zodiacSign}>
                    {getZodiacEmoji(celebrity.zodiacSign)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No celebrities found
            </div>
          )}
        </div>
      )}

      {showResults && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}