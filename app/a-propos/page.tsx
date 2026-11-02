import Link from "next/link";
import EnTete from "@/components/EnTete";

// Page À propos — Server Component (statique, bien référencé).
// Texte à relire et personnaliser (repères ✍️).

export const metadata = {
  title: "À propos — AskiaSchool",
  description:
    "AskiaSchool, portée par AskiaTech, rassemble les anciens sujets d'examens maliens (DEF, BAC, CAP, BT1, BT2) et leurs corrigés, gratuitement, pour l'égalité des chances.",
};

export default function APropos() {
  return (
    <main className="bg-sable min-h-screen">
      <EnTete />

      {/* ---------- EN-TÊTE DE PAGE ---------- */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <p className="text-sm font-semibold text-or-600 uppercase tracking-wide mb-3">
          À propos
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-encre leading-tight">
          Mettre le savoir à la portée de chaque élève du Mali.
        </h1>
        <p className="mt-5 text-lg text-gris">
          AskiaSchool est une plateforme malienne qui rassemble, en un seul
          endroit, les anciens sujets d&apos;examens nationaux et leurs
          corrigés — pour que réviser ne dépende plus de la chance d&apos;avoir
          les bons documents.
        </p>
      </section>

      {/* ---------- NOTRE MISSION ---------- */}
      <section className="bg-white border-y border-ligne">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-bleu mb-5">Notre mission</h2>
          <div className="space-y-4 text-gris">
            <p>
              Au Mali, trop d&apos;élèves abordent leurs examens sans avoir pu
              s&apos;entraîner sur de vrais sujets. Les anciennes épreuves
              circulent difficilement : on les trouve chez un professeur, un
              camarade, ou pas du tout. Ce manque crée une inégalité réelle
              entre ceux qui ont accès aux ressources et les autres.
            </p>
            <p>
              Notre mission est simple :{" "}
              <strong className="text-encre">
                réunir ces ressources et les rendre accessibles à tous,
                gratuitement, depuis un simple téléphone.
              </strong>{" "}
              Sujets du DEF, du BAC, du CAP, des BT1 et BT2, corrigés, devoirs
              et compositions — classés par examen, filière, matière et année,
              pour que chaque élève trouve ce dont il a besoin en quelques
              secondes.
            </p>
            <p>
              Réviser sur les vrais sujets des années précédentes, c&apos;est
              arriver le jour de l&apos;examen en terrain connu. C&apos;est ça,
              l&apos;égalité des chances que nous voulons construire.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- COMMENT ÇA MARCHE ---------- */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-bleu mb-8">Comment ça marche</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <span className="flex-none w-10 h-10 rounded-xl bg-bleu-100 text-bleu font-bold flex items-center justify-center">1</span>
            <div>
              <h3 className="font-bold text-encre mb-1">Cherche</h3>
              <p className="text-sm text-gris">
                Filtre par examen, filière, matière et année pour trouver le
                sujet qu&apos;il te faut, sans perdre de temps.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="flex-none w-10 h-10 rounded-xl bg-or-100 text-or-600 font-bold flex items-center justify-center">2</span>
            <div>
              <h3 className="font-bold text-encre mb-1">Crée ton compte</h3>
              <p className="text-sm text-gris">
                Un numéro de téléphone suffit. L&apos;inscription est gratuite
                et prend moins d&apos;une minute.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="flex-none w-10 h-10 rounded-xl bg-vert-100 text-vert font-bold flex items-center justify-center">3</span>
            <div>
              <h3 className="font-bold text-encre mb-1">Télécharge et révise</h3>
              <p className="text-sm text-gris">
                Accède aux sujets et à leurs corrigés, entraîne-toi, et arrive
                confiant le jour de l&apos;examen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- QUI SOMMES-NOUS ---------- */}
      <section className="bg-white border-y border-ligne">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold text-bleu mb-5">Qui sommes-nous</h2>
          <div className="space-y-4 text-gris">
            <p>
              AskiaSchool est une initiative portée par{" "}
              <a
                href="https://askia-tech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bleu font-semibold hover:underline"
              >
                AskiaTech
              </a>
              , une entreprise malienne de solutions numériques et de formation
              basée à Bamako.
            </p>
            <p>
              L&apos;idée est née d&apos;un constat simple, vécu sur le terrain :
              la réussite aux examens ne devrait pas dépendre de la chance
              d&apos;avoir accès aux bonnes ressources. En accompagnant écoles,
              élèves et structures éducatives dans leurs projets, nous avons vu
              combien les anciens sujets et les corrigés circulaient
              difficilement — et combien cela creusait les inégalités entre les
              élèves.
            </p>
            <p>
              Nous avons donc décidé de mettre notre savoir-faire technique au
              service de cette cause. AskiaSchool, c&apos;est AskiaTech qui fait
              ce qu&apos;elle sait faire — construire des outils numériques
              utiles — avec une conviction : le numérique peut réduire les
              inégalités dans l&apos;éducation au Mali.
            </p>
            <p>
              Nous construisons cette plateforme pas à pas, au service des
              élèves, avec toujours la même exigence : des ressources fiables,
              bien classées, et accessibles à tous.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- APPEL À L'ACTION ---------- */}
      <section className="bg-bleu-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Rejoins AskiaSchool</h2>
          <p className="mt-3 text-bleu-100">
            Accède gratuitement à tous les sujets et prépare tes examens
            sereinement.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ressources"
              className="bg-or text-encre font-bold px-7 py-3.5 rounded-xl hover:bg-or-600 transition-colors"
            >
              Parcourir les ressources
            </Link>
            <Link
              href="/inscription"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- PIED DE PAGE ---------- */}
      <footer className="bg-encre text-white/70">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm flex flex-wrap items-center justify-between gap-4">
          <span className="font-bold text-white">AskiaSchool</span>
          <span>Ressources d&apos;examens pour les élèves du Mali.</span>
        </div>
      </footer>
    </main>
  );
}