import { NextResponse } from "next/server";
import { CelebrityController } from "@/controllers/CelebrityController";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export async function GET(
  request: Request,
  { params }: { params: { sign: string } }
) {
  const { sign } = params;

  const validSigns = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];

  if (!validSigns.includes(sign.toLowerCase())) {
    return NextResponse.json({ error: "Invalid zodiac sign" }, { status: 400 });
  }

  try {
    const controller = new CelebrityController();
    // Capitalize the first letter of the zodiac sign to match database format
    const celebrities = await controller.getCelebritiesByZodiac(capitalizeFirstLetter(sign));
    
    if (!celebrities || celebrities.length === 0) {
      console.log(`No celebrities found for zodiac sign ${sign}`);
    } else {
      console.log(`Found ${celebrities.length} celebrities for zodiac sign ${sign}`);
    }
    
    return NextResponse.json(celebrities);
  } catch (error) {
    console.error(`Error fetching celebrities for zodiac sign ${sign}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch celebrities for zodiac sign ${sign}` },
      { status: 500 }
    );
  }
}
