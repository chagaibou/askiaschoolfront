// =========================================================
// lib/auth.ts
// Toute la logique d'AUTHENTIFICATION passe par ici :
// inscription, connexion, et gestion du token dans localStorage.
// Séparé de api.ts (les ressources) car c'est un domaine distinct.
// =========================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Clés sous lesquelles on range les infos dans le navigateur.
const CLE_ACCESS = "askia_access";
const CLE_REFRESH = "askia_refresh";
const CLE_USER = "askia_user";


// ---------------------------------------------------------
// LES TYPES
// ---------------------------------------------------------
export interface Utilisateur {
  id: number;
  telephone: string;
  first_name: string;
  last_name: string;
  email: string | null;
  role: string;
}

// Ce qu'on envoie à l'inscription (correspond à ton RegisterSerializer).
export interface DonneesInscription {
  telephone: string;
  password: string;
  first_name: string;
  last_name: string;
  email?: string;
}


// ---------------------------------------------------------
// inscription()
// POST /auth/register/ — crée un compte élève.
// ---------------------------------------------------------
export async function inscription(donnees: DonneesInscription): Promise<Utilisateur> {
  const reponse = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });

  if (!reponse.ok) {
    // L'API renvoie les erreurs champ par champ (ex : téléphone déjà pris,
    // mot de passe trop faible). On les remonte pour les afficher.
    const erreurs = await reponse.json().catch(() => ({}));
    throw new ErreurAPI("Inscription impossible.", erreurs);
  }

  return reponse.json();
}


// ---------------------------------------------------------
// connexion()
// POST /auth/login/ — renvoie access + refresh + user.
// On range le tout dans localStorage pour "rester connecté".
// ---------------------------------------------------------
export async function connexion(
  telephone: string,
  password: string
): Promise<Utilisateur> {
  const reponse = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone, password }),
  });

  if (!reponse.ok) {
    const erreurs = await reponse.json().catch(() => ({}));
    throw new ErreurAPI("Téléphone ou mot de passe incorrect.", erreurs);
  }

  const data = await reponse.json();
  // data = { access, refresh, user }
  localStorage.setItem(CLE_ACCESS, data.access);
  localStorage.setItem(CLE_REFRESH, data.refresh);
  localStorage.setItem(CLE_USER, JSON.stringify(data.user));
  return data.user;
}


// ---------------------------------------------------------
// deconnexion() — efface tout du navigateur.
// ---------------------------------------------------------
export function deconnexion(): void {
  localStorage.removeItem(CLE_ACCESS);
  localStorage.removeItem(CLE_REFRESH);
  localStorage.removeItem(CLE_USER);
}


// ---------------------------------------------------------
// Petits utilitaires que les pages utiliseront.
// ---------------------------------------------------------

// Le token d'accès (pour les requêtes protégées, ex : téléchargement).
export function getToken(): string | null {
  if (typeof window === "undefined") return null; // sécurité côté serveur
  return localStorage.getItem(CLE_ACCESS);
}

// L'utilisateur connecté (ou null). Sert à afficher son nom, etc.
export function getUtilisateur(): Utilisateur | null {
  if (typeof window === "undefined") return null;
  const brut = localStorage.getItem(CLE_USER);
  return brut ? JSON.parse(brut) : null;
}

// Est-il connecté ?
export function estConnecte(): boolean {
  return getToken() !== null;
}


// ---------------------------------------------------------
// Une erreur maison qui transporte le détail renvoyé par l'API,
// pour afficher des messages précis dans les formulaires.
// ---------------------------------------------------------
export class ErreurAPI extends Error {
  details: Record<string, string[]>;
  constructor(message: string, details: Record<string, string[]> = {}) {
    super(message);
    this.name = "ErreurAPI";
    this.details = details;
  }
}



export async function telechargerRessource(
  id: number,
  titre: string
): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error("NON_CONNECTE");
  }
 
  const reponse = await fetch(`${API_URL}/ressources/${id}/telecharger/`, {
    headers: { Authorization: `Bearer ${token}` }, // ← LA clé : le token
  });
 
  if (reponse.status === 401) {
    // Token expiré ou invalide.
    throw new Error("NON_CONNECTE");
  }
  if (!reponse.ok) {
    throw new Error("Le téléchargement a échoué.");
  }
 
  // On récupère le fichier sous forme de "blob" (données binaires),
  // puis on force le navigateur à l'enregistrer.
  const blob = await reponse.blob();
  const url = window.URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = titre || `ressource-${id}`;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  window.URL.revokeObjectURL(url); // on libère la mémoire
}
 