export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rsvps = await prisma.rSVP.findMany({
      orderBy: { createdAt: "desc" },
    });

    const messages = await prisma.livreOr.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ rsvps, messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}