import type { Ressource } from "@/lib/api";
import BoutonTelecharger from "./BoutonTelecharger";

// Carte d'une ressource — reste un Server Component (pur affichage).
// Le bouton de téléchargement est un Client Component isolé (BoutonTelecharger) :
// la carte peut donc rester serveur, bonne pour le référencement de l'accueil.

const LIBELLE_TYPE: Record<string, string> = {
  examen_national: "Examen national",
  devoir_domicile: "Devoir",
  composition_trimestrielle: "Composition",
  cours: "Cours",
};

export default function CarteRessource({ ressource }: { ressource: Ressource }) {
  const typeLisible = LIBELLE_TYPE[ressource.type_ressource] ?? ressource.type_ressource;

  return (
    <article className="bg-white border border-ligne rounded-2xl p-5 flex flex-col hover:border-bleu-500 transition-colors">
      {/* Badges du haut : type + disponibilité */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-bleu-100 text-bleu">
          {typeLisible}
        </span>
        {ressource.a_un_fichier && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-vert-100 text-vert">
            Disponible
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className="font-bold text-encre leading-snug mb-1">{ressource.titre}</h3>

      {/* Matière · examen */}
      <p className="text-sm text-gris">
        {ressource.matiere} · {ressource.examen}
      </p>

      {/* Ligne : filière + année */}
      <div className="mt-4 pt-3 border-t border-ligne flex items-center gap-3 text-xs text-gris">
        {ressource.filiere && (
          <span className="font-medium text-terre">{ressource.filiere}</span>
        )}
        {ressource.annee && <span>· {ressource.annee}</span>}
      </div>

      {/* Bouton de téléchargement (client), seulement si un fichier existe.
          mt-auto le pousse en bas pour aligner les boutons entre cartes. */}
      {ressource.a_un_fichier && (
        <div className="mt-4">
          <BoutonTelecharger id={ressource.id} titre={ressource.titre} />
        </div>
      )}
    </article>
  );
}