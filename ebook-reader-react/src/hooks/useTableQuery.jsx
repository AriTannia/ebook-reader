import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUrlSyncedParams } from "./useUrlSyncedParams";

function parseSort(searchParams) {
  return searchParams
    .getAll("sort")
    .map((s) => {
      const [field, dir] = s.split(",");
      return field ? { field, dir: dir === "desc" ? "desc" : "asc" } : null;
    })
    .filter(Boolean);
}

export function useTableQuery({
  fetchAction,
  selectPage,
  selectIsFetching,
  size = 10,
  initialSortField,
  initialSortDir = "asc",
  extraParams = {},
}) {
  const dispatch = useDispatch();
  const hasLoadedOnce = useRef(false);

  const {
    searchParams,
    getParam,
    getAllParams,
    setParamDebounced,
    setMultiParam,
    updateParams,
    setPage: setPageParam,
  } = useUrlSyncedParams();

  const page = useSelector(selectPage);
  const isFetching = useSelector(selectIsFetching);

  const searchInput = getParam("keyword");
  const pageIndex = Number(getParam("page", "0"));
  const statuses = getAllParams("status");
  const createdFrom = getParam("createdFrom");
  const createdTo = getParam("createdTo");

  const sortFromUrl = parseSort(searchParams);
  const sort =
    sortFromUrl.length > 0
      ? sortFromUrl
      : initialSortField
        ? [{ field: initialSortField, dir: initialSortDir }]
        : [];

  const setSearchInput = (value) => setParamDebounced("keyword", value);

  const toggleSort = (field) => {
    const current = parseSort(searchParams);
    const idx = current.findIndex((s) => s.field === field);
    const next =
      idx === -1
        ? [...current, { field, dir: "asc" }]
        : current.map((s, i) =>
            i === idx ? { ...s, dir: s.dir === "asc" ? "desc" : "asc" } : s,
          );
    setMultiParam(
      "sort",
      next.map((s) => `${s.field},${s.dir}`),
    );
  };

  // --- Status (multi-select, fixed enum options) ---
  const setStatusFilter = (values) => setMultiParam("status", values);
  const addStatus = (value) => setStatusFilter([...statuses, value]);
  const removeStatus = (value) =>
    setStatusFilter(statuses.filter((s) => s !== value));
  const clearStatus = () => setStatusFilter([]);

  // --- Date range ---
  const setDateRange = ({ createdFrom, createdTo }) =>
    updateParams((params) => {
      if (createdFrom) params.set("createdFrom", createdFrom);
      else params.delete("createdFrom");
      if (createdTo) params.set("createdTo", createdTo);
      else params.delete("createdTo");
    });
  const clearDateRange = () => setDateRange({ createdFrom: "", createdTo: "" });

  // --- Pagination ---
  const setPageIndex = (updater) => {
    const nextIndex =
      typeof updater === "function" ? updater(pageIndex) : updater;
    setPageParam(nextIndex);
  };
  const nextPage = () => {
    if (page && !page.last) setPageIndex((p) => p + 1);
  };
  const prevPage = () => {
    if (page && !page.first) setPageIndex((p) => Math.max(0, p - 1));
  };

  // --- Fetch when URL-derived state changes ---
  const keyword = getParam("keyword");
  const sortKey = sort.map((s) => `${s.field}:${s.dir}`).join("|");
  const statusKey = statuses.join("|");
  const dateKey = `${createdFrom}|${createdTo}`;

  const extraParamsKey = JSON.stringify(extraParams);

  useEffect(() => {
    const payload = {
      keyword,
      sort:
        sort.length > 0 ? sort.map((s) => `${s.field},${s.dir}`) : undefined,
      statuses: statuses.length > 0 ? statuses : undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      page: pageIndex,
      size,
      ...extraParams,
    };
    console.log("[useTableQuery] dispatching payload:", payload); // debug tạm
    dispatch(fetchAction(payload));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    fetchAction,
    keyword,
    sortKey,
    statusKey,
    dateKey,
    pageIndex,
    size,
    extraParamsKey,
  ]);
  
  useEffect(() => {
    if (page) hasLoadedOnce.current = true;
  }, [page]);

  return {
    searchInput,
    setSearchInput,
    sort,
    toggleSort,
    statuses,
    setStatusFilter,
    addStatus,
    removeStatus,
    clearStatus,
    createdFrom,
    createdTo,
    setDateRange,
    clearDateRange,
    page,
    rows: page?.content ?? [],
    nextPage,
    prevPage,
    isLoading: isFetching && !hasLoadedOnce.current,
    isFetching,
  };
}
