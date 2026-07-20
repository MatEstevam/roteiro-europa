import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST: generate a share token for the trip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Autenticacao necessaria" },
      { status: 401 }
    );
  }

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Viagem nao encontrada" },
      { status: 404 }
    );
  }

  const shareToken = trip.shareToken ?? crypto.randomUUID();

  if (!trip.shareToken) {
    await prisma.trip.update({
      where: { id },
      data: { shareToken },
    });
  }

  const shareUrl = `${request.nextUrl.origin}/viagens/${id}?shareToken=${shareToken}`;

  return NextResponse.json({ shareToken, shareUrl });
}
