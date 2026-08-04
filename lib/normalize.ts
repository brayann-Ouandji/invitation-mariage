export function normalizeName(str: string): string {
  return str
    .normalize("NFD")                     // décompose les accents
    .replace(/[\u0300-\u036f]/g, "")      // supprime les accents
    .toLowerCase()                         // insensible à la casse
    .trim()                                // enlève espaces début/fin
    .replace(/\s+/g, " ");                 // réduit espaces multiples à un seul
}