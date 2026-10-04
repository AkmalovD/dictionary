import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useSaveTerm, useTerm, useTopics } from '../api/hooks';
import type { Lang, TermDetail, TermInput, TermText } from '../api/types';
import { RelatedPicker } from '../components/RelatedPicker';
import { LANGS } from '../i18n';
import { errorText } from '../lib/errors';
import { topicName, useLang } from '../lib/names';

const SUFFIX: Record<Lang, 'Ru' | 'En' | 'Uz'> = { ru: 'Ru', en: 'En', uz: 'Uz' };

const EMPTY: TermInput = {
  termRu: '', termEn: '', termUz: '',
  definitionRu: '', definitionEn: '', definitionUz: '',
  exampleRu: '', exampleEn: '', exampleUz: '',
  topicId: null,
  relations: [],
};

function toInput(term: TermDetail): TermInput {
  const input = { ...EMPTY };
  for (const key of Object.keys(EMPTY) as (keyof TermText)[]) {
    if (key in term && typeof term[key] === 'string') input[key] = term[key];
  }
  return {
    ...input,
    topicId: term.topicId,
    relations: term.related.map((r) => ({ termId: r.term.id, type: r.type })),
  };
}

export function TermFormPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id === undefined ? undefined : Number(params.id);
  const term = useTerm(id);

  if (id !== undefined && term.isPending) return <p className="status">{t('loading')}</p>;
  if (id !== undefined && term.isError) {
    return <p className="status status--error">{t('notFound')}</p>;
  }
  // Keyed so the fields start from the loaded term rather than a previous one.
  return <TermForm key={id ?? 'new'} id={id} initial={term.data ? toInput(term.data) : EMPTY} />;
}

function TermForm({ id, initial }: { id?: number; initial: TermInput }) {
  const { t } = useTranslation();
  const lang = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const topics = useTopics();
  const save = useSaveTerm(id);
  const [input, setInput] = useState(initial);
  const [nameMissing, setNameMissing] = useState(false);
  const [code, setCode] = useState<Lang>(lang);

  const set = <K extends keyof TermInput>(key: K, value: TermInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const cancelTo = id === undefined ? '/' : `/terms/${id}`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const missing = !input.termRu.trim() && !input.termEn.trim() && !input.termUz.trim();
    setNameMissing(missing);
    if (missing) return;
    save.mutate(input, {
      onSuccess: (saved) => navigate(`/terms/${saved.id}`, { state: location.state }),
    });
  };

  // The reader's own language comes first.
  const order = [lang, ...LANGS.filter((other) => other !== lang)];

  // One language is edited at a time; the switch above the fields picks it.
  const termKey = `term${SUFFIX[code]}` as const;
  const definitionKey = `definition${SUFFIX[code]}` as const;
  const exampleKey = `example${SUFFIX[code]}` as const;

  return (
    <form className="form" onSubmit={submit} noValidate>
      <h1 className="page-title">{t(id === undefined ? 'form.newTitle' : 'form.editTitle')}</h1>
      <p className="hint">{t('form.hint')}</p>

      <div className="switch switch--surface form__langs" role="group" aria-label={t('language')}>
        {order.map((option) => (
          <button
            key={option}
            type="button"
            className="switch__option"
            aria-pressed={code === option}
            onClick={() => setCode(option)}
          >
            {t(`lang.${option}`)}
          </button>
        ))}
      </div>
      <fieldset key={code} className="fieldset">
        <legend className="fieldset__legend">{t(`lang.${code}`)}</legend>
        <div className="field">
          <label className="field__label" htmlFor={termKey}>
            {t('field.term')}
          </label>
          <input
            id={termKey}
            className="input"
            lang={code}
            value={input[termKey]}
            onChange={(e) => set(termKey, e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={definitionKey}>
            {t('field.definition')}
          </label>
          <textarea
            id={definitionKey}
            className="input"
            lang={code}
            rows={4}
            value={input[definitionKey]}
            onChange={(e) => set(definitionKey, e.target.value)}
            maxLength={4000}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={exampleKey}>
            {t('field.example')}
          </label>
          <textarea
            id={exampleKey}
            className="input"
            lang={code}
            rows={2}
            value={input[exampleKey]}
            onChange={(e) => set(exampleKey, e.target.value)}
            maxLength={2000}
          />
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset__legend">{t('field.topic')}</legend>
        <select
          className="input"
          aria-label={t('field.topic')}
          value={input.topicId ?? ''}
          onChange={(e) => set('topicId', e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">{t('noTopic')}</option>
          {topics.data?.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topicName(topic, lang)}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset__legend">{t('related.title')}</legend>
        <RelatedPicker
          value={input.relations}
          onChange={(relations) => set('relations', relations)}
          excludeId={id}
        />
      </fieldset>

      {nameMissing && (
        <p className="status status--error" role="alert">
          {t('errors.TERM_NAME_REQUIRED')}
        </p>
      )}
      {save.isError && (
        <p className="status status--error" role="alert">
          {errorText(save.error, t)}
        </p>
      )}
      <div className="actions">
        <button type="submit" className="button button--primary" disabled={save.isPending}>
          {t('action.save')}
        </button>
        <Link to={cancelTo} state={location.state} className="button">
          {t('action.cancel')}
        </Link>
      </div>
    </form>
  );
}
