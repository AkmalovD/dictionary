export const LANGS = ['ru', 'en', 'uz'] as const;
export type Lang = (typeof LANGS)[number];

type Names = { termRu: string; termEn: string; termUz: string };
type Searchable = Names & {
  definitionRu: string;
  definitionEn: string;
  definitionUz: string;
};

// Lower-cases and unifies characters people type interchangeably: the Uzbek
// apostrophe variants (o', oʻ, o’) and Russian ё / е.
export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ʻʼ’‘`´]/g, "'")
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchText(term: Searchable): string {
  return normalizeSearch(
    [
      term.termRu,
      term.termEn,
      term.termUz,
      term.definitionRu,
      term.definitionEn,
      term.definitionUz,
    ].join(' '),
  );
}

// Name in the requested language, falling back to whichever one is filled in.
export function displayName(term: Names, lang: Lang): string {
  const byLang = { ru: term.termRu, en: term.termEn, uz: term.termUz };
  return byLang[lang] || byLang.en || byLang.ru || byLang.uz;
}

export function firstLetter(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
