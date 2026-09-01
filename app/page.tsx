"use client";
import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
 const garamond = { fontFamily: "'Cormorant Garamond', serif" };

// ── Types ──────────────────────────────────────────────
type TimeLeft = { jours: number; heures: number; minutes: number; secondes: number; termine?: boolean };
type Message = { id: number; nom: string; message: string; createdAt: string };

function useCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ jours: 0, heures: 0, minutes: 0, secondes: 0, termine: false });

  useEffect(() => {
    const calc = (): TimeLeft => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return { jours: 0, heures: 0, minutes: 0, secondes: 0, termine: true };
      return {
        jours: Math.floor(diff / 86400000),
        heures: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        secondes: Math.floor((diff % 60000) / 1000),
        termine: false,
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}
const storyParagraphs = [
  "  Erika et Audry se sont rencontrés sur les réseaux sociaux, où leur passion commune pour l’art",
  "et la mode les a rapprochés. D’une simple amitié est née une belle histoire d’amour.",
  "Aujourd’hui, ils élèvent ensemble leur petit garçon et souhaitent partager cette",
  "merveilleuse aventure avec vous.",];

  // ─── RSVP Section ─────────────────────────────────────
function RSVPSection() {
  const [dejaExistant, setDejaExistant] = useState(false);
  const [nom, setNom] = useState("");
  const [statut, setStatut] = useState<"confirme" | "decline" | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [dejaPondu, setDejaRepondu] = useState(false); 
  const [nomSauvegarde, setNomSauvegarde] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
 
   useEffect(() => {
    const rsvpSauvegarde = localStorage.getItem("rsvp_statut");
    const nomLocal = localStorage.getItem("rsvp_nom");
    if (rsvpSauvegarde && nomLocal) {
      setDejaRepondu(true);
      setNomSauvegarde(nomLocal);
      setStatut(rsvpSauvegarde as "confirme" | "decline");
    }
  }, []);
  const handleRSVP = async (choix: "confirme" | "decline") => {
  if (!nom.trim()) {
    alert("Veuillez entrer votre nom complet.");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: nom.trim(), statut: choix }),
    });
    const data = await res.json();

    if (!data.success) {
      alert("Une erreur est survenue, veuillez réessayer.");
      setLoading(false);
      return;
    }

    // Utilise le nom et le statut RÉELS enregistrés en BDD
    // (utile si la personne existait déjà avec un autre statut)
    const nomFinal = data.rsvp.nom;
    const statutFinal = data.rsvp.statut;

    setNom(nomFinal);
    setStatut(statutFinal);
    setConfirmed(true);
    setDejaExistant(!!data.existing);

    // Sauvegarde locale
    localStorage.setItem("rsvp_statut", statutFinal);
    localStorage.setItem("rsvp_nom", nomFinal);

    if (statutFinal === "confirme") {
      const nomEncoded = encodeURIComponent(nomFinal);
      const qrContent = `https://invitation-mariage-7j6s.vercel.app/invitation/${nomEncoded}`;
      const dataUrl = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        color: { dark: "#2c2118", light: "#faf8f5" },
      });
      setQrDataUrl(dataUrl);
    }
  } catch (e) {
    alert("Une erreur est survenue, veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `invitation-${nom.trim().replace(/\s+/g, "-")}.png`;
    link.click();
  };
  {dejaPondu && (
  <div className="mb-8 px-5 py-4 border border-[#e8e0d5] bg-[#f3ede4] text-center">
    <p className="text-sm text-[#7a6a58]" style={garamond}>
      Vous avez déjà répondu,{" "}
      <span className="text-[#b89a6a] italic">{nomSauvegarde}</span>. 🤍
    </p>
    <p className="text-xs text-[#a89880] mt-1" style={garamond}>
      {statut === "confirme"
        ? "Votre présence est confirmée — à très bientôt !"
        : "Vous avez décliné notre invitation.(grosse erreur mais c'esrt pas grave)"}
    </p>
  </div>
)}
 
 
 
  return (
    <section className="py-24 px-6 bg-[#faf8f5]">
      <div className="max-w-xl mx-auto text-center">
        <p className="tracking-[0.3em] text-[20px] uppercase text-[#b89a6a] mb-3" style={garamond}>
          Votre présence
        </p>
        <h2 className="text-4xl md:text-5xl text-[#2c2118] mb-4" style={{ ...garamond, fontWeight: 300 }}>
          Serez-vous des nôtres ?
        </h2>
        <p className="text-[#7a6a58] text-base mb-10" style={{ ...garamond, fontWeight: 300 }}>
          Merci de nous faire part de votre réponse.
        </p>

        {/* Note adultes uniquement */}
<div className="w-full mb-6 px-4 py-3 border-l-2 border-[#b89a6a] bg-[#f3ede4] text-left">
  <p className="text-[10px] tracking-[0.25em] uppercase text-[#b89a6a] mb-1" style={garamond}>
    Note importante
  </p>
  <p className="text-xs text-[#4a3f35] leading-relaxed" style={garamond}>
    La soirée est réservée aux <strong>adultes uniquement (18 ans et plus)</strong>. Aucune garderie ne sera prévue sur place. Merci pour votre compréhension.
  </p>
   <p className="text-base text-[#4a3f35] leading-relaxed" style={{ ...garamond, fontWeight: 300 }}>
        Votre présence à nos côtés est le plus beau des cadeaux.
        Si vous souhaitez néanmoins nous témoigner votre affection par une attention, une participation
         à notre cagnotte de mariage serait grandement appréciée.
      </p>

      {/* Coordonnées bancaires */}
      <div className="w-full border border-[#e8e0d5] bg-[#faf8f5] p-5 flex flex-col gap-3 text-left">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#b89a6a] mb-1" style={garamond}>Bénéficiaire</p>
          <p className="text-base text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>Audry Bangofa</p>
        </div>
        <div className="h-px bg-[#e8e0d5]" />
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#b89a6a] mb-1" style={garamond}>IBAN</p>
          <p className="text-base text-[#2c2118] tracking-wider" style={{ ...garamond, fontWeight: 300 }}>BE94 3771 3164 6114</p>
        </div>
      </div>
</div>
        {!confirmed ? (
          <div className="flex flex-col gap-4">
            {/* Champ nom */}
            <input
              type="text"
              placeholder="Votre nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-[#d8cfc4] bg-transparent px-5 py-3 text-[#2c2118] text-base placeholder-[#b89a6a] outline-none focus:border-[#b89a6a] transition-colors"
              style={garamond}
            />
 
            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => handleRSVP("confirme")}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#b89a6a] text-white text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#a08558] disabled:opacity-50"
                style={garamond}
              >
                ✓ Confirmer ma venue
              </button>
              <button
                onClick={() => handleRSVP("decline")}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-[#b89a6a] text-[#b89a6a] text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#f3ede4] disabled:opacity-50"
                style={garamond}
              >
                ✕ Décliner (erreur !!)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            {statut === "confirme" ? (
              <>
                {/* Message de confirmation */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#f3ede4] flex items-center justify-center mb-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-2xl text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
  {dejaExistant ? "Vous aviez déjà confirmé !" : "Présence confirmée !"}
</p>
{dejaExistant && (
  <p className="text-xs text-[#a89880] italic mt-1" style={garamond}>
    Voici à nouveau votre QR code personnel.
  </p>
)}
                  <p className="text-[#7a6a58]" style={garamond}>
                    À très bientôt, <span className="text-[#b89a6a] italic">{nom}</span> 🤍
                  </p>
                </div>
                {/*Message adulte uniquement*/}

                {/* NB adultes */}
<div style={{
  width: "100%",
  padding: "0.75rem 1rem",
  borderLeft: "2px solid #b89a6a",
  background: "#f3ede4",
  textAlign: "left",
  marginTop: "0.5rem",
}}>
  <p className="text-xs text-[#4a3f35] leading-relaxed" style={garamond}>
     <strong>Note :</strong> Malheuresement, la soirée est réservée aux adultes (18 ans et plus). Aucune garderie ne sera prévue sur place.
  </p>
</div>
 
                {/* QR Code */}
                {qrDataUrl && (
                  <div className="flex flex-col items-center gap-4 mt-4 p-6 border border-[#e8e0d5] bg-[#f3ede4] w-full">
                    <p className="text-xs tracking-widest uppercase text-[#b89a6a]" style={garamond}>
                      Votre invitation personnelle
                    </p>
                    <img src={qrDataUrl} alt="QR Code invitation" className="w-44 h-44" />
                    <div className="text-center">
                      <p className="text-sm text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
                        {nom}
                      </p>
                      <p className="text-xs text-[#7a6a58]" style={garamond}>
                        Mariage de Erika & Audry · 5 sept. 2026 · 19h
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadQR}
                      className="px-6 py-2 bg-[#2c2118] text-white text-xs tracking-[0.25em] uppercase hover:bg-[#b89a6a] transition-colors"
                      style={garamond}
                    >
                      ↓ Télécharger
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
                  Nous vous regretterons (vous encore plus)…
                </p>
                <p className="text-[#7a6a58]" style={garamond}>
                  Merci d'avoir répondu, <span className="italic">{nom}</span>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
// LIVRE D'OR SECTION
// ══════════════════════════════════════════════════════
function LivreOrSection() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
 
  // Charger les 3 derniers messages au montage
  useEffect(() => {
    fetch("/api/livredor")
      .then((r) => r.json())
      .then((data) => setMessages(data.messages || []));
  }, []);
 
  const handleSubmit = async () => {
    if (!nom.trim() || !message.trim()) {
      alert("Veuillez remplir votre nom et votre message.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/livredor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setShowPopup(true);
        // Rafraîchir les messages
        const updated = await fetch("/api/livredor").then((r) => r.json());
        setMessages(updated.messages || []);
        // Cacher le popup après 3s
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch { alert("Une erreur est survenue."); }
    finally { setLoading(false); }
  };
 
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };
 
  return (
    <section className="py-24 px-6 bg-[#f3ede4] relative">
 
      {/* Popup "message envoyé" */}
      {showPopup && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#2c2118] text-white px-6 py-3 flex items-center gap-3 shadow-lg animate-fade-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs tracking-widest uppercase" style={garamond}>Message envoyé au livre d'or</span>
        </div>
      )}
 
      <div className="max-w-xl mx-auto text-center">
        <p className="tracking-[0.3em] text-[10px] uppercase text-[#b89a6a] mb-3" style={garamond}>Mots doux</p>
        <h2 className="text-4xl md:text-5xl text-[#2c2118] mb-4" style={{ ...garamond, fontWeight: 300 }}>Livre d'or</h2>
        <p className="text-[#7a6a58] text-base mb-10" style={{ ...garamond, fontWeight: 300 }}>
          Laissez un mot aux mariés — il restera gravé pour toujours.
        </p>
 

{!sent ? (
  <div className="flex flex-col gap-4 text-left">
    <input
      type="text"
      placeholder="Votre nom"
      value={nom}
      onChange={(e) => setNom(e.target.value)}
      className="w-full border border-[#d8cfc4] bg-transparent px-5 py-3 text-[#2c2118] placeholder-[#b89a6a] outline-none focus:border-[#b89a6a] transition-colors"
      style={garamond}
    />
    <textarea
      placeholder="Votre message aux mariés…"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={4}
      className="w-full border border-[#d8cfc4] bg-transparent px-5 py-3 text-[#2c2118] placeholder-[#b89a6a] outline-none focus:border-[#b89a6a] transition-colors resize-none"
      style={garamond}
    />
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="self-center px-10 py-3 bg-[#b89a6a] text-white text-xs tracking-[0.25em] uppercase hover:bg-[#a08558] transition-colors disabled:opacity-50"
      style={garamond}
    >
      Envoyer ✉
    </button>
  </div>
) : (
  <div className="flex flex-col items-center gap-6">
    {/* Remerciement */}
    <div className="flex flex-col items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2">
        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-2xl text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
        Merci pour vos doux mots
      </p>
      <p className="text-[#7a6a58] text-sm" style={garamond}>
        Votre message a été ajouté au livre d'or 🤍
      </p>
    </div>

    {/* Séparateur */}
    <div className="w-full h-px bg-[#e8e0d5]" />

    {/* Liste de mariage */}
    <div className="w-full text-center flex flex-col items-center gap-4 px-2">
      <p className="text-xs tracking-[0.25em] uppercase text-[#b89a6a]" style={garamond}>
        Livre d'or & Liste de mariage
      </p>
      <p className="text-base text-[#4a3f35] leading-relaxed" style={{ ...garamond, fontWeight: 300 }}>
        Votre présence à nos côtés est le plus beau des cadeaux.
        Si vous souhaitez néanmoins nous témoigner votre affection par une attention, une participation
         à notre cagnotte de mariage serait grandement appréciée.
      </p>

      {/* Coordonnées bancaires */}
      <div className="w-full border border-[#e8e0d5] bg-[#faf8f5] p-5 flex flex-col gap-3 text-left">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#b89a6a] mb-1" style={garamond}>Bénéficiaire</p>
          <p className="text-base text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>Audry Bangofa</p>
        </div>
        <div className="h-px bg-[#e8e0d5]" />
        <div>
          <p className="text-[10px] tracking-widest uppercase text-[#b89a6a] mb-1" style={garamond}>IBAN</p>
          <p className="text-base text-[#2c2118] tracking-wider" style={{ ...garamond, fontWeight: 300 }}>BE94 3771 3164 6114</p>
        </div>
      </div>

      {/* Invite capture d'écran */}
      <p className="text-xs text-[#a89880] italic" style={garamond}>
        Pensez à faire une capture d'écran pour ne pas perdre ces informations ! 
      </p>
    </div>
  </div>
)}
 
        {/* Les 3 derniers messages */}
        {messages.length > 0 && (
          <div className="mt-16 text-left space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-[#b89a6a] opacity-30" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#b89a6a]" style={garamond}>Derniers messages</p>
              <div className="h-px flex-1 bg-[#b89a6a] opacity-30" />
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className="border-l-2 border-[#b89a6a] border-opacity-40 pl-5 py-1">
                <p className="text-[#2c2118] text-base leading-relaxed mb-2" style={{ ...garamond, fontWeight: 300 }}>
                  "{msg.message}"
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#b89a6a] italic" style={garamond}>{msg.nom}</p>
                  <span className="text-[#d8cfc4] text-xs">·</span>
                  <p className="text-xs text-[#a89880]" style={garamond}>{formatDate(msg.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

 


// ── Composant principal ────────────────────────────────



function MusiqueSection() {
  const [nom, setNom] = useState("");
  const [musique, setMusique] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!nom.trim() || !musique.trim()) {
      alert("Veuillez remplir votre nom et votre suggestion.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/musique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), musique: musique.trim() }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-[#faf8f5]">
      <div className="max-w-xl mx-auto text-center">

        {/* En-tête */}
        <p className="tracking-[0.3em] text-[10px] uppercase text-[#b89a6a] mb-3" style={garamond}>
          La piste de danse
        </p>
        <h2 className="text-4xl md:text-5xl text-[#2c2118] mb-4" style={{ ...garamond, fontWeight: 300 }}>
          Votre tube incontournable
        </h2>
        <p className="text-[#7a6a58] text-base mb-10 leading-relaxed" style={{ ...garamond, fontWeight: 300 }}>
          Quelle est la chanson qui vous ferait indubitablement quitter votre chaise et envahir la piste de danse ? Partagez-la avec nous — nous ferons de notre mieux pour l'intégrer à la soirée. 
        </p>

        {!sent ? (
          <div className="flex flex-col gap-4 text-left">
            <input
              type="text"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-[#d8cfc4] bg-transparent px-5 py-3 text-[#2c2118] placeholder-[#b89a6a] outline-none focus:border-[#b89a6a] transition-colors"
              style={garamond}
            />
            <input
              type="text"
              placeholder="Titre — Artiste (ex: September — Earth, Wind & Fire)"
              value={musique}
              onChange={(e) => setMusique(e.target.value)}
              className="w-full border border-[#d8cfc4] bg-transparent px-5 py-3 text-[#2c2118] placeholder-[#b89a6a] outline-none focus:border-[#b89a6a] transition-colors"
              style={garamond}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="self-center px-10 py-3 bg-[#b89a6a] text-white text-xs tracking-[0.25em] uppercase hover:bg-[#a08558] transition-colors disabled:opacity-50"
              style={garamond}
            >
              Envoyer !
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <span className="text-4xl"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2">
  <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="6" cy="18" r="3"/>
  <circle cx="18" cy="16" r="3"/>
</svg></span>
            <p className="text-2xl text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
              On note ça !
            </p>
            <p className="text-[#7a6a58] text-sm" style={garamond}>
              Les mariés feront tout pour que votre chanson résonne ce soir-là. 
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const weddingDate = new Date("2026-09-05T19:00:00+02:00");
  const timeLeft = useCountdown(weddingDate);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mapsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Northlaan+13,+8400+Oostende,+Belgium";

  return (
    <main className="min-h-screen bg-[#faf8f5]">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/Images/mriage audry erika.jpeg')",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 60%, rgba(250,248,245,0.85) 95%, rgba(250,248,245,1) 100%)",
          }}
        />

        {/* Haut : bagues + invitation */}
        <div className="relative z-10 flex flex-col items-center justify-start h-full pt-[12vh] px-4 text-center">
          <div className="mb-3 opacity-90">
            <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
              <circle cx="22" cy="20" r="16" stroke="#f89b05" strokeWidth="2.5" fill="none" />
              <circle cx="42" cy="20" r="16" stroke="#f89b05" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
          <p className="tracking-[0.35em] text-[20px] uppercase text-[#56001f] font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Invitation
          </p>
          <div className="w-16 h-px bg-[#56001f] opacity-60 mb-6" />
          <div className="animate-bounce mt-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#56001f" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Bas : noms */}
        <div className="absolute bottom-[8vh] left-0 right-0 z-10 flex flex-col items-center px-4 text-center">
          <h1 className="text-5xl md:text-7xl text-[#2c2118] leading-none mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Erika <span className="text-[#56001f]">&</span> Audry
          </h1>
          <p className="text-sm md:text-base tracking-[0.2em] text-[#7a6a58] uppercase font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            5 Septembre 2026 · 19h · Oostende
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPTE À REBOURS
      ══════════════════════════════════════ */}
       {/* <section className="py-20 px-4 bg-[#faf8f5]">
        <p className="text-center tracking-[0.3em] text-[20px] uppercase text-[#56001f] mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Plus que…
        </p>

        <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
          {[
            { value: timeLeft.jours, label: "Jours" },
            { value: timeLeft.heures, label: "Heures" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.secondes, label: "Secondes" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl text-[#2c2118] tabular-nums leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
                suppressHydrationWarning
              >
                {String(value).padStart(2, "0")}
              </span>
              <span className="mt-2 text-[10px] tracking-[0.25em] uppercase text-[#2c2118]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {label}
              </span>
            </div>
          ))}
        </div> 
      


        {/* Séparateur décoratif */}
      {/*  <div className="flex items-center justify-center gap-4 mt-16 mb-0">
          <div className="h-px w-16 md:w-32 bg-[#56001f] opacity-40" />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#56001f" opacity="0.6" />
          </svg>
          <div className="h-px w-16 md:w-32 bg-[#56001f] opacity-40" />
        </div>
      </section> */}
      <section className="py-20 px-4 bg-[#faf8f5]">
  {timeLeft.termine ? (
    <div className="text-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" className="mx-auto mb-4">
        <path d="M12 21c0-5-4.5-8-4.5-12A4.5 4.5 0 0112 4.5 4.5 4.5 0 0116.5 9c0 4-4.5 7-4.5 12z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-3xl md:text-4xl text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
        Merci d'avoir célébré avec nous
      </p>
      <p className="text-sm text-[#7a6a58] mt-2 tracking-widest" style={garamond}>
        Erika & Audry
      </p>
    </div>
  ) : (
    <>
      <p className="text-center tracking-[0.3em] text-[10px] uppercase text-[#b89a6a] mb-10" style={garamond}>Plus que…</p>
      <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
        {[{ value: timeLeft.jours, label: "Jours" }, { value: timeLeft.heures, label: "Heures" }, { value: timeLeft.minutes, label: "Minutes" }, { value: timeLeft.secondes, label: "Secondes" }].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-5xl md:text-7xl text-[#2c2118] tabular-nums leading-none" style={{ ...garamond, fontWeight: 300 }} suppressHydrationWarning>
              {String(value).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[10px] tracking-[0.25em] uppercase text-[#b89a6a]" style={garamond}>{label}</span>
          </div>
        ))}
      </div>
    </>
  )}
  <div className="flex items-center justify-center gap-4 mt-16">
    <div className="h-px w-16 md:w-32 bg-[#b89a6a] opacity-40" />
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#b89a6a" opacity="0.6" /></svg>
    <div className="h-px w-16 md:w-32 bg-[#b89a6a] opacity-40" />
  </div>
</section>

      {/* ══════════════════════════════════════
          DÉTAILS DE L'ÉVÉNEMENT
      ══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-[#faf8f5] max-w-2xl mx-auto text-center">
        <p className="tracking-[0.3em] text-[20px] uppercase text-[#b89a6a] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Détails
        </p>

        <div className="space-y-8">
          {/* Date */}
          <div className="flex flex-col items-center gap-1">
           <CalendarDays
             size={22}
             strokeWidth={1.5}
             className="text-[#b89a6a] mb-1 opacity-90"
               />
            <p className="text-x tracking-widest uppercase text-[#b89a6a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Date</p>
            <p className="text-2xl text-[#2c2118]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Samedi 5 Septembre 2026
            </p>
            <p className="text-x text-[#7a6a58] tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Cérémonie à 19h00
            </p>
          </div>

          <div className="h-px w-24 bg-[#b89a6a] opacity-30 mx-auto" />

{/* Bouton Programme — remplace Lieu + Ouvrir l'itinéraire */}
<div className="flex flex-col items-center gap-3">
  <span className="text-[#b89a6a] text-xl mb-1">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4">
      <path d="M12 20c-4-3-8-6.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 4.5-4 8-8 11z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
  <p className="text-xs tracking-widest uppercase text-[#b89a6a]" style={garamond}>Déroulé</p>
  <p className="text-2xl text-[#2c2118]" style={{ ...garamond, fontWeight: 300 }}>
    Toute la journée
  </p>
  <p className="text-sm text-[#7a6a58] tracking-widest" style={garamond}>
    De la mairie à la piste de danse
  </p>
</div>
</div>

<Link
  href="/programme"
  className="inline-flex items-center gap-2 mt-12 px-8 py-3 border border-[#b89a6a] text-[#b89a6a] text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#b89a6a] hover:text-white"
  style={garamond}
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  Voir le programme
</Link>
      
      </section>

            {/* ══════════════════════════════════════
          STORY
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#f3ede4]">
        <div className="max-w-2xl mx-auto text-center">
 
          {/* En-tête */}
          <p className="tracking-[0.3em] text-[25px] uppercase text-[#b89a6a] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            L'HISTOIRE
          </p>
          <h2 className="text-4xl md:text-5xl text-[#2c2118] mb-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Erika <span className="italic text-[#b89a6a]">&</span> Audry
          </h2>
 
          {/* Séparateur floral */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-12 bg-[#b89a6a] opacity-40" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C9 6 4 7 4 12s5 10 8 10 8-5 8-10S15 6 12 2z" fill="#b89a6a" opacity="0.4" />
              <path d="M12 2C15 6 20 7 20 12s-5 10-8 10" stroke="#b89a6a" strokeWidth="1" opacity="0.6" />
            </svg>
            <div className="h-px w-12 bg-[#b89a6a] opacity-40" />
          </div>
 
          {/* Paragraphes — modifiables en haut du fichier */}
          <div className="space-y-6">
            {storyParagraphs.map((p, i) => (
              <p
                key={i}
                className="text-lg md:text-xl italic text-[#4a3f35] leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
              >
                {i === 0 ? <span className="text-4xl text-[#b89a6a] float-left mr-2 leading-none">{p[0]}</span> : null}
                {i === 0 ? p.slice(1) : p}
              </p>
            ))}
          </div>
 
          {/* Citation finale */}
          <p
            className="mt-12 text-3xl italic text-[#b89a6a]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            Joignez-vous à eux pour célébrer leur union.
          </p>
 
        </div>
      </section>

            {/* ══ RSVP ══ */}
      <RSVPSection />

 


      {/* ══ LIVRE D'OR ══ */}
      <LivreOrSection />
      {/* ══ MUSIQUE ══ */}
      <MusiqueSection />
 
      {/* ══ FOOTER ══ */}
      <footer className="py-12 text-center border-t border-[#e8e0d5] bg-[#faf8f5]">
        <div className="mb-4 opacity-60">
          <svg width="40" height="26" viewBox="0 0 64 40" fill="none" className="mx-auto">
            <circle cx="22" cy="20" r="16" stroke="#b89a6a" strokeWidth="2" fill="none" />
            <circle cx="42" cy="20" r="16" stroke="#b89a6a" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <p className="text-x tracking-[0.3em] uppercase text-[#b89a6a]" style={garamond}>
          Erika & Audry · 5 Septembre 2026
        </p>
        <p className="text-x text-[#c4b8a8] mt-1" style={garamond}>
          Avec tout notre amour 🤍
        </p>
      </footer>


    </main>
  );
}