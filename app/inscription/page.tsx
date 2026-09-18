"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inscription, connexion, ErreurAPI } from "@/lib/auth";
import ChampTelephone, { numeroComplet } from "@/components/Champtelephone";

export default function PageInscription() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    telephone: "",   // ← les 8 chiffres seuls (sans +223)
    email: "",
    password: "",
    confirmation: "",
  });
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);

  function majChamp(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const criteres = [
    { label: "Au moins 8 caractères", ok: form.password.length >= 8 },
    { label: "Au moins une lettre", ok: /[a-zA-Z]/.test(form.password) },
    { label: "Au moins un chiffre", ok: /[0-9]/.test(form.password) },
  ];
  const nbOk = criteres.filter((c) => c.ok).length;
  const motDePasseOk = nbOk === criteres.length;
  const confirmationRemplie = form.confirmation.length > 0;
  const motsCorrespondent = form.password === form.confirmation;
  const telephoneOk = form.telephone.length === 8;

  const couleursBarre = ["bg-terre", "bg-terre", "bg-or", "bg-vert"];
  const largeurBarre = ["w-0", "w-1/3", "w-2/3", "w-full"];

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);

    if (!telephoneOk) {
      setErreur("Le numéro doit contenir exactement 8 chiffres.");
      return;
    }
    if (!motDePasseOk) {
      setErreur("Ton mot de passe ne respecte pas encore tous les critères.");
      return;
    }
    if (!motsCorrespondent) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setEnvoi(true);
    try {
      // On envoie le numéro au format international complet : +22370000000
      const tel = numeroComplet(form.telephone);
      await inscription({
        first_name: form.first_name,
        last_name: form.last_name,
        telephone: tel,
        password: form.password,
        email: form.email || undefined,
      });
      await connexion(tel, form.password);

      setSucces(true);
      setTimeout(() => router.push("/ressources"), 1600);
    } catch (err) {
      if (err instanceof ErreurAPI) {
        const premier = Object.values(err.details)[0];
        setErreur(Array.isArray(premier) ? premier[0] : err.message);
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
          <h1 className="text-2xl font-bold text-encre mb-1">Créer un compte</h1>
          <p className="text-gris text-sm mb-6">Gratuit. Ton numéro suffit pour commencer.</p>

          {succes && (
            <div className="mb-5 bg-vert-100 border border-vert/30 text-vert rounded-lg px-4 py-3 text-sm font-medium">
              Bienvenue {form.first_name} ! Ton compte est créé. Redirection…
            </div>
          )}

          {erreur && !succes && (
            <div className="mb-5 bg-terre-100 border border-terre/30 text-terre rounded-lg px-4 py-3 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={soumettre} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Prénom</label>
                <input name="first_name" value={form.first_name} onChange={majChamp} required
                  className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nom</label>
                <input name="last_name" value={form.last_name} onChange={majChamp} required
                  className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />
              </div>
            </div>

            {/* Champ téléphone réutilisable : +223 figé + 8 chiffres */}
            <ChampTelephone
              chiffres={form.telephone}
              onChange={(chiffres) => setForm({ ...form, telephone: chiffres })}
            />

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email <span className="text-gris font-normal">(facultatif)</span>
              </label>
              <input name="email" type="email" value={form.email} onChange={majChamp}
                placeholder="Utile pour récupérer ton mot de passe"
                className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
              <input name="password" type="password" value={form.password} onChange={majChamp} required
                className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />

              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-ligne overflow-hidden">
                    <div className={`h-full transition-all ${couleursBarre[nbOk]} ${largeurBarre[nbOk]}`} />
                  </div>
                  <ul className="mt-2 space-y-1">
                    {criteres.map((c) => (
                      <li key={c.label} className={`text-xs flex items-center gap-1.5 ${c.ok ? "text-vert" : "text-gris"}`}>
                        <span>{c.ok ? "✓" : "○"}</span> {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
              <input name="confirmation" type="password" value={form.confirmation} onChange={majChamp} required
                className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu" />
              {confirmationRemplie && !motsCorrespondent && (
                <p className="text-xs text-terre mt-1.5">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <button type="submit" disabled={envoi || succes}
              className="w-full bg-or text-encre font-bold py-3 rounded-xl hover:bg-or-600 transition-colors disabled:opacity-60">
              {envoi ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-sm text-gris text-center mt-6">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-bleu font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </main>
  );
}