import { useMemo } from "react";
import { useUrlSyncedParams } from "./useUrlSyncedParams";

/**
 * Filter hook for the public SearchStore page.
 */
export function useSearchFilters() {
  const {
    searchParams,
    getParam,
    getAllParams,
    setParamDebounced,
    setParam,
    setMultiParam,
    removeFromMultiParam,
    setPage: setPageParam,
    clearParams,
  } = useUrlSyncedParams();

  const filters = useMemo(
    () => ({
      keyword: getParam("keyword"),
      page: Number(getParam("page", "0")),
      sort: getParam("sort"),
      authorIds: getAllParams("authorIds"),
      categoryIds: getAllParams("categoryIds"),
      tagIds: getAllParams("tagIds"),
      publisherId: getParam("publisherId"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()],
  );

  return {
    filters,
    setKeyword: (value) => setParamDebounced("keyword", value),
    setMultiParam,
    removeFromMultiParam,
    setSingleParam: setParam,
    setPage: (page) => setPageParam(page),
    clearAllFilters: () =>
      clearParams(["keyword", "sort", "authorIds", "categoryIds", "tagIds", "publisherId"]),
    clearMultiFilters: () => clearParams(["authorIds", "categoryIds", "tagIds"]),
  };
}