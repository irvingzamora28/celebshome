import ZodiacGrid from "@/components/ZodiacGrid";
import FeaturedCelebrities from "@/components/FeaturedCelebrities";
import SearchBar from "@/components/SearchBar";
import { ICelebrity } from "@/models/Celebrity";

async function getFeaturedCelebrities(): Promise<ICelebrity[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/celebrities/featured`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch featured celebrities");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching featured celebrities:", error);
    return []; // Fallback to an empty array
  }
}


export default async function Home() {
  const featuredCelebrities = await getFeaturedCelebrities();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-block bg-indigo-100 px-4 py-2 rounded-full text-indigo-800 text-sm font-medium">
            Discover Your Celestial Connections
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-900 leading-tight">
            Celebrity Zodiac Signs
          </h1>
          <p className="text-xl text-indigo-600 max-w-2xl mx-auto">
            Explore the cosmic connections of your favorite celebrities through
            their zodiac signs
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-16">
          <SearchBar />
        </section>

        {/* Zodiac Grid Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-indigo-900">
              Browse by Zodiac Sign
            </h2>
            <div className="h-0.5 bg-indigo-200 flex-grow ml-6"></div>
          </div>
          <ZodiacGrid />
        </section>

        {/* Featured Celebrities Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-indigo-900">
              Featured Celebrities
            </h2>
            <div className="h-0.5 bg-indigo-200 flex-grow ml-6"></div>
          </div>
          <FeaturedCelebrities celebrities={featuredCelebrities} />
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Celebrity Zodiac Signs | Cosmic Connections",
  description: "Discover and explore celebrities through their zodiac signs",
  icons: {
    icon: "/favicon.ico",
  },
};
