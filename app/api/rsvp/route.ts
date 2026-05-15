export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nom, statut } = await req.json();

    if (!nom || !statut) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const rsvp = await prisma.rSVP.create({
      data: { nom, statut },
    });

    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}