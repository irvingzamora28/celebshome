"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getZodiacEmoji } from "../../../utils/zodiac";

interface Celebrity {
  id: number;
  name: string;
  dateOfBirth: string;
  imageUrl: string;
  profession?: string;
  zodiacSign: string;
}

interface ZodiacClientPageProps {
  sign: string;
  celebrities: Celebrity[];
}

interface Filters {
  search: string;
  profession: string;
  birthYear: string;
}


export default function ZodiacClientPage({ sign, celebrities }: ZodiacClientPageProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    profession: '',
    birthYear: '',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [uniqueProfessions, setUniqueProfessions] = useState<string[]>([]);
  const [uniqueBirthYears, setUniqueBirthYears] = useState<string[]>([]);
  const [filteredCelebrities, setFilteredCelebrities] = useState<Celebrity[]>(celebrities);

  useEffect(() => {
    const professions = Array.from(new Set(
      celebrities.map(c => c.profession).filter(Boolean) as string[]
    )).sort();

    const birthYears = Array.from(new Set(
      celebrities.map(c => new Date(c.dateOfBirth).getFullYear().toString())
      .filter(Boolean)
    )).sort((a, b) => b.localeCompare(a));

    setUniqueProfessions(professions);
    setUniqueBirthYears(birthYears);
  }, [celebrities]);

  useEffect(() => {
    const filtered = celebrities.filter((celebrity) => {
      const matchesSearch = !filters.search || 
        celebrity.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesProfession = !filters.profession || 
        celebrity.profession?.includes(filters.profession);
      
      const matchesBirthYear = !filters.birthYear || 
        new Date(celebrity.dateOfBirth).getFullYear().toString() === filters.birthYear;

      return matchesSearch && matchesProfession && matchesBirthYear;
    });

    setFilteredCelebrities(filtered);
  }, [celebrities, filters]);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
        </div>

        {/* Zodiac Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-extrabold text-indigo-900">
              {sign.charAt(0).toUpperCase() + sign.slice(1)}
            </h1>
            <span className="text-6xl" title={sign}>
              {getZodiacEmoji(sign)}
            </span>
          </div>
          <p className="text-xl text-indigo-600 font-medium">
            Discover celebrities born under the {sign} zodiac sign
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 gap-6">
            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-indigo-800 mb-2">
                Search by Name
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  id="search"
                  placeholder="Search celebrities..."
                  autoComplete='off'
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="flex-grow px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all text-slate-600"
                />
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Profession Filter */}
                <div>
                  <label htmlFor="profession" className="block text-sm font-semibold text-indigo-800 mb-2">
                    Filter by Profession
                  </label>
                  <select
                    id="profession"
                    value={filters.profession}
                    onChange={(e) => handleFilterChange('profession', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="">All Professions</option>
                    {uniqueProfessions.map((profession) => (
                      <option key={profession} value={profession}>
                        {profession}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Birth Year Filter */}
                <div>
                  <label htmlFor="birthYear" className="block text-sm font-semibold text-indigo-800 mb-2">
                    Filter by Birth Year
                  </label>
                  <select
                    id="birthYear"
                    value={filters.birthYear}
                    onChange={(e) => handleFilterChange('birthYear', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="">All Years</option>
                    {uniqueBirthYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Celebrity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCelebrities.map((celebrity) => (
            <Link
              key={celebrity.id}
              href={`/celebrity/${encodeURIComponent(celebrity.name)}-birth-${encodeURIComponent(celebrity.dateOfBirth)}`}
              className="block"
            >
              <div
      key={celebrity.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col items-center"
    >
      {/* Reduced Image Size */}
      <div className="relative w-20 h-20 mt-4">
        <Image
          src={celebrity.imageUrl}
          alt={celebrity.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover rounded-full border-4 border-indigo-200"
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* Details */}
      <div className="p-4 text-center w-full">
        <h2 className="text-lg font-bold text-indigo-900 mb-1">{celebrity.name}</h2>
        {celebrity.profession && (
          <p className="text-sm text-indigo-600 mb-1">{celebrity.profession}</p>
        )}
        <p className="text-xs text-gray-500">
          Born: {new Date(celebrity.dateOfBirth).toLocaleDateString()}
        </p>
      </div>
    </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCelebrities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-indigo-600 text-lg">
              No celebrities found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}