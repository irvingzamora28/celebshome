import Image from "next/image";
import { ICelebrity } from "../../../models/Celebrity";
import BackButton from "./BackButton";
import { getZodiacEmoji } from "../../../utils/zodiac";
import { generateCelebrityMetadata } from "../../../utils/metadata";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getCelebrityProfile(slug: string): Promise<ICelebrity> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/celebrities/profile/${slug}`, {
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });
  
  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch celebrity profile: ${response.statusText}`);
  }

  return response.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const celebrity = await getCelebrityProfile(resolvedParams.slug);
  return generateCelebrityMetadata(celebrity);
}

export default async function CelebrityProfile({ params }: PageProps) {
  const resolvedParams = await params;
  const celebrity = await getCelebrityProfile(resolvedParams.slug);
  const birthDate = new Date(celebrity.dateOfBirth);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <BackButton />
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
          {/* Desktop Grid Layout */}
          <div className="relative md:grid md:grid-cols-3 md:items-center">
            {/* Image Section */}
            <div className="relative h-64 md:h-full md:col-span-1 overflow-hidden">
              <Image
                src={celebrity.imageUrl}
                alt={`Photo of ${celebrity.name}`}
                fill
                className="object-cover md:rounded-tl-3xl md:rounded-bl-none"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Text Overlay Section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:relative md:col-span-2 md:py-12 md:px-8 md:bg-indigo-100 md:backdrop-blur-md md:rounded-tr-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 md:text-indigo-900 md:text-left">
                {celebrity.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-lg opacity-90 md:text-gray-800">
                  {celebrity.profession}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-indigo-900">Birth Date</h2>
                <p className="text-indigo-600">
                  <time dateTime={celebrity.dateOfBirth}>
                    {birthDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-indigo-900">Zodiac Sign</h2>
                <p className="text-indigo-600 flex items-center gap-2">
                  {celebrity.zodiacSign}
                  <span className="text-2xl" aria-label={`${celebrity.zodiacSign} zodiac symbol`}>
                    {getZodiacEmoji(celebrity.zodiacSign)}
                  </span>
                </p>
              </div>
            </div>

            {celebrity.biography && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-indigo-900">Biography</h2>
                <p className="text-gray-700 leading-relaxed">{celebrity.biography}</p>
              </div>
            )}

            {celebrity.additionalData &&
              Object.entries(celebrity.additionalData).length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-indigo-900">
                    Additional Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(celebrity.additionalData)
                      .filter(
                        ([key]) =>
                          !["careerHighlights", "wikiUrl"].includes(key) &&
                          celebrity.additionalData?.[key] !== undefined
                      )
                      .map(([key, value]) => {
                        const formattedKey = key
                          .split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ");

                        return (
                          <div
                            key={key}
                            className="bg-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                          >
                            <h3 className="font-medium text-indigo-700">
                              {formattedKey}
                            </h3>
                            {Array.isArray(value) ? (
                              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-1">
                                {value.map((item, index) => (
                                  <li key={index} className="text-sm">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : typeof value === "string" ||
                              typeof value === "number" ? (
                              <p className="text-gray-700 text-sm mt-1">{value}</p>
                            ) : null}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            {celebrity.additionalData?.wikiUrl && (
              <div className="pt-4 border-t border-gray-200">
                <a
                  href={celebrity.additionalData.wikiUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read more about ${celebrity.name} on Wikipedia`}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  View on Wikipedia
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
