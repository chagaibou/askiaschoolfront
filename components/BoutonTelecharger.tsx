"use client";
// Petit Client Component isolé : gère le clic, le token et le téléchargement.
// Grâce à cette isolation, la carte qui l'utilise peut RESTER un Server
// Component (bon pour le référencement de l'aperçu d'accueil).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { telechargerRessource } from "@/lib/auth";

export default function BoutonTelecharger({
  id,
  titre,
}: {
  id: number;
  titre: string;
}) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function cliquer() {
    setErreur(null);
    setEnCours(true);
    try {
      await telechargerRessource(id, titre);
    } catch (err) {
      if (err instanceof Error && err.message === "NON_CONNECTE") {
        // Non connecté : on mémorise où il était, puis on l'envoie se connecter.
        // Après connexion, on pourra le ramener ici.
        try {
          sessionStorage.setItem("retour_apres_connexion", window.location.pathname);
        } catch {}
        router.push("/connexion");
        return;
      }
      setErreur("Téléchargement impossible. Réessaie.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div>
      <button
        onClick={cliquer}
        disabled={enCours}
        className="w-full bg-or text-encre font-bold py-2.5 rounded-lg hover:bg-or-600 transition-colors disabled:opacity-60"
      >
        {enCours ? "Téléchargement…" : "Télécharger"}
      </button>
      {erreur && <p className="text-xs text-terre mt-1.5">{erreur}</p>}
    </div>
  );
}