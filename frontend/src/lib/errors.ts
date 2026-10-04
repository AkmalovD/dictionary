import type { TFunction } from 'i18next';
import { ApiError } from '../api/client';

export function errorText(error: unknown, t: TFunction): string {
  const code = error instanceof ApiError ? error.code : 'UNKNOWN';
  return t(`errors.${code}`, { defaultValue: t('errors.UNKNOWN') });
}
