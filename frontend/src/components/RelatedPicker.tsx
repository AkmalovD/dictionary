import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTerms } from '../api/hooks';
import { RELATION_TYPES } from '../api/types';
import type { RelationType, TermInput } from '../api/types';
import { termName, useLang } from '../lib/names';

type Relations = TermInput['relations'];
const MAX_MATCHES = 8;

interface Props {
  value: Relations;
  onChange: (value: Relations) => void;
  // The term being edited cannot be linked to itself.
  excludeId?: number;
}

export function RelatedPicker({ value, onChange, excludeId }: Props) {
  const { t } = useTranslation();
  const lang = useLang();
  const all = useTerms({ lang }).data?.items ?? [];
  const [text, setText] = useState('');

  const chosen = new Set(value.map((r) => r.termId));
  const needle = text.trim().toLowerCase();
  const matches = needle
    ? all
        .filter((term) => term.id !== excludeId && !chosen.has(term.id))
        .filter((term) =>
          [term.termRu, term.termEn, term.termUz].some((name) =>
            name.toLowerCase().includes(needle),
          ),
        )
        .slice(0, MAX_MATCHES)
    : [];

  const nameOf = (id: number) => {
    const term = all.find((item) => item.id === id);
    return term ? termName(term, lang) : `#${id}`;
  };

  return (
    <div className="picker">
      {value.length === 0 && <p className="hint">{t('related.none')}</p>}
      <ul className="picker__chosen">
        {value.map((relation) => (
          <li key={relation.termId} className="picker__item">
            <span className="picker__name">{nameOf(relation.termId)}</span>
            <select
              className="input"
              aria-label={t('related.type')}
              value={relation.type}
              onChange={(e) =>
                onChange(
                  value.map((r) =>
                    r.termId === relation.termId
                      ? { ...r, type: e.target.value as RelationType }
                      : r,
                  ),
                )
              }
            >
              {RELATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`relationOne.${type}`)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="button"
              onClick={() => onChange(value.filter((r) => r.termId !== relation.termId))}
            >
              {t('action.remove')}
            </button>
          </li>
        ))}
      </ul>

      <label className="field__label" htmlFor="related-search">
        {t('related.find')}
      </label>
      <input
        id="related-search"
        type="search"
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
      />
      <ul className="picker__matches">
        {matches.map((term) => (
          <li key={term.id}>
            <button
              type="button"
              className="button"
              onClick={() => {
                onChange([...value, { termId: term.id, type: 'SEE_ALSO' }]);
                setText('');
              }}
            >
              {t('action.add')}: {termName(term, lang)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
