import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const MULTI_KEYS = ["authorIds", "categoryIds", "tagIds"];
const DEFAULT_SORT = "publishedDate,desc";

function parseMultiParam(searchParams, key) {
  const raw = searchParams.get(key);
  return raw ? raw.split(",").filter(Boolean) : [];
}

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("q") || "",
      authorIds: parseMultiParam(searchParams, "authorIds"),
      categoryIds: parseMultiParam(searchParams, "categoryIds"),
      tagIds: parseMultiParam(searchParams, "tagIds"),
      publisherId: searchParams.get("publisherId") || "",
      sort: searchParams.get("sort") || DEFAULT_SORT,
      page: Number(searchParams.get("page") || 0),
    }),
    [searchParams.toString()],
  );

  const updateParams = (mutate) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      mutate(next);
      return next;
    });
  };

  const setKeyword = (value) =>
    updateParams((next) => {
      console.log("Setting keyword filter to:", value);
      value ? next.set("q", value) : next.delete("q");
      next.delete("page");
    });

  const setMultiParam = (key, ids) =>
    updateParams((next) => {
      ids.length > 0 ? next.set(key, ids.join(",")) : next.delete(key);
      next.delete("page");
    });

  const removeFromMultiParam = (key, id) =>
    setMultiParam(
      key,
      filters[key].filter((sid) => String(sid) !== String(id)),
    );

  const setSingleParam = (key, value) =>
    updateParams((next) => {
      value ? next.set(key, value) : next.delete(key);
      next.delete("page");
    });

  const setPage = (page) =>
    updateParams((next) => next.set("page", String(page)));

  const clearAllFilters = () =>
    updateParams((next) => {
      [...MULTI_KEYS, "publisherId", "sort", "page"].forEach((key) =>
        next.delete(key),
      );
    });

  const clearMultiFilters = () =>
    updateParams((next) => {
      [...MULTI_KEYS, "page"].forEach((key) => next.delete(key));
    });

  return {
    filters,
    setKeyword,
    setMultiParam,
    removeFromMultiParam,
    setSingleParam,
    setPage,
    clearAllFilters,
    clearMultiFilters,
  };
}
