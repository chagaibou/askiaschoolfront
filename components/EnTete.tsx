"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUtilisateur, deconnexion, type Utilisateur } from "@/lib/auth";

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/ressources", label: "Examens" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function EnTete() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [user, setUser] = useState<Utilisateur | null>(null);

  // On lit l'utilisateur connecté APRÈS le montage (localStorage n'existe
  // que dans le navigateur). Au premier rendu, user = null ; s'il est
  // connecté, l'effet met à jour et la nav se réaffiche avec son nom.
  useEffect(() => {
    setUser(getUtilisateur());
  }, []);

  function seDeconnecter() {
    deconnexion();
    setUser(null);
    setOuvert(false);
    router.push("/");
  }

  // Le bloc de droite change selon l'état de connexion.
  // On le fabrique une fois, réutilisé desktop + mobile.
  const blocCompte = user ? (
    <div className="flex items-center gap-3">
      <span className="text-bleu-100 text-sm">
        Bonjour <span className="font-semibold text-white">{user.first_name}</span>
      </span>
      <button
        onClick={seDeconnecter}
        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-sm"
      >
        Déconnexion
      </button>
    </div>
  ) : (
    <Link href="/connexion" className="bg-or text-encre font-semibold px-4 py-2 rounded-lg hover:bg-or-600 text-sm">
      Connexion
    </Link>
  );

  return (
    <header className="bg-bleu-900 text-white sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
          <span className="w-7 h-7 rounded-lg bg-or inline-block" />
          AskiaSchool
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} className="text-bleu-100 hover:text-or">
              {l.label}
            </Link>
          ))}
          {blocCompte}
        </nav>

        {/* BURGER MOBILE */}
        <button
          onClick={() => setOuvert(!ouvert)}
          className="sm:hidden flex flex-col gap-1.5 p-2"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${ouvert ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${ouvert ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${ouvert ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* MENU MOBILE */}
      {ouvert && (
        <nav className="sm:hidden bg-bleu-900 border-t border-white/10 px-6 py-4 flex flex-col gap-3 text-sm">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOuvert(false)}
              className="text-bleu-100 hover:text-or py-1">
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-bleu-100 text-sm">
                  Bonjour <span className="font-semibold text-white">{user.first_name}</span>
                </span>
                <button onClick={seDeconnecter}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-sm">
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/connexion" onClick={() => setOuvert(false)}
                className="block bg-or text-encre font-semibold px-4 py-2.5 rounded-lg text-center">
                Connexion
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}