import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { LANG_LABELS, LANGS } from '../i18n';

const SIZES = ['small', 'normal', 'large'] as const;
type TextSize = (typeof SIZES)[number];
const SIZE_KEY = 'dictionary.textSize';

function storedSize(): TextSize {
  const stored = localStorage.getItem(SIZE_KEY) as TextSize | null;
  return stored && SIZES.includes(stored) ? stored : 'normal';
}

export function Header() {
  const { t, i18n } = useTranslation();
  const [size, setSize] = useState<TextSize>(storedSize);

  useEffect(() => {
    document.documentElement.dataset.textSize = size;
    localStorage.setItem(SIZE_KEY, size);
  }, [size]);

  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__title">
          {t('appTitle')}
        </Link>
        <nav className="nav">
          <div className="nav__group">
            <NavLink to="/" end className="nav__link">
              {t('nav.dictionary')}
            </NavLink>
            <NavLink to="/topics" className="nav__link">
              {t('nav.topics')}
            </NavLink>
          </div>
          <NavLink to="/terms/new" className="button button--primary nav__add">
            <span aria-hidden="true">+</span>
            {t('nav.add')}
          </NavLink>
        </nav>
        <div className="header__settings">
          <div className="switch" role="group" aria-label={t('language')}>
            {LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                lang={lang}
                className="switch__option"
                aria-pressed={i18n.language === lang}
                onClick={() => i18n.changeLanguage(lang)}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>
          <div className="switch" role="group" aria-label={t('textSize.label')}>
            <span className="switch__label">{t('textSize.label')}:</span>
            {SIZES.map((option) => (
              <button
                key={option}
                type="button"
                className="switch__option"
                aria-pressed={size === option}
                onClick={() => setSize(option)}
              >
                {t(`textSize.${option}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
