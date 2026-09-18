import Link from "next/link";
import { getRessourcesRecentes } from "@/lib/api";
import CarteRessource from "./CarteRessource";

// Section "aperçu des ressources" pour la page d'accueil.
// Server Component ASYNCHRONE : il va chercher les données côté serveur
// AVANT d'envoyer la page. Le visiteur voit donc les ressources tout de
// suite, et Google les voit aussi (bon pour le référencement).
//
// Un Server Component peut être "async" et faire un await directement —
// c'est la grande force de Next.js pour ce cas précis.

export default async function ApercuRessources() {
  let ressources;
  try {
    ressources = await getRessourcesRecentes(6);
  } catch {
    // Si l'API ne répond pas, on n'affiche pas la section plutôt que
    // de casser toute la page d'accueil.
    return null;
  }

  return (
    <section className="bg-white border-y border-ligne">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* En-tête de section */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-bleu">
              Dernières ressources ajoutées
            </h2>
            <p className="text-gris mt-2 max-w-xl">
              Un aperçu de ce que tu trouveras sur AskiaSchool. Sujets, devoirs
              et compositions, classés et prêts à réviser.
            </p>
          </div>
        </div>

        {/* Cas base vide : message d'attente au lieu d'un trou */}
        {ressources.length === 0 ? (
          <p className="text-gris py-8">
            Les premières ressources arrivent très bientôt. Reviens vite !
          </p>
        ) : (
          <>
            {/* La grille de 6 cartes — responsive : 1 / 2 / 3 colonnes */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ressources.map((r) => (
                <CarteRessource key={r.id} ressource={r} />
              ))}
            </div>

            {/* Le bouton vers la recherche complète */}
            <div className="mt-10 text-center">
              <Link
                href="/ressources"
                className="inline-block bg-bleu text-white font-bold px-7 py-3.5 rounded-xl hover:bg-bleu-500 transition-colors"
              >
                Voir toutes les ressources
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}