"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const garamond = { fontFamily: "'Cormorant Garamond', serif" };

// ── Icônes SVG dorées
const Icons = {
  // Bâtiment de la mairie avec fronton + drapeau
  mairie: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <path d="M12 2v3M12 2l2 1.2M12 5l-2-1.5" strokeLinecap="round" />
      <path d="M3 9l9-4 9 4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="9" width="16" height="1.5" fill="#b89a6a" stroke="none" />
      <path d="M5 10.5V20M19 10.5V20M9 10.5V20M15 10.5V20" strokeLinecap="round" />
      <rect x="3" y="20" width="18" height="1.5" fill="#b89a6a" stroke="none" />
      <rect x="8" y="13" width="2.4" height="4" rx="0.3" fill="#b89a6a" stroke="none" opacity="0.85" />
      <rect x="13.6" y="13" width="2.4" height="4" rx="0.3" fill="#b89a6a" stroke="none" opacity="0.85" />
    </svg>
  ),

  // Appareil photo vintage avec petit coeur sur le flash
  camera: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <rect x="3" y="8" width="18" height="12" rx="1.5" strokeLinejoin="round" />
      <path d="M8 8l1.3-2h5.4L16 8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="3.2" />
      <circle cx="12" cy="14" r="1.2" fill="#b89a6a" stroke="none" />
      <path d="M6.5 5.5c.3-.5.9-.5 1.2 0 .3-.5.9-.5 1.2 0 0 .6-1.2 1.4-1.2 1.4s-1.2-.8-1.2-1.4z" fill="#b89a6a" stroke="none" />
    </svg>
  ),

  // Église avec croix + toit
  eglise: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <path d="M12 2v2.2M11 3.2h2" strokeLinecap="round" />
      <path d="M12 5l7 5.5V21H5V10.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6a3 3 0 016 0v6" strokeLinecap="round" />
      <path d="M4 21h16" strokeLinecap="round" />
      <path d="M12 9v3M10.5 10.5h3" strokeLinecap="round" />
    </svg>
  ),

  // Coeur au dessus + deux verres qui trinquent (comme le modèle)
  toast: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <path d="M12 6c-.6-1-1.6-1.6-2.6-1-1 .6-1.2 2 0 3.2L12 11l2.6-2.8c1.2-1.2 1-2.6 0-3.2-1-.6-2 0-2.6 1z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12l2.5 2-1 6M18 12l-2.5 2 1 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 11l2.5 1.5M20 11l-2.5 1.5" strokeLinecap="round" />
      <path d="M5.5 20h4M14.5 20h4" strokeLinecap="round" />
    </svg>
  ),

  // Coeur simple (pour "Soirée")
  soiree: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <path d="M12 20c-4-3-8-6.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 4.5-4 8-8 11z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // Assiette en médaillon (cercle + couverts) comme le modèle
  repas: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 7.5v4c0 .8-.5 1.5-1.3 1.5M8.3 13v5" strokeLinecap="round" />
      <path d="M9 7.5v3M10 7.5v3" strokeLinecap="round" />
      <path d="M15.5 7.5c0 1.5-.5 2.8-1.2 3.5v6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // Gâteau à étages avec coeur au sommet
  gateau: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <path d="M12 3c-.5-.7-1.3-.7-1.6 0-.3.7 0 1.5.8 1.9.8-.4 1.1-1.2.8-1.9z" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="6" width="5" height="3" rx="0.4" />
      <rect x="6.5" y="10.5" width="11" height="4" rx="0.4" />
      <rect x="4" y="16" width="16" height="4.5" rx="0.4" />
      <path d="M9 10.5v-1.5M12 10.5v-1.5M15 10.5v-1.5" strokeLinecap="round" />
      <path d="M7 16v-1.5M12 16v-1.5M17 16v-1.5" strokeLinecap="round" />
    </svg>
  ),

  // Silhouette qui danse, bras levés
  danse: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.3">
      <circle cx="12" cy="4.2" r="1.8" />
      <path d="M12 6.5v6.5" strokeLinecap="round" />
      <path d="M12 8.5l-4-3M12 8.5l4-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13l-3.5 7M12 13l3.5 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
type Etape = {
  label: string;
  detail?: string;
  heure: string;
  datetime: Date;
  icon: keyof typeof Icons;
  mapsUrl?: string;
};

const etapes: Etape[] = [
  { label: "Mairie", detail: "Vindictivelaan 1, 8400 Oostende", heure: "10h00", datetime: new Date("2026-09-05T10:00:00"), icon: "mairie", mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Vindictivelaan+1,+8400+Oostende,+Belgium" },
  { label: "Souriez, vous êtes filmés", heure: "11h00", datetime: new Date("2026-09-05T11:00:00"), icon: "camera" },
  { label: "Église", detail: "Fleriskotstraat 92, 8432 Middelkerke", heure: "15h00", datetime: new Date("2026-09-05T15:00:00"), icon: "eglise", mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Fleriskotstraat+92,+8432+Middelkerke,+Belgium" },
  { label: "Souriez, vous êtes filmés", heure: "16h00", datetime: new Date("2026-09-05T16:00:00"), icon: "camera" },
  { label: "Trinquez aux nouveaux mariés", heure: "18h00", datetime: new Date("2026-09-05T18:00:00"), icon: "toast" },
  { label: "Soirée", detail: "Northlaan 13, 8400 Oostende", heure: "19h00", datetime: new Date("2026-09-05T19:00:00"), icon: "soiree", mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Northlaan+13,+8400+Oostende,+Belgium" },
  { label: "Régalez-vous, repas", heure: "20h00", datetime: new Date("2026-09-05T20:00:00"), icon: "repas" },
  { label: "Gâteau de mariage", heure: "23h00", datetime: new Date("2026-09-05T23:00:00"), icon: "gateau" },
  { label: "Dansez toute la nuit", heure: "00h00", datetime: new Date("2026-09-06T00:00:00"), icon: "danse" },
];

export default function ProgrammePage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const isCompleted = (dt: Date) => now > dt;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf8f5 0%, #f3ede4 100%)", fontFamily: "'Cormorant Garamond', serif", padding: "3rem 1rem 5rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        {/* Retour */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#b89a6a", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", marginBottom: "2rem" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Retour à l'invitation
        </Link>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" style={{ marginBottom: "0.75rem" }}>
            <path d="M12 21c0-5-4.5-8-4.5-12A4.5 4.5 0 0112 4.5 4.5 4.5 0 0116.5 9c0 4-4.5 7-4.5 12z" />
          </svg>
          <p style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>
            5 Septembre 2026
          </p>
          <h1 style={{ fontSize: "clamp(2.2rem, 8vw, 3rem)", fontWeight: 300, color: "#2c2118" }}>
            Programme
          </h1>
        </div>

        {/* Timeline en zigzag */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: "8px", bottom: "8px", width: "1px", background: "#d8cfc4", transform: "translateX(-50%)" }} />

          {etapes.map((etape, i) => {
            const done = isCompleted(etape.datetime);
            const gauche = i % 2 === 0;

            return (
              <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: i < etapes.length - 1 ? "2.2rem" : 0, minHeight: "60px" }}>

                <div style={{ flex: 1, textAlign: gauche ? "right" : "left", paddingRight: gauche ? "1.5rem" : "0", paddingLeft: gauche ? "0" : "1.5rem", order: gauche ? 1 : 3 }}>
                  {gauche ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                      <p style={{ fontSize: "1.3rem", fontWeight: 300, color: done ? "#a89880" : "#2c2118", textDecoration: done ? "line-through" : "none" }}>
                        {etape.heure}
                      </p>
                      <div style={{ opacity: done ? 0.4 : 1, flexShrink: 0 }}>{Icons[etape.icon]}</div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: "1rem", fontStyle: "italic", fontWeight: 300, color: done ? "#a89880" : "#4a3f35", textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>
                        {etape.label}
                      </p>
                      {etape.detail && <p style={{ fontSize: "0.75rem", color: "#a89880", marginTop: "2px" }}>{etape.detail}</p>}
                      {etape.mapsUrl && (
                        <a href={etape.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#b89a6a", textDecoration: "none", borderBottom: "1px solid #b89a6a" }}>
                          Itinéraire
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ order: 2, flexShrink: 0, width: "14px", height: "14px", borderRadius: "50%", background: done ? "#b89a6a" : "#faf8f5", border: "1.5px solid #b89a6a", zIndex: 1 }} />

                <div style={{ flex: 1, textAlign: gauche ? "left" : "right", paddingLeft: gauche ? "1.5rem" : "0", paddingRight: gauche ? "0" : "1.5rem", order: gauche ? 3 : 1 }}>
                  {gauche ? (
                    <div>
                      <p style={{ fontSize: "1rem", fontStyle: "italic", fontWeight: 300, color: done ? "#a89880" : "#4a3f35", textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>
                        {etape.label}
                      </p>
                      {etape.detail && <p style={{ fontSize: "0.75rem", color: "#a89880", marginTop: "2px" }}>{etape.detail}</p>}
                      {etape.mapsUrl && (
                        <a href={etape.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#b89a6a", textDecoration: "none", borderBottom: "1px solid #b89a6a" }}>
                          Itinéraire
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "10px" }}>
                      <div style={{ opacity: done ? 0.4 : 1, flexShrink: 0 }}>{Icons[etape.icon]}</div>
                      <p style={{ fontSize: "1.3rem", fontWeight: 300, color: done ? "#a89880" : "#2c2118", textDecoration: done ? "line-through" : "none" }}>
                        {etape.heure}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" style={{ margin: "0 auto" }}>
            <path d="M12 21c0-5-4.5-8-4.5-12A4.5 4.5 0 0112 4.5 4.5 4.5 0 0116.5 9c0 4-4.5 7-4.5 12z" />
          </svg>
        </div>

      </div>
    </main>
  );
}