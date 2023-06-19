import { fetchTableDataComposablesMap } from "@/constants";

import type { ParamsForPagingFetch } from "./use-api-types";

export const useFetchTableData = async (
  params: ParamsForPagingFetch,
  path?: string
) => {
  path = path ?? useRoute().path;
  const {
    fetchComposable,
    queryMethod
  } = fetchTableDataComposablesMap[path];
  const {
    data,
    refresh: fetchDataMethod
  } = await fetchComposable(params);

  return {
    data,
    fetchDataMethod,
    queryTableData: queryMethod
  };
};