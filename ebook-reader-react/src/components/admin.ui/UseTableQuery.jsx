import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useTableQuery({
  fetchAction,
  selectPage,
  selectIsFetching,
  size = 10,
  initialSortField,
  initialSortDir = "asc",
}) { 
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [sort, setSort] = useState(
    initialSortField ? { field: initialSortField, dir: initialSortDir } : null,
  );

  const [pageIndex, setPageIndex] = useState(0);
  const hasLoadedOnce = useRef(false);

  const page = useSelector(selectPage);
  const isFetching = useSelector(selectIsFetching);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const sortParam = sort ? `${sort.field},${sort.dir}` : undefined;

    dispatch(
      fetchAction({
        keyword,
        sort: sortParam,
        page: pageIndex,
        size,
      }),
    );
  }, [dispatch, fetchAction, keyword, sort, pageIndex, size]);

  useEffect(() => {
    if (page) {
      hasLoadedOnce.current = true;
    }
  }, [page]);

  const toggleSort = (field) => {
    setPageIndex(0);
    setSort((prev) => {
      if (prev?.field !== field) return { field, dir: "asc" };
      return { field, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const nextPage = () => {
    if (page && !page.last) setPageIndex((p) => p + 1);
  };

  const prevPage = () => {
    if (page && !page.first) setPageIndex((p) => Math.max(0, p - 1));
  };

  return {
    searchInput,
    setSearchInput,
    sort,
    toggleSort,
    page,
    rows: page?.content ?? [],
    nextPage,
    prevPage,
    isLoading: isFetching && !hasLoadedOnce.current,
    isFetching,
  };
}
