export const defaultMetadata = {
  title: 'CelebsHome - Celebrity Zodiac Signs & Birthdays',
  description: 'Discover your favorite celebrities\' zodiac signs, birthdays, and astrological profiles. Explore celebrities by zodiac sign and learn about their cosmic connections.',
  keywords: 'celebrity zodiac signs, celebrity birthdays, celebrity astrology, famous people zodiac signs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'CelebsHome',
    images: [{
      url: '/og',
      width: 1200,
      height: 630,
      alt: 'CelebsHome - Celebrity Zodiac Signs',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CelebsHome - Celebrity Zodiac Signs & Birthdays',
    description: 'Discover your favorite celebrities\' zodiac signs, birthdays, and astrological profiles.',
    images: ['/og'],
  },
};

export function generateCelebrityMetadata(celebrity: {
  name: string;
  zodiacSign: string;
  dateOfBirth: string;
  profession: string;
  imageUrl?: string;
}) {
  const title = `${celebrity.name} - ${celebrity.zodiacSign} Zodiac Sign & Birthday | CelebsHome`;
  const description = `Learn about ${celebrity.name}, born on ${new Date(celebrity.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. ${celebrity.name} is a ${celebrity.zodiacSign} and works as a ${celebrity.profession}. Discover more about their astrological profile.`;
  
  return {
    title,
    description,
    keywords: `${celebrity.name}, ${celebrity.name} zodiac sign, ${celebrity.name} birthday, ${celebrity.zodiacSign} celebrities`,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: celebrity.imageUrl ? [{
        url: celebrity.imageUrl,
        width: 800,
        height: 800,
        alt: `Photo of ${celebrity.name}`,
      }] : defaultMetadata.openGraph.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: celebrity.imageUrl ? [celebrity.imageUrl] : defaultMetadata.twitter.images,
    },
  };
}

export function generateZodiacSignMetadata(sign: string) {
  const title = `${sign} Celebrities - Famous People Born Under ${sign} Zodiac Sign | CelebsHome`;
  const description = `Discover famous ${sign} celebrities and their birthdays. Learn about well-known actors, musicians, and other celebrities born under the ${sign} zodiac sign and their astrological traits.`;
  
  return {
    title,
    description,
    keywords: `${sign} celebrities, famous ${sign}, ${sign} zodiac sign, ${sign} famous people, ${sign} birthdays`,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
    },
  };
}
