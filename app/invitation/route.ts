export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nom = searchParams.get("nom");

    if (!nom) {
      return NextResponse.json({ error: "Nom manquant" }, { status: 400 });
    }

    const rsvp = await prisma.rSVP.findFirst({
      where: {
        nom: { equals: nom, mode: "insensitive" },
        statut: "confirme",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ table: rsvp?.table ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}