"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const garamond = { fontFamily: "'Cormorant Garamond', serif" };

// ── Icônes SVG dorées
const Icons = {
  mairie: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M3 21h18M4 21V10M20 21V10M3 10l9-6 9 6M7 10v11M11 10v11M13 10v11M17 10v11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  camera: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="3.5" />
    </svg>
  ),
  eglise: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M12 2v3M10.5 3.5h3M6 21V11L12 6l6 5v10M9 21v-6h6v6M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  toast: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M7 3l2 9-2 2M17 3l-2 9 2 2M6 21l3-7M18 21l-3-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 3h4M15 3h4" strokeLinecap="round" />
    </svg>
  ),
  soiree: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M12 21c0-5-4.5-8-4.5-12A4.5 4.5 0 0112 4.5 4.5 4.5 0 0116.5 9c0 4-4.5 7-4.5 12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  repas: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 7v5M9 7c-1 0-1.5 1-1.5 2s.5 2 1.5 2M9 12v5M15 7v10M15 7c1.2 0 2 1.3 2 3s-.8 3-2 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  gateau: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M4 21v-5a2 2 0 012-2h12a2 2 0 012 2v5M4 21h16M6 14v-4a2 2 0 012-2h8a2 2 0 012 2v4M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="3" r="1" fill="#b89a6a" stroke="none" />
    </svg>
  ),
  danse: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v6l-4 6M12 12l4 6M8 10l-3 2M16 10l3 2" strokeLinecap="round" strokeLinejoin="round" />
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