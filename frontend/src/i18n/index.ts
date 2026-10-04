import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Lang } from '../api/types';
import en from './en.json';
import ru from './ru.json';
import uz from './uz.json';

export const LANGS: Lang[] = ['ru', 'en', 'uz'];
// Each language is always named in itself so it can be found by its speakers.
export const LANG_LABELS: Record<Lang, string> = {
  ru: 'Русский',
  en: 'English',
  uz: "O'zbekcha",
};

const STORAGE_KEY = 'dictionary.lang';
const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
    uz: { translation: uz },
  },
  lng: stored && LANGS.includes(stored) ? stored : 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function applyLanguage(lang: string) {
  document.documentElement.lang = lang;
  document.title = i18n.t('appTitle');
}
applyLanguage(i18n.language);
i18n.on('languageChanged', (lang) => {
  localStorage.setItem(STORAGE_KEY, lang);
  applyLanguage(lang);
});

export default i18n;
