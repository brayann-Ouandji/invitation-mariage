"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const programme = [
  {
    label: "Mairie",
    adresse: "Vindictivelaan 1, 8400 Oostende",
    heure: "10h00",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Vindictivelaan+1,+8400+Oostende,+Belgium",
    datetime: new Date("2026-09-05T10:00:00"),
  },
  {
    label: "Église",
    adresse: "Delhaize Oostende Sea'rena, 8400 Oostende",
    heure: "15h00",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=DelhaizeOostendeSea'renaNorthlaan+13,+8400+Oostende,+Belgium",
    datetime: new Date("2026-09-05T15:00:00"),
  },
  {
    label: "Soirée",
    adresse: "Delhaize Oostende Sea'rena, 8400 Oostende",
    heure: "19h00",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=DelhaizeOostendeSea'renaNorthlaan+13,+8400+Oostende,+Belgium",
    datetime: new Date("2026-09-05T19:00:00"),
  },
];

export default function InvitationPage() {
  const params = useParams();
  const nomRaw = params?.nom as string ?? "";
  const nomDecoded = decodeURIComponent(nomRaw);

  const [table, setTable] = useState<string | null>(null);
  const [showProgramme, setShowProgramme] = useState(false);
  const [now, setNow] = useState(new Date());

  // Récupère la table depuis l'API
  useEffect(() => {
    if (!nomDecoded) return;
    fetch(`/api/invitation?nom=${encodeURIComponent(nomDecoded)}`)
      .then((r) => r.json())
      .then((data) => setTable(data.table ?? null))
      .catch(() => {});
  }, [nomDecoded]);

  // Horloge pour marquer les étapes passées
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const isCompleted = (dt: Date) => now > dt;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,154,106,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(184,154,106,0); }
        }
        .btn-pulse { animation: pulse-gold 1.8s ease-in-out infinite; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.3s ease forwards; }
        .step-line::before {
          content: '';
          position: absolute;
          left: 18px;
          top: 36px;
          bottom: -20px;
          width: 1px;
          background: #d8cfc4;
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf8f5 0%, #f3ede4 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "'Cormorant Garamond', serif" }}>
        <div style={{ maxWidth: "420px", width: "100%", textAlign: "center", border: "1px solid #e8e0d5", padding: "3rem 2rem", background: "#faf8f5", boxShadow: "0 8px 40px rgba(44,33,24,0.08)" }}>

          {/* Bagues */}
          <div style={{ marginBottom: "1.5rem", opacity: 0.85 }}>
            <svg width="56" height="36" viewBox="0 0 64 40" fill="none">
              <circle cx="22" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
              <circle cx="42" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
            </svg>
          </div>

          <p style={{ letterSpacing: "0.3em", fontSize: "10px", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>Invitation personnelle</p>
          <div style={{ width: "48px", height: "1px", background: "#b89a6a", opacity: 0.5, margin: "0 auto 1.5rem" }} />

          <p style={{ fontSize: "14px", color: "#7a6a58", marginBottom: "0.25rem", fontStyle: "italic" }}>Chère / Cher</p>
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
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#b89a6a" opacity="0.7" /></svg>
            <div style={{ height: "1px", width: "40px", background: "#b89a6a", opacity: 0.4 }} />
          </div>

          {/* Date */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 300, color: "#2c2118", marginBottom: "0.25rem" }}>Samedi 5 Septembre 2026</p>
          </div>

          <div style={{ height: "1px", width: "48px", background: "#b89a6a", opacity: 0.3, margin: "1rem auto" }} />

          {/* Lieu soirée */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "#2c2118" }}>Delhaize Oostende Sea'rena</p>
            <p style={{ fontSize: "0.95rem", color: "#7a6a58" }}>8400 Oostende, Belgique</p>
          </div>

          {/* Thème */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.25rem" }}>Thème</p>
            <p style={{ fontSize: "1.2rem", fontWeight: 300, color: "#2c2118", fontStyle: "italic" }}>Gala / Be Class.</p>
          </div>

          <div style={{ height: "1px", width: "48px", background: "#b89a6a", opacity: 0.3, margin: "1rem auto" }} />

          {/* Table */}
          {table ? (
            <div style={{ margin: "1.5rem 0", padding: "1.5rem", border: "1px solid #b89a6a", background: "#f3ede4" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>Votre table</p>
              <p style={{ fontSize: "3rem", fontWeight: 300, color: "#2c2118", lineHeight: 1 }}>{table}</p>
            </div>
          ) : (
            <div style={{ margin: "1.5rem 0", padding: "1rem", border: "1px dashed #d8cfc4", background: "#faf8f5" }}>
              <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#a89880" }}>Votre numéro de table sera bientôt disponible.</p>
            </div>
          )}

          {/* Bouton Programme */}
          <Link
  href="/programme"
  className="btn-pulse"
  style={{
    display: "block", width: "100%", padding: "12px 24px", background: "#2c2118", color: "#b89a6a",
    border: "none", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase",
    cursor: "pointer", marginBottom: "0.5rem", textAlign: "center", textDecoration: "none",
    ...garamond,
  }}
>
  Programme de la journée
</Link>
      {/*   <button
            onClick={() => setShowProgramme(!showProgramme)}
            className="btn-pulse"
            style={{
              width: "100%", padding: "12px 24px", background: "#2c2118", color: "#b89a6a",
              border: "none", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase",
              cursor: "pointer", marginBottom: "0.5rem", ...garamond,
            }}
          >
            {showProgramme ? "✕ Fermer" : "✦ Programme de la journée"}
          </button>

          {/* Programme déroulant
          {showProgramme && (
            <div className="slide-down" style={{ textAlign: "left", background: "#f3ede4", border: "1px solid #e8e0d5", padding: "1.5rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "1.25rem", textAlign: "center" }}>
                5 Septembre 2026
              </p>
              <div style={{ position: "relative" }}>
                {programme.map((step, i) => {
                  const done = isCompleted(step.datetime);
                  return (
                    <div key={step.label} style={{ position: "relative", display: "flex", gap: "16px", paddingBottom: i < programme.length - 1 ? "1.5rem" : "0" }}>
                      {/* Ligne verticale
                      {i < programme.length - 1 && (
                        <div style={{ position: "absolute", left: "18px", top: "36px", bottom: "0", width: "1px", background: done ? "#b89a6a" : "#d8cfc4", opacity: 0.6 }} />
                      )}
                      {/* Cercle 
                      <div style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%", background: done ? "#b89a6a" : "#faf8f5", border: `1px solid ${done ? "#b89a6a" : "#d8cfc4"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", zIndex: 1 }}>
                        {done ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.5">
                            {step.label === "Mairie" && <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M16 10v11M12 10v11" strokeLinecap="round"/>}
                            {step.label === "Église" && <path d="M12 2v4M12 2l-3 3M12 2l3 3M3 9h18M5 9v11h14V9M9 21v-6h6v6" strokeLinecap="round"/>}
                            {step.label === "Soirée" && <>
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinecap="round"/>
                              <circle cx="12" cy="9" r="2" fill="#b89a6a"/>
                            </>}
                          </svg>
                        )}
                      </div>
                      {/* Contenu
                      <div style={{ flex: 1, paddingTop: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                          <p style={{ fontSize: "1rem", fontWeight: done ? 400 : 300, color: done ? "#a89880" : "#2c2118", textDecoration: done ? "line-through" : "none" }}>
                            {step.label}
                          </p>
                          <p style={{ fontSize: "0.85rem", color: "#b89a6a", fontWeight: 300 }}>{step.heure}</p>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "#a89880", marginBottom: "6px", lineHeight: 1.4 }}>{step.adresse}</p>
                        <a href={step.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b89a6a", textDecoration: "none", borderBottom: "1px solid #b89a6a", paddingBottom: "1px" }}>
                          Itinéraire →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}*/}

          {/* Hébergements */}
          <div style={{ margin: "1.5rem 0", padding: "1rem 1.2rem", border: "1px dashed #d8cfc4", background: "#faf8f5", textAlign: "left" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.75rem" }}>Hébergements à proximité</p>
            {["Royal Astrid", "Vayamundo", "Airbnb à proximité"].map((hotel) => (
              <p key={hotel} style={{ fontSize: "0.9rem", fontWeight: 300, color: "#4a3f35", display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.3rem" }}>
                <span style={{ color: "#b89a6a" }}>—</span> {hotel}
              </p>
            ))}
          </div>

          {/* Note adultes */}
          <div style={{ margin: "1rem 0", padding: "1rem 1.2rem", borderLeft: "2px solid #b89a6a", background: "#f3ede4", textAlign: "left" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>Note importante</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "#4a3f35", lineHeight: 1.7 }}>
              Aucun service de garderie ne sera prévu. La soirée est réservée aux <strong>adultes uniquement (18 ans et plus)</strong>. Merci pour votre compréhension.
            </p>
          </div>

          {/* Bouton Maps soirée */}
        {/**  <a href="https://www.google.com/maps/dir/?api=1&destination=Northlaan+13,+8400+Oostende,+Belgium" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 28px", border: "1px solid #b89a6a", color: "#b89a6a", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", marginBottom: "2rem", marginTop: "1rem" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  <circle cx="12" cy="9" r="2.5"/>
</svg>
Voir l'itinéraire
          </a> */}

          <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#a89880" }}>
            "Et ainsi commence notre plus belle aventure."
          </p>
        </div>
      </main>
    </>
  );
}