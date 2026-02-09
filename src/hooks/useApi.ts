// =====================================================
// src/hooks/useApi.ts - Custom Hook for API Calls
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import type { RequestStatus } from '@/types';
import type { UseApiOptions, UseApiReturn } from '@/types/users';

export function useApi<T>(
  apiFunc: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData = null, immediate = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        setStatus('loading');

        const result = await apiFunc(...args);
        
        setData(result);
        setStatus('success');
        onSuccess?.(result);
        
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        setStatus('error');
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setStatus('idle');
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, status, execute, reset };
}
