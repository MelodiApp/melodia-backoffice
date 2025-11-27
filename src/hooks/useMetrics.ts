import { useCallback, useEffect, useMemo, useState } from 'react';
import apiClient from '../services/apiClient';

export type TimeSlice = 'hour' | 'day' | 'week' | 'month' | 'year';

type Params = {
  fromDate?: string;
  toDate?: string;
  timeSlice?: TimeSlice;
  limit?: number;
  offset?: number;
};

function buildQuery(params?: Params) {
  const q = new URLSearchParams();
  if (!params) return q.toString();
  if (params.fromDate) q.set('fromDate', params.fromDate);
  if (params.toDate) q.set('toDate', params.toDate);
  if (params.timeSlice) q.set('timeSlice', params.timeSlice);
  // Also include alternative param names for compatibility with different backends
  if (params.fromDate) q.set('from_date', params.fromDate);
  if (params.toDate) q.set('to_date', params.toDate);
  if (params.timeSlice) {
    q.set('time_slice', params.timeSlice);
    q.set('timeslice', params.timeSlice);
  }
  if (params.limit !== undefined) q.set('limit', String(params.limit));
  if (params.offset !== undefined) q.set('offset', String(params.offset));
  return q.toString();
}

async function apiGet<T>(path: string) {
  const res = await apiClient.get<T>(path);
  return res.data;
}

export function useSongPlaysCount(songId?: string | null, params?: Params) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!songId) return;
    try {
      setLoading(true);
      setError(null);
      const query = buildQuery(params);
      const path = `/admin/metrics/song-plays/song/${encodeURIComponent(songId)}/count${query ? `?${query}` : ''}`;
      if (import.meta.env.DEV) console.debug(`[useSongPlaysCount] GET ${path}`);
      const result = await apiGet<any>(path);
      if (import.meta.env.DEV) console.debug('[useSongPlaysCount] result', result);
      setData(result);
    } catch (err: any) {
      setError(err?.message || String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [songId, params?.fromDate, params?.toDate, params?.timeSlice, params?.limit, params?.offset]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch } as const;
}

export function useCollectionPlaysCount(collectionId?: string | null, params?: Params) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!collectionId) return;
    try {
      setLoading(true);
      setError(null);
      const query = buildQuery(params);
      const path = `/admin/metrics/song-plays/collection/${encodeURIComponent(collectionId)}/count${query ? `?${query}` : ''}`;
      if (import.meta.env.DEV) console.debug(`[useCollectionPlaysCount] GET ${path}`);
      const result = await apiGet<any>(path);
      if (import.meta.env.DEV) console.debug('[useCollectionPlaysCount] result', result);
      setData(result);
    } catch (err: any) {
      setError(err?.message || String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [collectionId, params?.fromDate, params?.toDate, params?.timeSlice, params?.limit, params?.offset]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch } as const;
}

export function useSongLikesCount(songId?: string | null, params?: Params) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!songId) return;
    try {
      setLoading(true);
      setError(null);
      const query = buildQuery(params);
      const path = `/admin/libraries/likes/song/${encodeURIComponent(songId)}/count${query ? `?${query}` : ''}`;
      if (import.meta.env.DEV) console.debug(`[useSongLikesCount] GET ${path}`);
      const result = await apiGet<any>(path);
      if (import.meta.env.DEV) console.debug('[useSongLikesCount] result', result);
      setData(result);
    } catch (err: any) {
      setError(err?.message || String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [songId, params?.fromDate, params?.toDate, params?.timeSlice, params?.limit, params?.offset]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch } as const;
}

export function useCollectionLikesCount(collectionId?: string | null, params?: Params) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!collectionId) return;
    try {
      setLoading(true);
      setError(null);
      const query = buildQuery(params);
      const path = `/admin/libraries/likes/collection/${encodeURIComponent(collectionId)}/count${query ? `?${query}` : ''}`;
      if (import.meta.env.DEV) console.debug(`[useCollectionLikesCount] GET ${path}`);
      const result = await apiGet<any>(path);
      if (import.meta.env.DEV) console.debug('[useCollectionLikesCount] result', result);
      setData(result);
    } catch (err: any) {
      setError(err?.message || String(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [collectionId, params?.fromDate, params?.toDate, params?.timeSlice, params?.limit, params?.offset]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch } as const;
}
