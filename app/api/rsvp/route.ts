export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize";

export async function POST(req: NextRequest) {
  try {
    const { nom, statut } = await req.json();

    if (!nom || !statut) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const nomNormalise = normalizeName(nom);

    // Vérifie si une personne avec un nom équivalent existe déjà
    const tousLesRsvps = await prisma.rSVP.findMany();
    const dejaExistant = tousLesRsvps.find(
      (r) => normalizeName(r.nom) === nomNormalise
    );

    if (dejaExistant) {
      // Ne pas recréer — renvoyer l'entrée existante telle quelle
      return NextResponse.json({
        success: true,
        existing: true,
        rsvp: dejaExistant,
      });
    }

    // Aucune correspondance — création normale
    const rsvp = await prisma.rSVP.create({
      data: { nom: nom.trim(), statut },
    });

    return NextResponse.json({ success: true, existing: false, rsvp });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}