import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { nom, musique } = await req.json();
    if (!nom || !musique) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }
    const entry = await prisma.musique.create({
      data: { nom, musique },
    });
    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const musiques = await prisma.musique.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ musiques });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}