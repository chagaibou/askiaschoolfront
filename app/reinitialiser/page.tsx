"use client";
// Page /reinitialiser : étape 2 — code reçu + nouveau mot de passe.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { reinitialiserMotDePasse, demanderReset, ErreurAPI } from "@/lib/auth";

export default function PageReinitialiser() {
  const router = useRouter();
  const [telephone, setTelephone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [compteRebours, setCompteRebours] = useState(0);

  useEffect(() => {
    try { setTelephone(sessionStorage.getItem("reset_telephone")); } catch {}
  }, []);

  useEffect(() => {
    if (compteRebours <= 0) return;
    const t = setTimeout(() => setCompteRebours(compteRebours - 1), 1000);
    return () => clearTimeout(t);
  }, [compteRebours]);

  const criteres = [
    { label: "Au moins 8 caractères", ok: password.length >= 8 },
    { label: "Au moins une lettre", ok: /[a-zA-Z]/.test(password) },
    { label: "Au moins un chiffre", ok: /[0-9]/.test(password) },
  ];
  const motDePasseOk = criteres.every((c) => c.ok);
  const correspondent = password === confirmation;

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!telephone) { setErreur("Numéro introuvable. Recommence."); return; }
    if (code.length !== 6) { setErreur("Le code doit contenir 6 chiffres."); return; }
    if (!motDePasseOk) { setErreur("Le mot de passe ne respecte pas les critères."); return; }
    if (!correspondent) { setErreur("Les mots de passe ne correspondent pas."); return; }

    setErreur(null);
    setEnvoi(true);
    try {
      await reinitialiserMotDePasse(telephone, code, password);
      try { sessionStorage.removeItem("reset_telephone"); } catch {}
      router.push("/connexion");
    } catch (err) {
      setErreur(err instanceof ErreurAPI ? err.message : "Réinitialisation impossible.");
      setEnvoi(false);
    }
  }

  async function renvoyer() {
    if (!telephone || compteRebours > 0) return;
    setErreur(null); setInfo(null);
    try {
      const msg = await demanderReset(telephone);
      setInfo(msg);
      setCompteRebours(60);
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
          <Link href="/connexion" className="text-sm text-gris hover:text-bleu">
            &larr; Connexion
          </Link>
        </div>

        <div className="bg-white border border-ligne rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-encre mb-1">Nouveau mot de passe</h1>
          <p className="text-gris text-sm mb-6">
            Saisis le code reçu par SMS{telephone ? ` au ${telephone}` : ""} et choisis
            un nouveau mot de passe.
          </p>

          {erreur && (
            <div className="mb-5 bg-terre-100 border border-terre/30 text-terre rounded-lg px-4 py-3 text-sm">{erreur}</div>
          )}
          {info && (
            <div className="mb-5 bg-vert-100 border border-vert/30 text-vert rounded-lg px-4 py-3 text-sm">{info}</div>
          )}

          <form onSubmit={soumettre} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Code reçu par SMS</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric" autoComplete="one-time-code" placeholder="______" required
                className="w-full text-center text-xl tracking-[0.4em] font-bold border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Nouveau mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />
              {password.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {criteres.map((c) => (
                    <li key={c.label} className={`text-xs flex items-center gap-1.5 ${c.ok ? "text-vert" : "text-gris"}`}>
                      <span>{c.ok ? "✓" : "○"}</span> {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
              <input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required
                className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />
              {confirmation.length > 0 && !correspondent && (
                <p className="text-xs text-terre mt-1.5">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <button type="submit" disabled={envoi}
              className="w-full bg-or text-encre font-bold py-3 rounded-xl hover:bg-or-600 transition-colors disabled:opacity-60">
              {envoi ? "Changement…" : "Changer mon mot de passe"}
            </button>
          </form>

          <div className="text-sm text-gris text-center mt-6">
            Pas reçu de code ?{" "}
            <button onClick={renvoyer} disabled={compteRebours > 0}
              className="text-bleu font-semibold hover:underline disabled:text-gris disabled:no-underline">
              {compteRebours > 0 ? `Renvoyer dans ${compteRebours}s` : "Renvoyer le code"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}