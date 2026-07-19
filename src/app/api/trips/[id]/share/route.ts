import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// POST: generate a share token for the trip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const shareToken = uuidv4();
  const shareUrl = `${request.nextUrl.origin}/viagens/${id}?shareToken=${shareToken}`;

  return NextResponse.json({
    shareToken,
    shareUrl,
  });
}
