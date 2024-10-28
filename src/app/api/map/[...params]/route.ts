// app/api/map/[...params]/route.js

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: any) {
  const [z, x, y] = params.params;

  // Validate parameters
  if (!z || !x || !y) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    // Construct OSM tile URL
    const tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

    // Fetch the tile
    const response = await fetch(tileUrl, {
      headers: {
        "User-Agent": "GeoguessrClone/1.0 (Educational Project)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tile: ${response.statusText}`);
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Error fetching map tile:", error);
    return NextResponse.json(
      { error: "Failed to fetch map tile" },
      { status: 500 }
    );
  }
}
