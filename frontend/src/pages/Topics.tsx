import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteTopic, useSaveTopic, useTopics } from '../api/hooks';
import type { Topic, TopicInput } from '../api/types';
import { errorText } from '../lib/errors';
import { topicName, useLang } from '../lib/names';

const EMPTY: TopicInput = { nameRu: '', nameEn: '', nameUz: '' };
const FIELDS = ['nameRu', 'nameEn', 'nameUz'] as const;

export function TopicsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const topics = useTopics();
  const deleteTopic = useDeleteTopic();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [failedId, setFailedId] = useState<number | null>(null);

  const remove = (topic: Topic) => {
    if (!window.confirm(t('confirm.deleteTopic'))) return;
    setFailedId(null);
    deleteTopic.mutate(topic.id, { onError: () => setFailedId(topic.id) });
  };

  return (
    <div className="form">
      <h1 className="page-title">{t('topics.title')}</h1>
      {topics.isPending && <p className="status">{t('loading')}</p>}
      {topics.isError && <p className="status status--error">{t('loadError')}</p>}

      <ul className="topic-list">
        {topics.data?.map((topic) => (
          <li key={topic.id} className="topic-list__item">
            {editingId === topic.id ? (
              <TopicForm
                id={topic.id}
                initial={topic}
                onDone={() => setEditingId(null)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div>
                  <p className="topic-list__name">{topicName(topic, lang)}</p>
                  <p className="hint">
                    {FIELDS.map((field) => topic[field])
                      .filter((name) => name !== topicName(topic, lang))
                      .join(' / ')}
                  </p>
                  <p className="hint">{t('topics.termCount', { count: topic.termCount })}</p>
                  {failedId === topic.id && deleteTopic.isError && (
                    <p className="status status--error" role="alert">
                      {errorText(deleteTopic.error, t)}
                    </p>
                  )}
                </div>
                <div className="actions">
                  <button type="button" className="button" onClick={() => setEditingId(topic.id)}>
                    {t('action.rename')}
                  </button>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() => remove(topic)}
                  >
                    {t('action.delete')}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <fieldset className="fieldset">
        <legend className="fieldset__legend">{t('topics.newTitle')}</legend>
        <TopicForm initial={EMPTY} />
      </fieldset>
    </div>
  );
}

interface TopicFormProps {
  id?: number;
  initial: TopicInput;
  onDone?: () => void;
  onCancel?: () => void;
}

function TopicForm({ id, initial, onDone, onCancel }: TopicFormProps) {
  const { t } = useTranslation();
  const save = useSaveTopic();
  const [input, setInput] = useState<TopicInput>({
    nameRu: initial.nameRu,
    nameEn: initial.nameEn,
    nameUz: initial.nameUz,
  });
  const [incomplete, setIncomplete] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const missing = FIELDS.some((field) => !input[field].trim());
    setIncomplete(missing);
    if (missing) return;
    save.mutate(
      { id, ...input },
      {
        onSuccess: () => {
          if (id === undefined) setInput(EMPTY);
          onDone?.();
        },
      },
    );
  };

  return (
    <form className="topic-form" onSubmit={submit} noValidate>
      {FIELDS.map((field) => {
        const inputId = `topic-${id ?? 'new'}-${field}`;
        return (
          <div key={field} className="field">
            <label className="field__label" htmlFor={inputId}>
              {t(`topics.${field}`)}
            </label>
            <input
              id={inputId}
              className="input"
              value={input[field]}
              onChange={(e) => setInput((prev) => ({ ...prev, [field]: e.target.value }))}
              maxLength={120}
            />
          </div>
        );
      })}
      {incomplete && (
        <p className="status status--error" role="alert">
          {t('errors.TOPIC_NAMES_REQUIRED')}
        </p>
      )}
      {save.isError && (
        <p className="status status--error" role="alert">
          {errorText(save.error, t)}
        </p>
      )}
      <div className="actions">
        <button type="submit" className="button button--primary" disabled={save.isPending}>
          {t(id === undefined ? 'action.add' : 'action.save')}
        </button>
        {onCancel && (
          <button type="button" className="button" onClick={onCancel}>
            {t('action.cancel')}
          </button>
        )}
      </div>
    </form>
  );
}
