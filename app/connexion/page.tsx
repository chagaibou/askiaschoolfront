"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { connexion, ErreurAPI } from "@/lib/auth";
import ChampTelephone, { numeroComplet } from "@/components/Champtelephone";
export default function PageConnexion() {
  const router = useRouter();

  const [telephone, setTelephone] = useState(""); // 8 chiffres seuls
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);

    if (telephone.length !== 8) {
      setErreur("Le numéro doit contenir exactement 8 chiffres.");
      return;
    }

    setEnvoi(true);
    try {
      // Même format que l'inscription : +22370000000
      await connexion(numeroComplet(telephone), password);
      router.push("/ressources");
    } catch (err) {
      if (err instanceof ErreurAPI) {
        setErreur(err.message);
      } else {
        setErreur("Une erreur est survenue. Réessaie.");
      }
      setEnvoi(false);
    }
  }

  return (
    <main className="min-h-screen bg-sable flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Retour explicite + logo */}
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
          <h1 className="text-2xl font-bold text-encre mb-1">Se connecter</h1>
          <p className="text-gris text-sm mb-6">
            Content de te revoir ! Entre ton numéro et ton mot de passe.
          </p>

          {erreur && (
            <div className="mb-5 bg-terre-100 border border-terre/30 text-terre rounded-lg px-4 py-3 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={soumettre} className="space-y-4">
            <ChampTelephone chiffres={telephone} onChange={setTelephone} />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium">Mot de passe</label>
                <Link href="/mot-de-passe-oublie" className="text-xs text-bleu hover:underline">
                  Oublié ?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu"
              />
            </div>

            <button type="submit" disabled={envoi}
              className="w-full bg-or text-encre font-bold py-3 rounded-xl hover:bg-or-600 transition-colors disabled:opacity-60">
              {envoi ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="text-sm text-gris text-center mt-6">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-bleu font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}