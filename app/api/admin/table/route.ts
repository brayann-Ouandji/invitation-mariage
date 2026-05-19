export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id, table } = await req.json();
    const rsvp = await prisma.rSVP.update({
      where: { id },
      data: { table },
    });
    return NextResponse.json({ success: true, rsvp });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}