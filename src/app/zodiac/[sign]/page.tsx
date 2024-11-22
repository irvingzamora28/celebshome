import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { generateZodiacSignMetadata } from '../../../utils/metadata';
import ZodiacClientPage from './ZodiacClientPage';

interface PageProps {
  params: Promise<{ sign: string }>;
}

async function getCelebritiesByZodiac(sign: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/celebrities/zodiac/${sign}`, {
    cache: 'force-cache', // Enable caching
    next: { revalidate: 3600 }, // Revalidate once every hour
  });

  if (!response.ok) {
    if (response.status === 400) {
      notFound();
    }
    throw new Error('Failed to fetch celebrities');
  }

  return response.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const sign = resolvedParams.sign.toLowerCase();
  return generateZodiacSignMetadata(sign);
}

export default async function ZodiacSignPage({ params }: PageProps) {
  const resolvedParams = await params;
  const sign = resolvedParams.sign.toLowerCase();
  const validSigns = [
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
  ];

  if (!validSigns.includes(sign)) {
    notFound();
  }

  const celebrities = await getCelebritiesByZodiac(sign);
  return <ZodiacClientPage sign={sign} celebrities={celebrities} />;
}
