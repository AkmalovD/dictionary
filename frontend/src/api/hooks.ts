import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { api } from './client';
import type {
  Term,
  TermDetail,
  TermFilters,
  TermInput,
  TermList,
  Topic,
  TopicInput,
} from './types';

export function useTopics() {
  return useQuery({ queryKey: ['topics'], queryFn: () => api<Topic[]>('/topics') });
}

export function useTerms(filters: TermFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  return useQuery({
    queryKey: ['terms', filters],
    queryFn: () => api<TermList>(`/terms?${params}`),
    // Keeps the current list on screen while the next search loads.
    placeholderData: keepPreviousData,
  });
}

export function useTerm(id: number | undefined) {
  return useQuery({
    queryKey: ['terms', id],
    queryFn: () => api<TermDetail>(`/terms/${id}`),
    enabled: id !== undefined,
    retry: false,
  });
}

// Terms and topics show each other's data (counts, names), so any change
// refreshes both.
function useInvalidate() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['terms'] }),
      queryClient.invalidateQueries({ queryKey: ['topics'] }),
    ]);
}

export function useSaveTerm(id: number | undefined) {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (input: TermInput) =>
      api<Term>(id === undefined ? '/terms' : `/terms/${id}`, {
        method: id === undefined ? 'POST' : 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess,
  });
}

export function useDeleteTerm() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (id: number) => api<void>(`/terms/${id}`, { method: 'DELETE' }),
    onSuccess,
  });
}

export function useSaveTopic() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: ({ id, ...input }: TopicInput & { id?: number }) =>
      api<Topic>(id === undefined ? '/topics' : `/topics/${id}`, {
        method: id === undefined ? 'POST' : 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess,
  });
}

export function useDeleteTopic() {
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (id: number) => api<void>(`/topics/${id}`, { method: 'DELETE' }),
    onSuccess,
  });
}
