"use client";

// Champ téléphone réutilisable (inscription ET connexion).
// - "+223" figé à gauche, non modifiable.
// - L'utilisateur ne tape que 8 chiffres (les lettres/espaces sont filtrés).
// - Le composant renvoie au parent la valeur COMPLÈTE : "+22370000000".
//   Ainsi inscription et connexion envoient exactement le même format au back.

type Props = {
  // Les 8 chiffres seuls (ce que l'utilisateur voit et modifie).
  chiffres: string;
  // Appelé à chaque frappe, avec les 8 chiffres nettoyés.
  onChange: (chiffres: string) => void;
};

export default function ChampTelephone({ chiffres, onChange }: Props) {
  function gerer(e: React.ChangeEvent<HTMLInputElement>) {
    // On ne garde que les chiffres, et on limite à 8.
    const nettoye = e.target.value.replace(/\D/g, "").slice(0, 8);
    onChange(nettoye);
  }

  const complet = chiffres.length === 8;

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Téléphone</label>
      <div className="flex">
        {/* Préfixe figé */}
        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-ligne bg-sable text-gris font-medium select-none">
          +223
        </span>
        {/* Saisie des 8 chiffres */}
        <input
          type="tel"
          inputMode="numeric"
          value={chiffres}
          onChange={gerer}
          required
          placeholder="70 00 00 00"
          className="w-full border border-ligne rounded-r-lg px-3 py-2.5 focus:outline-none focus:border-bleu"
        />
      </div>
      {/* Aide : n'apparaît que si l'utilisateur a tapé quelque chose d'incomplet */}
      {chiffres.length > 0 && !complet && (
        <p className="text-xs text-gris mt-1.5">
          Le numéro doit contenir 8 chiffres ({chiffres.length}/8).
        </p>
      )}
    </div>
  );
}

// Helper : construit le numéro complet à envoyer au back.
export function numeroComplet(chiffres: string): string {
  return `+223${chiffres}`;
}