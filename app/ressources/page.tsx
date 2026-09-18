"use client";
// Page /ressources : recherche + filtres + liste + "Charger plus".
// Client Component car interactive (les filtres et la liste évoluent).

import { useEffect, useState } from "react";
import EnTete from "@/components/EnTete";
import CarteRessource from "@/components/CarteRessource";
import {
  getRessources,
  getExamens,
  getFilieres,
  type Ressource,
  type Examen,
  type Filiere,
  type FiltresRessource,
} from "@/lib/api";

// Types de ressources (valeurs techniques -> libellés lisibles).
const TYPES = [
  { value: "examen_national", label: "Examen national" },
  { value: "devoir_domicile", label: "Devoir" },
  { value: "composition_trimestrielle", label: "Composition" },
  { value: "cours", label: "Cours" },
];

// Liste d'années : de l'année courante jusqu'à 2010.
const ANNEE_MAX = new Date().getFullYear();
const ANNEES = Array.from({ length: ANNEE_MAX - 2009 }, (_, i) => ANNEE_MAX - i);

// État vide des filtres (chaînes, car ça vient de <select> / <input>).
const FILTRES_VIDES = {
  search: "",
  examen: "",
  filiere: "",
  annee: "",
  type_ressource: "",
};

export default function PageRessources() {
  // brouillon = ce que l'utilisateur édite ; il n'est appliqué qu'au clic.
  const [brouillon, setBrouillon] = useState(FILTRES_VIDES);
  // filtresActifs = ceux réellement appliqués (sert au "Charger plus").
  const [filtresActifs, setFiltresActifs] = useState(FILTRES_VIDES);

  // Données du référentiel pour les menus déroulants.
  const [examens, setExamens] = useState<Examen[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);

  // Résultats + pagination.
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [aSuivant, setASuivant] = useState(false);
  const [chargement, setChargement] = useState(false);

  // --- Chargement initial : référentiel + première page de ressources ---
  useEffect(() => {
    getExamens().then((d) => setExamens(d.results)).catch(() => {});
    getFilieres().then((d) => setFilieres(d.results)).catch(() => {});
    charger(FILTRES_VIDES, 1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convertit les filtres (chaînes) en objet propre pour l'API.
  function construire(f: typeof FILTRES_VIDES, pageN: number): FiltresRessource {
    const out: FiltresRessource = { page: pageN };
    if (f.search) out.search = f.search;
    if (f.examen) out.examen = Number(f.examen);
    if (f.filiere) out.filiere = Number(f.filiere);
    if (f.annee) out.annee = Number(f.annee);
    if (f.type_ressource) out.type_ressource = f.type_ressource;
    return out;
  }

  // Charge une page. remplacer=true -> nouvelle recherche ; false -> ajoute.
  async function charger(f: typeof FILTRES_VIDES, pageN: number, remplacer: boolean) {
    setChargement(true);
    try {
      const data = await getRessources(construire(f, pageN));
      setTotal(data.count);
      setASuivant(Boolean(data.next));
      setPage(pageN);
      setRessources((prev) => (remplacer ? data.results : [...prev, ...data.results]));
    } catch {
      if (remplacer) setRessources([]);
    } finally {
      setChargement(false);
    }
  }

  // Clic sur "Rechercher" : on applique le brouillon, on repart page 1.
  function rechercher(e: React.FormEvent) {
    e.preventDefault();
    setFiltresActifs(brouillon);
    charger(brouillon, 1, true);
  }

  // Clic sur "Charger plus" : page suivante, on ajoute aux résultats.
  function chargerPlus() {
    charger(filtresActifs, page + 1, false);
  }

  // Les filières proposées dépendent de l'examen choisi (le DEF n'en a pas).
  const filieresAffichees = brouillon.examen
    ? filieres.filter((fl) => fl.examen === Number(brouillon.examen))
    : filieres;

  return (
    <main className="min-h-screen bg-sable">
      <EnTete />

      {/* En-tête de page */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-bleu">
          Accéder aux ressources
        </h1>
        <p className="text-gris mt-2 max-w-2xl">
          Sujets, devoirs et compositions. Filtre par examen, filière, année et
          type, puis télécharge.
        </p>
      </section>

      {/* --- BLOC DE FILTRES --- */}
      <section className="max-w-5xl mx-auto px-6">
        <form onSubmit={rechercher} className="bg-white border border-ligne rounded-2xl p-5 sm:p-6">
          {/* Recherche */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Rechercher</label>
            <input
              value={brouillon.search}
              onChange={(e) => setBrouillon({ ...brouillon, search: e.target.value })}
              placeholder="Cherche un titre, une matière…"
              className="w-full border border-ligne rounded-lg px-3 py-2.5 focus:outline-none focus:border-bleu"
            />
          </div>

          {/* Les 4 filtres déroulants */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Examen */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Examen</label>
              <select
                value={brouillon.examen}
                onChange={(e) =>
                  setBrouillon({ ...brouillon, examen: e.target.value, filiere: "" })
                }
                className="w-full border border-ligne rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-bleu"
              >
                <option value="">Tous</option>
                {examens.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.nom}</option>
                ))}
              </select>
            </div>

            {/* Filière */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Filière</label>
              <select
                value={brouillon.filiere}
                onChange={(e) => setBrouillon({ ...brouillon, filiere: e.target.value })}
                className="w-full border border-ligne rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-bleu"
              >
                <option value="">Toutes</option>
                {filieresAffichees.map((fl) => (
                  <option key={fl.id} value={fl.id}>{fl.nom}</option>
                ))}
              </select>
            </div>

            {/* Année */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Année</label>
              <select
                value={brouillon.annee}
                onChange={(e) => setBrouillon({ ...brouillon, annee: e.target.value })}
                className="w-full border border-ligne rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-bleu"
              >
                <option value="">Toutes</option>
                {ANNEES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <select
                value={brouillon.type_ressource}
                onChange={(e) => setBrouillon({ ...brouillon, type_ressource: e.target.value })}
                className="w-full border border-ligne rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-bleu"
              >
                <option value="">Tous</option>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton rechercher */}
          <div className="mt-5">
            <button
              type="submit"
              disabled={chargement}
              className="bg-bleu text-white font-bold px-8 py-3 rounded-xl hover:bg-bleu-500 transition-colors disabled:opacity-60"
            >
              {chargement ? "Recherche…" : "Rechercher"}
            </button>
          </div>
        </form>
      </section>

      {/* --- RÉSULTATS --- */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-sm text-gris mb-5">
          {total} ressource{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
        </p>

        {ressources.length === 0 && !chargement ? (
          <p className="text-gris py-10 text-center">
            Aucune ressource ne correspond. Essaie d&apos;élargir tes filtres.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ressources.map((r) => (
                <CarteRessource key={r.id} ressource={r} />
              ))}
            </div>

            {/* Charger plus : visible seulement s'il y a une page suivante */}
            {aSuivant && (
              <div className="mt-10 text-center">
                <button
                  onClick={chargerPlus}
                  disabled={chargement}
                  className="bg-white border border-bleu text-bleu font-bold px-8 py-3 rounded-xl hover:bg-bleu-100 transition-colors disabled:opacity-60"
                >
                  {chargement ? "Chargement…" : "Charger plus"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}