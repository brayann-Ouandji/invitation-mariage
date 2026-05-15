export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST — enregistrer un message
export async function POST(req: NextRequest) {
  try {
    const { nom, message } = await req.json();

    if (!nom || !message) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const entry = await prisma.livreOr.create({
      data: { nom, message },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET — récupérer les 3 derniers messages
export async function GET() {
  try {
    const messages = await prisma.livreOr.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}