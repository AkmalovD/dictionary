// The server answers failures with a short code (for example TOPIC_IN_USE)
// that the interface translates; anything else is shown as a generic error.
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new ApiError(message ?? 'UNKNOWN', res.status);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
