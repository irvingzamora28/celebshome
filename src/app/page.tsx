import ZodiacGrid from "@/components/ZodiacGrid";
import FeaturedCelebrities from "@/components/FeaturedCelebrities";
import SearchBar from "@/components/SearchBar";

export default function Home() {
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
            Explore the astrological connections between you and your favorite celebrities
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
          <FeaturedCelebrities />
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
