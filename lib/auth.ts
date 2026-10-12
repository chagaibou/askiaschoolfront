// =========================================================
// lib/auth.ts
// Toute l'authentification : inscription, vérification SMS, connexion,
// gestion du token (localStorage), téléchargement protégé.
// =========================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CLE_ACCESS = "askia_access";
const CLE_REFRESH = "askia_refresh";
const CLE_USER = "askia_user";


// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------
export interface Utilisateur {
  id: number;
  telephone: string;
  first_name: string;
  last_name: string;
  email: string | null;
  role: string;
}

export interface DonneesInscription {
  telephone: string;
  password: string;
  first_name: string;
  last_name: string;
  email?: string;
}


// ---------------------------------------------------------
// Erreur maison qui transporte le détail renvoyé par l'API.
// ---------------------------------------------------------
export class ErreurAPI extends Error {
  details: Record<string, string[]>;
  constructor(message: string, details: Record<string, string[]> = {}) {
    super(message);
    this.name = "ErreurAPI";
    this.details = details;
  }
}


// Range la session (tokens + profil) dans le navigateur.
function stockerSession(data: { access: string; refresh: string; user: Utilisateur }) {
  localStorage.setItem(CLE_ACCESS, data.access);
  localStorage.setItem(CLE_REFRESH, data.refresh);
  localStorage.setItem(CLE_USER, JSON.stringify(data.user));
}


// ---------------------------------------------------------
// inscription()
// Crée un compte INACTIF. NE connecte PAS (il faut d'abord vérifier
// le code SMS). Renvoie si le SMS a bien été envoyé.
// ---------------------------------------------------------
export async function inscription(
  donnees: DonneesInscription
): Promise<{ sms_envoye: boolean }> {
  const reponse = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });

  if (!reponse.ok) {
    const erreurs = await reponse.json().catch(() => ({}));
    throw new ErreurAPI("Inscription impossible.", erreurs);
  }

  const data = await reponse.json();
  return { sms_envoye: Boolean(data.sms_envoye) };
}


// ---------------------------------------------------------
// verifierCode()
// Envoie le code reçu par SMS. Si OK, le compte est activé et l'API
// renvoie les tokens -> on connecte l'utilisateur dans la foulée.
// ---------------------------------------------------------
export async function verifierCode(
  telephone: string,
  code: string
): Promise<Utilisateur> {
  const reponse = await fetch(`${API_URL}/auth/verifier-code/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone, code }),
  });

  const data = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    throw new ErreurAPI(data.detail || "Code invalide.");
  }

  stockerSession(data); // { access, refresh, user }
  return data.user;
}


// ---------------------------------------------------------
// renvoyerCode()
// Demande un nouveau code SMS. Renvoie le message de l'API
// (succès, ou refus si trop de demandes).
// ---------------------------------------------------------
export async function renvoyerCode(telephone: string): Promise<string> {
  const reponse = await fetch(`${API_URL}/auth/renvoyer-code/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone }),
  });

  const data = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    throw new ErreurAPI(data.detail || "Impossible de renvoyer le code.");
  }
  return data.detail || "Un nouveau code a été envoyé.";
}


// ---------------------------------------------------------
// connexion()
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
  stockerSession(data);
  return data.user;
}


// ---------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------
export function deconnexion(): void {
  localStorage.removeItem(CLE_ACCESS);
  localStorage.removeItem(CLE_REFRESH);
  localStorage.removeItem(CLE_USER);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CLE_ACCESS);
}

export function getUtilisateur(): Utilisateur | null {
  if (typeof window === "undefined") return null;
  const brut = localStorage.getItem(CLE_USER);
  return brut ? JSON.parse(brut) : null;
}

export function estConnecte(): boolean {
  return getToken() !== null;
}


// ---------------------------------------------------------
// telechargerRessource() — téléchargement protégé par token.
// ---------------------------------------------------------
export async function telechargerRessource(id: number, titre: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("NON_CONNECTE");

  const reponse = await fetch(`${API_URL}/ressources/${id}/telecharger/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (reponse.status === 401) throw new Error("NON_CONNECTE");
  if (!reponse.ok) throw new Error("Le téléchargement a échoué.");

  const blob = await reponse.blob();
  const url = window.URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = titre || `ressource-${id}`;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  window.URL.revokeObjectURL(url);
}