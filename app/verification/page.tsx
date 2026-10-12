"use client";
// Page /verification : saisie du code reçu par SMS après inscription.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifierCode, renvoyerCode, ErreurAPI } from "@/lib/auth";

export default function PageVerification() {
  const router = useRouter();

  const [telephone, setTelephone] = useState<string | null>(null);
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [compteRebours, setCompteRebours] = useState(0); // secondes avant renvoi

  // Au chargement : on récupère le numéro mémorisé à l'inscription.
  useEffect(() => {
    try {
      const tel = sessionStorage.getItem("verif_telephone");
      const pr = sessionStorage.getItem("verif_prenom") || "";
      setTelephone(tel);
      setPrenom(pr);
    } catch {}
  }, []);

  // Décompte pour le bouton "Renvoyer".
  useEffect(() => {
    if (compteRebours <= 0) return;
    const t = setTimeout(() => setCompteRebours(compteRebours - 1), 1000);
    return () => clearTimeout(t);
  }, [compteRebours]);

  function majCode(e: React.ChangeEvent<HTMLInputElement>) {
    // On ne garde que les chiffres, max 6.
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
  }

  async function verifier(e: React.FormEvent) {
    e.preventDefault();
    if (!telephone) {
      setErreur("Numéro introuvable. Recommence l'inscription.");
      return;
    }
    setErreur(null);
    setEnvoi(true);
    try {
      await verifierCode(telephone, code);
      // Vérifié + connecté : on nettoie et on envoie vers les ressources.
      try {
        sessionStorage.removeItem("verif_telephone");
        sessionStorage.removeItem("verif_prenom");
      } catch {}
      router.push("/ressources");
    } catch (err) {
      setErreur(err instanceof ErreurAPI ? err.message : "Vérification impossible.");
      setEnvoi(false);
    }
  }

  async function renvoyer() {
    if (!telephone || compteRebours > 0) return;
    setErreur(null);
    setInfo(null);
    try {
      const msg = await renvoyerCode(telephone);
      setInfo(msg);
      setCompteRebours(60); // bloque le renvoi 60 s
    } catch (err) {
      setErreur(err instanceof ErreurAPI ? err.message : "Renvoi impossible.");
    }
  }

  return (
    <main className="min-h-screen bg-sable flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-bleu">
            <span className="w-7 h-7 rounded-lg bg-or inline-block" />
            AskiaSchool
          </Link>
          <Link href="/" className="text-sm text-gris hover:text-bleu">
            &larr; Retour à l&apos;accueil
          </Link>
        </div>

        <div className="bg-white border border-ligne rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-encre mb-1">Vérifie ton numéro</h1>
          <p className="text-gris text-sm mb-6">
            {prenom && `${prenom}, `}nous avons envoyé un code à 6 chiffres par SMS
            {telephone ? ` au ${telephone}` : ""}. Saisis-le ci-dessous.
          </p>

          {erreur && (
            <div className="mb-5 bg-terre-100 border border-terre/30 text-terre rounded-lg px-4 py-3 text-sm">
              {erreur}
            </div>
          )}
          {info && (
            <div className="mb-5 bg-vert-100 border border-vert/30 text-vert rounded-lg px-4 py-3 text-sm">
              {info}
            </div>
          )}

          <form onSubmit={verifier} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Code de vérification</label>
              <input
                value={code}
                onChange={majCode}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="______"
                required
                className="w-full text-center text-2xl tracking-[0.5em] font-bold border border-ligne rounded-lg px-3 py-3 focus:outline-none focus:border-bleu"
              />
            </div>

            <button
              type="submit"
              disabled={envoi || code.length !== 6}
              className="w-full bg-or text-encre font-bold py-3 rounded-xl hover:bg-or-600 transition-colors disabled:opacity-60"
            >
              {envoi ? "Vérification…" : "Vérifier"}
            </button>
          </form>

          <div className="text-sm text-gris text-center mt-6">
            Pas reçu de code ?{" "}
            <button
              onClick={renvoyer}
              disabled={compteRebours > 0}
              className="text-bleu font-semibold hover:underline disabled:text-gris disabled:no-underline"
            >
              {compteRebours > 0 ? `Renvoyer dans ${compteRebours}s` : "Renvoyer le code"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}