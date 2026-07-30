import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Low-level hook: the ONLY place that touches URLSearchParams directly.
 * It knows nothing about "keyword", "status", "authorIds" etc. — callers
 * decide the keys and meaning.
 */
export function useUrlSyncedParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceTimers = useRef({});

  const getParam = useCallback(
    (key, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const getAllParams = useCallback(
    (key) => searchParams.getAll(key),
    [searchParams],
  );

  // Applies `mutate` to a fresh copy of the current params.
  const updateParams = useCallback(
    (mutate, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams);
      mutate(next);
      if (resetPage) next.set("page", "0");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setParam = useCallback(
    (key, value, opts) =>
      updateParams((params) => {
        if (value === "" || value == null) params.delete(key);
        else params.set(key, value);
      }, opts),
    [updateParams],
  );

  const setMultiParam = useCallback(
    (key, values, opts) =>
      updateParams((params) => {
        params.delete(key);
        values.forEach((v) => params.append(key, v));
      }, opts),
    [updateParams],
  );

  const addToMultiParam = useCallback(
    (key, value) => {
      const current = searchParams.getAll(key);
      if (current.includes(value)) return;
      setMultiParam(key, [...current, value]);
    },
    [searchParams, setMultiParam],
  );

  const removeFromMultiParam = useCallback(
    (key, value) => {
      const current = searchParams.getAll(key);
      setMultiParam(key, current.filter((v) => v !== value));
    },
    [searchParams, setMultiParam],
  );

  // Debounced text param (search keyword): reflects immediately for a
  // responsive input, commits to URL (and resets page) after `delay`.
  const setParamDebounced = useCallback(
    (key, value, delay = 400) => {
      updateParams(
        (params) => {
          if (value) params.set(key, value);
          else params.delete(key);
        },
        { resetPage: false },
      );

      if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
      debounceTimers.current[key] = setTimeout(() => {
        setParam(key, value);
      }, delay);
    },
    [updateParams, setParam],
  );

  const setPage = useCallback(
    (page) => setParam("page", String(page), { resetPage: false }),
    [setParam],
  );

  const clearParams = useCallback(
    (keys) => updateParams((params) => keys.forEach((k) => params.delete(k))),
    [updateParams],
  );

  return {
    searchParams,
    getParam,
    getAllParams,
    setParam,
    setMultiParam,
    addToMultiParam,
    removeFromMultiParam,
    setParamDebounced,
    setPage,
    clearParams,
    updateParams, // escape hatch for compound updates (e.g. date range: 2 keys, 1 URL write)
  };
}