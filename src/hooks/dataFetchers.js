import useSWR from 'swr';

// fetcher function required by swr
const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useEvents() {
  const { data, error, isLoading } = useSWR('/api/events', fetcher);

  return {
    events: data,
    isLoading,
    error,
  };
}

export function useLessons() {
  const { data, error, isLoading } = useSWR('/api/lessons', fetcher);

  return {
    lessons: data,
    isLoading,
    error,
  };
}

export function useMembers() {
  const { data, error, isLoading } = useSWR('/api/members', fetcher);

  return {
    members: data,
    isLoading,
    error,
  };
}
