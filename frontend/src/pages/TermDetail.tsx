import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useDeleteTerm, useTerm } from '../api/hooks';
import { RELATION_TYPES } from '../api/types';
import type { Lang, TermDetail } from '../api/types';
import { LANGS } from '../i18n';
import { errorText } from '../lib/errors';
import { termName, topicName, useLang } from '../lib/names';

function textFor(term: TermDetail, lang: Lang) {
  return {
    ru: { name: term.termRu, definition: term.definitionRu, example: term.exampleRu },
    en: { name: term.termEn, definition: term.definitionEn, example: term.exampleEn },
    uz: { name: term.termUz, definition: term.definitionUz, example: term.exampleUz },
  }[lang];
}

export function TermDetailPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const id = Number(useParams().id);
  const location = useLocation();
  const navigate = useNavigate();
  const term = useTerm(id);
  const deleteTerm = useDeleteTerm();

  // Returns to the list with the search and filters the reader came from.
  const backTo = `/${(location.state as { from?: string } | null)?.from ?? ''}`;
  const back = (
    <Link to={backTo} className="back-link">
      {t('back')}
    </Link>
  );

  if (term.isPending) return <p className="status">{t('loading')}</p>;
  if (term.isError) {
    return (
      <>
        {back}
        <p className="status status--error">{t('notFound')}</p>
      </>
    );
  }

  const data = term.data;
  // The reader's own language comes first.
  const order = [lang, ...LANGS.filter((other) => other !== lang)];

  const remove = () => {
    if (!window.confirm(t('confirm.deleteTerm'))) return;
    deleteTerm.mutate(id, { onSuccess: () => navigate(backTo) });
  };

  return (
    <article className="term">
      {back}
      {data.topic && <p className="term__topic">{topicName(data.topic, lang)}</p>}
      <h1 className="term__title">{termName(data, lang)}</h1>

      {order.map((code) => {
        const text = textFor(data, code);
        return (
          <section key={code} className="term__lang" lang={code}>
            <h2 className="section-title" lang={lang}>
              {t(`lang.${code}`)}
            </h2>
            {text.name ? (
              <p className="term__name">{text.name}</p>
            ) : (
              <p className="hint" lang={lang}>
                {t('notFilled')}
              </p>
            )}
            {text.definition && <p className="term__definition">{text.definition}</p>}
            {text.example && (
              <p className="term__example">
                <span className="term__example-label" lang={lang}>
                  {t('field.example')}:
                </span>{' '}
                {text.example}
              </p>
            )}
          </section>
        );
      })}

      {data.related.length > 0 && (
        <section className="term__related">
          <h2 className="section-title">{t('related.title')}</h2>
          {RELATION_TYPES.map((type) => {
            const linked = data.related.filter((r) => r.type === type);
            if (linked.length === 0) return null;
            return (
              <div key={type} className="related-group">
                <h3 className="related-group__title">{t(`relation.${type}`)}</h3>
                <ul className="related-group__list">
                  {linked.map(({ term: other }) => (
                    <li key={other.id}>
                      <Link to={`/terms/${other.id}`} state={location.state}>
                        {termName(other, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {deleteTerm.isError && (
        <p className="status status--error" role="alert">
          {errorText(deleteTerm.error, t)}
        </p>
      )}
      <div className="actions">
        <Link to={`/terms/${id}/edit`} state={location.state} className="button button--primary">
          {t('action.edit')}
        </Link>
        <button
          type="button"
          className="button button--danger"
          onClick={remove}
          disabled={deleteTerm.isPending}
        >
          {t('action.delete')}
        </button>
      </div>
    </article>
  );
}
