"use client";
import { useEffect, useState } from "react";

const garamond = { fontFamily: "'Cormorant Garamond', serif" };
const MOT_DE_PASSE = "ErikaetAudry"; // ← change ce mot de passe

type RSVP = { id: number; nom: string; statut: string; createdAt: string };
type Message = { id: number; nom: string; message: string; createdAt: string };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminPage() {
  const [motDePasse, setMotDePasse] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [onglet, setOnglet] = useState<"rsvps" | "messages">("rsvps");

  const confirmes = rsvps.filter((r) => r.statut === "confirme");
  const declines = rsvps.filter((r) => r.statut === "decline");

  const handleLogin = () => {
    if (motDePasse === MOT_DE_PASSE) {
      setConnecte(true);
      setErreur(false);
    } else {
      setErreur(true);
    }
  };

  useEffect(() => {
    if (!connecte) return;
    setLoading(true);
    fetch("/api/admin")
      .then((r) => r.json())
      .then((data) => {
        setRsvps(data.rsvps || []);
        setMessages(data.messages || []);
      })
      .finally(() => setLoading(false));
  }, [connecte]);

  // ── Ecran de connexion ──────────────────────────────
  if (!connecte) {
    return (
      <main style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", ...garamond }}>
        <div style={{ maxWidth: "360px", width: "100%", textAlign: "center" }}>
          <svg width="48" height="32" viewBox="0 0 64 40" fill="none" style={{ marginBottom: "1.5rem", opacity: 0.7 }}>
            <circle cx="22" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
            <circle cx="42" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
          </svg>
          <p style={{ letterSpacing: "0.3em", fontSize: "10px", textTransform: "uppercase", color: "#b89a6a", marginBottom: "0.5rem" }}>
            Espace de Gestion
          </p>
          <h1 style={{ fontSize: "2rem", fontWeight: 300, color: "#2c2118", marginBottom: "2rem" }}>
            Gestion complète
          </h1>
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", border: "1px solid #d8cfc4", background: "transparent",
              padding: "12px 20px", fontSize: "1rem", color: "#2c2118",
              outline: "none", marginBottom: "1rem", boxSizing: "border-box", ...garamond,
            }}
          />
          {erreur && (
            <p style={{ color: "#c0392b", fontSize: "0.85rem", marginBottom: "1rem", fontStyle: "italic" }}>
              Mot de passe incorrect.
            </p>
          )}
          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "12px", background: "#b89a6a", color: "white",
              border: "none", fontSize: "11px", letterSpacing: "0.25em",
              textTransform: "uppercase", cursor: "pointer", ...garamond,
            }}
          >
            Accéder
          </button>
        </div>
      </main>
    );
  }

  // ── Dashboard ───────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f5", ...garamond }}>

      {/* Header */}
      <div style={{ background: "#2c2118", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <svg width="36" height="24" viewBox="0 0 64 40" fill="none">
            <circle cx="22" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
            <circle cx="42" cy="20" r="16" stroke="#b89a6a" strokeWidth="2.5" fill="none" />
          </svg>
          <div>
            <p style={{ color: "#b89a6a", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>Administration</p>
            <p style={{ color: "white", fontSize: "1.2rem", fontWeight: 300 }}>Erika & Audry · 5 Sept. 2026</p>
          </div>
        </div>
        <button
          onClick={() => setConnecte(false)}
          style={{ background: "transparent", border: "1px solid #b89a6a", color: "#b89a6a", padding: "6px 16px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", ...garamond }}
        >
          Déconnexion
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#b89a6a", letterSpacing: "0.2em", fontSize: "0.9rem" }}>
          Chargement…
        </div>
      ) : (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>

          {/* Compteurs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { label: "Confirmés", value: confirmes.length, color: "#b89a6a" },
              { label: "Déclinés", value: declines.length, color: "#a89880" },
              { label: "Messages", value: messages.length, color: "#2c2118" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "white", border: "1px solid #e8e0d5", padding: "1.5rem", textAlign: "center", boxShadow: "0 2px 12px rgba(44,33,24,0.04)" }}>
                <p style={{ fontSize: "2.5rem", fontWeight: 300, color, lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#a89880", marginTop: "0.5rem" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Onglets */}
          <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", borderBottom: "1px solid #e8e0d5" }}>
            {(["rsvps", "messages"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setOnglet(tab)}
                style={{
                  padding: "10px 24px", background: "transparent", border: "none",
                  borderBottom: onglet === tab ? "2px solid #b89a6a" : "2px solid transparent",
                  color: onglet === tab ? "#b89a6a" : "#a89880",
                  fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase",
                  cursor: "pointer", ...garamond, marginBottom: "-1px",
                }}
              >
                {tab === "rsvps" ? `Présences (${rsvps.length})` : `Livre d'or (${messages.length})`}
              </button>
            ))}
          </div>

          {/* Tableau RSVPs */}
          {onglet === "rsvps" && (
            <div style={{ background: "white", border: "1px solid #e8e0d5", overflow: "hidden" }}>
              {rsvps.length === 0 ? (
                <p style={{ textAlign: "center", padding: "3rem", color: "#a89880", fontStyle: "italic" }}>Aucune réponse pour l'instant.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f3ede4" }}>
                      {["Nom", "Statut", "Date de réponse"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b89a6a", fontWeight: 400 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((r, i) => (
                      <tr key={r.id} style={{ borderTop: "1px solid #f0ebe4", background: i % 2 === 0 ? "white" : "#faf8f5" }}>
                        <td style={{ padding: "12px 16px", color: "#2c2118", fontSize: "1rem", fontWeight: 300 }}>{r.nom}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            display: "inline-block", padding: "3px 12px",
                            background: r.statut === "confirme" ? "#f0f7f0" : "#fdf0f0",
                            color: r.statut === "confirme" ? "#4a7c59" : "#c0392b",
                            fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase",
                          }}>
                            {r.statut === "confirme" ? "✓ Confirmé" : "✕ Décliné"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#a89880", fontSize: "0.85rem" }}>{formatDate(r.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tableau Livre d'or */}
          {onglet === "messages" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.length === 0 ? (
                <p style={{ textAlign: "center", padding: "3rem", color: "#a89880", fontStyle: "italic" }}>Aucun message pour l'instant.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ background: "white", border: "1px solid #e8e0d5", padding: "1.5rem", borderLeft: "3px solid #b89a6a" }}>
                    <p style={{ fontSize: "1.1rem", fontWeight: 300, color: "#2c2118", lineHeight: 1.7, marginBottom: "0.75rem", fontStyle: "italic" }}>
                      "{msg.message}"
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ color: "#b89a6a", fontSize: "0.9rem" }}>{msg.nom}</p>
                      <p style={{ color: "#a89880", fontSize: "0.8rem" }}>{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      )}
    </main>
  );
}