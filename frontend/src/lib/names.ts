import { useTranslation } from 'react-i18next';
import type { Lang, Topic } from '../api/types';

type Names = { termRu: string; termEn: string; termUz: string };

// Name in the requested language, falling back to whichever one is filled in.
// Mirrors displayName in backend/src/terms/search-text.ts, which decides the
// sort order.
export function termName(term: Names, lang: Lang): string {
  const byLang = { ru: term.termRu, en: term.termEn, uz: term.termUz };
  return byLang[lang] || byLang.en || byLang.ru || byLang.uz;
}

export function topicName(topic: Topic, lang: Lang): string {
  return { ru: topic.nameRu, en: topic.nameEn, uz: topic.nameUz }[lang];
}

export function useLang(): Lang {
  return useTranslation().i18n.language as Lang;
}
