"use client";
// Page /mot-de-passe-oublie : étape 1 — on saisit le numéro, on reçoit un code.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChampTelephone, { numeroComplet } from "@/components/Champtelephone";
import { demanderReset, ErreurAPI } from "@/lib/auth";

export default function PageMotDePasseOublie() {
  const router = useRouter();
  const [telephone, setTelephone] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (telephone.length !== 8) {
      setErreur("Le numéro doit contenir 8 chiffres.");
      return;
    }
    setErreur(null);
    setEnvoi(true);
    try {
      const tel = numeroComplet(telephone);
      await demanderReset(tel);
      // On mémorise le numéro pour l'étape 2, puis on y va.
      try { sessionStorage.setItem("reset_telephone", tel); } catch {}
      router.push("/reinitialiser");
    } catch (err) {
      setErreur(err instanceof ErreurAPI ? err.message : "Une erreur est survenue.");
      setEnvoi(false);
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
          <Link href="/connexion" className="text-sm text-gris hover:text-bleu">
            &larr; Connexion
          </Link>
        </div>

        <div className="bg-white border border-ligne rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-encre mb-1">Mot de passe oublié</h1>
          <p className="text-gris text-sm mb-6">
            Entre ton numéro : nous t&apos;enverrons un code par SMS pour
            définir un nouveau mot de passe.
          </p>

          {erreur && (
            <div className="mb-5 bg-terre-100 border border-terre/30 text-terre rounded-lg px-4 py-3 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={soumettre} className="space-y-4">
            <ChampTelephone chiffres={telephone} onChange={setTelephone} />
            <button type="submit" disabled={envoi}
              className="w-full bg-or text-encre font-bold py-3 rounded-xl hover:bg-or-600 transition-colors disabled:opacity-60">
              {envoi ? "Envoi…" : "Recevoir un code"}
            </button>
          </form>

          <p className="text-sm text-gris text-center mt-6">
            Tu t&apos;en souviens ?{" "}
            <Link href="/connexion" className="text-bleu font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </main>
  );
}