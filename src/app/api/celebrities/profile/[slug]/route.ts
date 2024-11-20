import { NextRequest, NextResponse } from "next/server";
import { CelebrityController } from "../../../../../controllers/CelebrityController";

export async function GET(req: NextRequest) {
  try {
    // Extract the "slug" parameter from the URL
    const slug = req.nextUrl.pathname.split("/").pop();

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid request: missing slug" },
        { status: 400 }
      );
    }

    const controller = CelebrityController.getInstance();
    const celebrity = await controller.getCelebrityBySlug(slug);

    if (!celebrity) {
      return NextResponse.json(
        { error: "Celebrity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(celebrity);
  } catch (error) {
    console.error("Error fetching celebrity profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch celebrity profile" },
      { status: 500 }
    );
  }
}
