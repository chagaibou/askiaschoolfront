import Link from "next/link";
import EnTete from "@/components/EnTete";
import ApercuRessources from "@/components/ApercuRessources";

// Page d'accueil AskiaSchool — reste un Server Component (bien référencé).
// La barre de navigation interactive est isolée dans <EnTete /> (Client).

const EXAMENS = ["DEF", "BAC", "CAP", "BT1", "BT2"];

// ⚠️ Remplace ces noms d'exemple par tes vrais partenaires.
const PARTENAIRES = ["PARTENAIRE 1", "PARTENAIRE 2", "PARTENAIRE 3", "PARTENAIRE 4"];

export default function Accueil() {
  return (
    <main>
      {/* ---------- BARRE DE NAVIGATION (responsive, avec menu mobile) ---------- */}
      <EnTete />

      {/* ---------- HERO ---------- */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-encre leading-tight max-w-2xl">
          Tous tes anciens sujets d&apos;examen, au même endroit.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gris max-w-xl">
          Sujets et corrigés du DEF, du BAC, du CAP et des BT — pour réviser,
          t&apos;entraîner et arriver prêt le jour de l&apos;examen. Gratuit.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/ressources"
            className="bg-or text-encre font-bold px-6 py-3.5 rounded-xl hover:bg-or-600 transition-colors text-center"
          >
            Voir les examens
          </Link>
          <Link
            href="/inscription"
            className="bg-bleu text-white font-bold px-6 py-3.5 rounded-xl hover:bg-bleu-500 transition-colors text-center"
          >
            Créer un compte
          </Link>
        </div>
      </section>

      {/* ---------- BANDE DES EXAMENS ---------- */}
      <section className="bg-white border-y border-ligne">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-sm text-gris mb-4">Les examens couverts par la plateforme</p>
          <div className="flex flex-wrap gap-3">
            {EXAMENS.map((ex) => (
              <span key={ex} className="px-5 py-2.5 rounded-lg bg-bleu-100 text-bleu font-semibold">
                {ex}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- APERÇU DES RESSOURCES ---------- */}
      <ApercuRessources />

      {/* ---------- À PROPOS DE LA PLATEFORME ---------- */}
      <section id="a-propos" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-bleu mb-5">
          À propos de la plateforme
        </h2>
        <div className="max-w-2xl space-y-4 text-gris">
          <p>
            AskiaSchool est une plateforme malienne qui rassemble en un seul
            endroit les anciens sujets d&apos;examens nationaux — DEF, BAC, CAP,
            BT1 et BT2 — ainsi que leurs corrigés, les devoirs et les
            compositions.
          </p>
          <p>
            Notre objectif est simple : donner à chaque élève, où qu&apos;il soit
            au Mali, les mêmes chances de réussir. Trop souvent, les bons sujets
            de révision circulent difficilement. Nous les réunissons, les
            classons par examen, filière et matière, et les rendons accessibles
            gratuitement, depuis un simple téléphone.
          </p>
          <p>
            Réviser sur de vrais sujets des années précédentes, c&apos;est arriver
            le jour de l&apos;examen en terrain connu. C&apos;est ça, notre mission.
          </p>
        </div>
      </section>

      {/* ---------- COMMENT ÇA MARCHE ---------- */}
      <section className="bg-white border-y border-ligne">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="border border-ligne rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-or-100 mb-4" />
              <h3 className="font-bold text-lg mb-1.5">Cherche</h3>
              <p className="text-sm text-gris">
                Filtre par examen, filière, matière et année pour trouver le
                sujet qu&apos;il te faut en quelques secondes.
              </p>
            </div>
            <div className="border border-ligne rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-vert-100 mb-4" />
              <h3 className="font-bold text-lg mb-1.5">Télécharge</h3>
              <p className="text-sm text-gris">
                Crée un compte gratuit avec ton numéro et télécharge les sujets
                et leurs corrigés.
              </p>
            </div>
            <div className="border border-ligne rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-bleu-100 mb-4" />
              <h3 className="font-bold text-lg mb-1.5">Révise</h3>
              <p className="text-sm text-gris">
                Entraîne-toi sur les vrais sujets des années précédentes et
                arrive confiant le jour J.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- NOS PARTENAIRES ---------- */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-bleu mb-2">Nos partenaires</h2>
        <p className="text-gris mb-8 max-w-xl">
          Ils nous accompagnent pour mettre le savoir à la portée de tous.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PARTENAIRES.map((nom) => (
            <div
              key={nom}
              className="border border-ligne rounded-xl bg-white py-8 px-4 flex items-center justify-center text-center font-semibold text-gris"
            >
              {nom}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- APPEL FINAL ---------- */}
      <section className="bg-bleu-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Prêt à réviser sérieusement ?</h2>
          <p className="mt-3 text-bleu-100">
            Rejoins AskiaSchool et accède à tous les sujets gratuitement.
          </p>
          <Link
            href="/inscription"
            className="inline-block mt-7 bg-or text-encre font-bold px-7 py-3.5 rounded-xl hover:bg-or-600 transition-colors"
          >
            Créer mon compte
          </Link>
        </div>
      </section>

      {/* ---------- PIED DE PAGE ---------- */}
      <footer className="bg-encre text-white/70">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="font-bold text-white text-lg mb-1">AskiaSchool</div>
              <p className="text-sm">Ressources d&apos;examens pour les élèves du Mali.</p>
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/ressources" className="hover:text-or">Examens</Link>
              <Link href="/a-propos" className="hover:text-or">À propos</Link>
              <Link href="/contact" className="hover:text-or">Contact</Link>
              <Link href="/connexion" className="hover:text-or">Connexion</Link>
            </nav>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-sm">
            © {new Date().getFullYear()} AskiaSchool. Tous droits réservés.
          </div>
        </div>
      </footer>
    </main>
  );
}