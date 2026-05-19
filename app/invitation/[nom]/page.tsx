import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ nom: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nom } = await params;
  const nomDecoded = decodeURIComponent(nom);
  return {
    title: `Invitation de ${nomDecoded} — Mariage Erika & Audry`,
  };
}

export default async function InvitationPage({ params }: Props) {
  const { nom } = await params;
  const nomDecoded = decodeURIComponent(nom);

  // Cherche le RSVP en BDD pour récupérer la table
  const rsvp = await prisma.rSVP.findFirst({
    where: {
      nom: { equals: nomDecoded, mode: "insensitive" },
      statut: "confirme",
    },
    orderBy: { createdAt: "desc" },
  });

  const numeroTable = rsvp?.table ?? null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
        rel="stylesheet"
      />
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #faf8f5 0%, #f3ede4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #e8e0d5",
            padding: "3rem 2rem",
            background: "#faf8f5",
            boxShadow: "0 8px 40px rgba(44,33,24,0.08)",
          }}
        >
          {/* Bagues */}
          <div style={{ marginBottom: "1.5rem", opacity: 0.85 }}>
            <svg width="56" height="36" viewBox="0 0 64 40" fill="none">
              <circle cx="22" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
              <circle cx="42" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
            </svg>
          </div>

          <p style={{ letterSpacing: "0.3em", fontSize: "10px", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>
            Invitation personnelle
          </p>
          <div style={{ width: "48px", height: "1px", background: "#b89a6a", opacity: 0.5, margin: "0 auto 1.5rem" }} />

          <p style={{ fontSize: "14px", color: "#7a6a58", marginBottom: "0.25rem", fontStyle: "italic" }}>
            Chère / Cher
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", fontWeight: 300, color: "#2c2118", lineHeight: 1.1, marginBottom: "2rem" }}>
            {nomDecoded}
          </h1>

          <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "#4a3f35", lineHeight: 1.7, marginBottom: "2rem" }}>
            Vous êtes chaleureusement invité(e) à célébrer le mariage de
          </p>

          <h2 style={{ fontSize: "clamp(1.8rem, 7vw, 2.5rem)", fontWeight: 300, color: "#2c2118", marginBottom: "0.25rem" }}>
            Erika <span style={{ color: "#b89a6a" }}>&</span> Audry
          </h2>

          <div style={{ margin: "1.5rem auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <div style={{ height: "1px", width: "40px", background: "#b89a6a", opacity: 0.4 }} />
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M9 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#b89a6a" opacity="0.7" />
            </svg>
            <div style={{ height: "1px", width: "40px", background: "#b89a6a", opacity: 0.4 }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 300, color: "#2c2118", marginBottom: "0.25rem" }}>
              Samedi 5 Septembre 2026
            </p>
            <p style={{ fontSize: "1rem", color: "#7a6a58", letterSpacing: "0.1em" }}>à 19h00</p>
          </div>

          <div style={{ height: "1px", width: "48px", background: "#b89a6a", opacity: 0.3, margin: "1rem auto" }} />

          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "#2c2118" }}>Northlaan 13</p>
            <p style={{ fontSize: "0.95rem", color: "#7a6a58", letterSpacing: "0.05em" }}>8400 Oostende, Belgique</p>
          </div>

          {/* Numéro de table */}
          {numeroTable ? (
            <div style={{
              margin: "1.5rem 0",
              padding: "1.5rem",
              border: "1px solid #b89a6a",
              background: "#f3ede4",
            }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>
                Votre table
              </p>
              <p style={{ fontSize: "3rem", fontWeight: 300, color: "#2c2118", lineHeight: 1 }}>
                {numeroTable}
              </p>
            </div>
          ) : (
            <div style={{
              margin: "1.5rem 0",
              padding: "1rem",
              border: "1px dashed #d8cfc4",
              background: "#faf8f5",
            }}>
              <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#a89880" }}>
                Votre numéro de table sera bientôt disponible.
              </p>
            </div>
          )}

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Northlaan+13,+8400+Oostende,+Belgium"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 28px",
              border: "1px solid #b89a6a",
              color: "#b89a6a",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              marginBottom: "2rem",
            }}
          >
            📍 Voir l'itinéraire
          </a>

          <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#a89880", marginTop: "1rem" }}>
            "Et ainsi commence notre plus belle aventure."
          </p>
        </div>
      </main>
    </>
  );
}