import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'react-router';
import { useTerms, useTopics } from '../api/hooks';
import type { Lang, Term } from '../api/types';
import { LANGS } from '../i18n';
import { termName, topicName, useLang } from '../lib/names';

const DEFINITION: Record<Lang, keyof Term> = {
  ru: 'definitionRu',
  en: 'definitionEn',
  uz: 'definitionUz',
};

export function TermListPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const topicId = params.get('topicId') ?? '';

  const topics = useTopics();
  const terms = useTerms({ q, topicId, lang });

  // Filters live in the URL so Back and refresh keep them.
  const update = (changes: Record<string, string>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );

  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useEffect(() => {
    if (text === q) return;
    const timer = setTimeout(() => update({ q: text }), 300);
    return () => clearTimeout(timer);
  }, [text]);

  // Only the cards scroll, so the place in the list is kept per set of
  // filters: coming back from a term returns to the same card, and a new
  // search starts from the top.
  const listRef = useRef<HTMLDivElement>(null);
  const scrollKey = `dictionary.scroll:${lang}:${params}`;
  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = Number(sessionStorage.getItem(scrollKey) ?? 0);
    }
  }, [scrollKey, terms.data]);

  const items = terms.data?.items ?? [];
  const groups = topicId
    ? [{ id: topicId, title: '', items }]
    : [
        ...(topics.data ?? []).map((topic) => ({
          id: String(topic.id),
          title: topicName(topic, lang),
          items: items.filter((term) => term.topicId === topic.id),
        })),
        {
          id: 'none',
          title: t('noTopic'),
          items: items.filter((term) => term.topicId === null),
        },
      ].filter((group) => group.items.length > 0);
  const totalCount = topics.data?.reduce((sum, topic) => sum + (topic.termCount ?? 0), 0);

  return (
    <div className="dictionary">
      <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="search__label" htmlFor="search">
          {t('search.label')}
        </label>
        <div className="search__row">
          <input
            id="search"
            type="search"
            className="input input--large"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-describedby="search-hint"
            autoComplete="off"
          />
          {text && (
            <button type="button" className="button" onClick={() => setText('')}>
              {t('search.clear')}
            </button>
          )}
        </div>
        <p id="search-hint" className="hint">
          {t('search.hint')}
        </p>
      </form>

      <div className="dictionary__body">
        <aside className="topics-nav" aria-label={t('nav.topics')}>
          <h2 className="section-title">{t('nav.topics')}</h2>
          <ul className="topics-nav__list">
            <li>
              <button
                type="button"
                className="topics-nav__item"
                aria-current={!topicId}
                onClick={() => update({ topicId: '' })}
              >
                <span>{t('allTopics')}</span>
                {totalCount !== undefined && <span className="count">{totalCount}</span>}
              </button>
            </li>
            {topics.data?.map((topic) => (
              <li key={topic.id}>
                <button
                  type="button"
                  className="topics-nav__item"
                  aria-current={topicId === String(topic.id)}
                  onClick={() => update({ topicId: String(topic.id) })}
                >
                  <span>{topicName(topic, lang)}</span>
                  <span className="count">{topic.termCount}</span>
                </button>
              </li>
            ))}
          </ul>
          <select
            className="input topics-nav__select"
            aria-label={t('field.topic')}
            value={topicId}
            onChange={(e) => update({ topicId: e.target.value })}
          >
            <option value="">{t('allTopics')}</option>
            {topics.data?.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topicName(topic, lang)}
              </option>
            ))}
          </select>
        </aside>

        <section className="results" aria-live="polite">
          {terms.isPending && <p className="status">{t('loading')}</p>}
          {terms.isError && <p className="status status--error">{t('loadError')}</p>}
          {terms.data && (
            <>
              <p className="results__count">{t('found', { count: items.length })}</p>
              <div
                ref={listRef}
                className="results__list"
                onScroll={(e) =>
                  sessionStorage.setItem(scrollKey, String(e.currentTarget.scrollTop))
                }
              >
                {items.length === 0 && <p className="status">{t('empty')}</p>}
                {groups.map((group) => (
                  <div key={group.id} className="group">
                    {group.title && <h2 className="group__title">{group.title}</h2>}
                    <ul className="term-list">
                      {group.items.map((term) => (
                        <TermRow key={term.id} term={term} lang={lang} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function TermRow({ term, lang }: { term: Term; lang: Lang }) {
  const location = useLocation();
  const byLang = { ru: term.termRu, en: term.termEn, uz: term.termUz };
  const others = LANGS.filter((other) => other !== lang && byLang[other]);

  return (
    <li className="term-row">
      <Link
        to={`/terms/${term.id}`}
        state={{ from: location.search }}
        className="term-row__name"
      >
        {termName(term, lang)}
      </Link>
      {others.length > 0 && (
        <p className="term-row__others">
          {others.map((other) => (
            <span key={other} lang={other}>
              <abbr className="lang-tag">{other}</abbr> {byLang[other]}
            </span>
          ))}
        </p>
      )}
      {term[DEFINITION[lang]] && (
        <p className="term-row__definition">{term[DEFINITION[lang]] as string}</p>
      )}
    </li>
  );
}
