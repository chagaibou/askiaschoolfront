// =========================================================
// lib/api.ts
// TOUT ce qui parle à l'API Django (ressources + référentiel).
// L'authentification est dans lib/auth.ts (fichier séparé).
// =========================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;


// ---------------------------------------------------------
// LES TYPES — la "forme" des données renvoyées par l'API.
// Ils doivent correspondre à tes serializers Django.
// ---------------------------------------------------------

export interface Ressource {
  id: number;
  titre: string;
  type_ressource: string;
  annee: number | null;
  trimestre: number | null;
  examen: string;          // StringRelatedField -> une chaîne, ex : "BAC"
  filiere: string | null;
  matiere: string;
  a_un_fichier: boolean;
}

export interface Examen {
  id: number;
  nom: string;
  niveau: string;
}

export interface Filiere {
  id: number;
  nom: string;
  examen: number;          // l'id de l'examen auquel la filière appartient
}

export interface Matiere {
  id: number;
  nom: string;
}

// L'API pagine : elle renvoie une enveloppe autour des résultats.
export interface ReponsePaginee<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Les filtres qu'on peut passer à getRessources (tous optionnels).
export interface FiltresRessource {
  examen?: number;
  filiere?: number;
  matiere?: number;
  annee?: number;
  type_ressource?: string;
  search?: string;
  ordering?: string;
  page?: number;
}


// ---------------------------------------------------------
// getRessources(filtres)
// Liste des ressources, avec filtres optionnels.
// ---------------------------------------------------------
export async function getRessources(
  filtres: FiltresRessource = {}
): Promise<ReponsePaginee<Ressource>> {
  // On ne garde que les filtres réellement renseignés.
  const params = new URLSearchParams();
  for (const [cle, valeur] of Object.entries(filtres)) {
    if (valeur !== "" && valeur !== null && valeur !== undefined) {
      params.append(cle, String(valeur));
    }
  }

  const url = `${API_URL}/ressources/?${params.toString()}`;

  const reponse = await fetch(url);
  if (!reponse.ok) {
    throw new Error("Impossible de charger les ressources.");
  }
  return reponse.json();
}


// Récupère les N ressources les plus récentes, pour l'aperçu d'accueil.
export async function getRessourcesRecentes(limite = 6): Promise<Ressource[]> {
  const data = await getRessources({ ordering: "-date_ajout" });
  return data.results.slice(0, limite);
}


// ---------------------------------------------------------
// Le référentiel, pour alimenter les menus de filtres (public).
// ---------------------------------------------------------
export async function getExamens(): Promise<ReponsePaginee<Examen>> {
  const reponse = await fetch(`${API_URL}/examens/`);
  if (!reponse.ok) throw new Error("Impossible de charger les examens.");
  return reponse.json();
}

export async function getMatieres(): Promise<ReponsePaginee<Matiere>> {
  const reponse = await fetch(`${API_URL}/matieres/`);
  if (!reponse.ok) throw new Error("Impossible de charger les matières.");
  return reponse.json();
}

export async function getFilieres(): Promise<ReponsePaginee<Filiere>> {
  const reponse = await fetch(`${API_URL}/filieres/`);
  if (!reponse.ok) throw new Error("Impossible de charger les filières.");
  return reponse.json();
}