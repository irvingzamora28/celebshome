import { notFound } from 'next/navigation';
import ZodiacClientPage from './ZodiacClientPage';

interface PageProps {
  params: {
    sign: string;
  };
}

async function getCelebritiesByZodiac(sign: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/celebrities/zodiac/${sign}`, {
    cache: 'no-store'  // Disable caching to always get fresh data
  });
  
  if (!response.ok) {
    if (response.status === 400) {
      notFound();
    }
    throw new Error('Failed to fetch celebrities');
  }
  
  return response.json();
}

export default async function ZodiacPage({ params }: PageProps) {
  const sign = params.sign.toLowerCase();
  const validSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  if (!validSigns.includes(sign)) {
    notFound();
  }

  const celebrities = await getCelebritiesByZodiac(sign);
  
  return <ZodiacClientPage sign={sign} celebrities={celebrities} />;
}