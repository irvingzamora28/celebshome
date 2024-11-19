import { NextResponse } from "next/server";
import { CelebrityController } from "@/controllers/CelebrityController";

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
    const celebrities = await controller.getCelebritiesByZodiac(sign);
    return NextResponse.json(celebrities);
  } catch (error) {
    console.error(`Error fetching celebrities for zodiac sign ${sign}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch celebrities for zodiac sign ${sign}` },
      { status: 500 }
    );
  }
}
