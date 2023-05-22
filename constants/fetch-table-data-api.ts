import type { 
  FetchTableDataComposable,
  QueryTableDataMethod
 } from "@/composables/use-api-types";

export const fetchTableDataComposablesMap: Record<
  string,
  {
    fetchComposable: FetchTableDataComposable,
    queryMethod: QueryTableDataMethod
  }
> = {
  '/member': {
    fetchComposable: useGetMembers,
    queryMethod: useQueryMemebers
  },
  '/log': {
    fetchComposable: useGetLogs,
    queryMethod: useQueryLogs
  },
  '/administrator': {
    fetchComposable: useGetUsers,
    queryMethod: useQueryUsers
  },
  '/department': {
    fetchComposable: useGetDepartments,
    queryMethod: useQueryDepartments
  },
  '/honor': {
    fetchComposable: useGetHonors,
    queryMethod: useQueryHonors
  },
  '/honorProject': {
    fetchComposable: useGetHonorProjects,
    queryMethod: useQueryHonorProjects
  },
  '/honorAudit/undealt': {
    fetchComposable: useGetUndealtApplications,
    queryMethod: useQueryUndealtApplications
  },
  '/honorAudit/dealt': {
    fetchComposable: useGetDealtApplications,
    queryMethod: useQueryDealtApplications
  },
  '/honorApply/undealt': {
    fetchComposable: useGetUndealtApplications,
    queryMethod: useQueryUndealtApplications
  },
  '/honorApply/dealt': {
    fetchComposable: useGetDealtApplications,
    queryMethod: useQueryDealtApplications
  },
  '/serviceChange': {
    fetchComposable: useGetMembers,
    queryMethod: useQueryMemebers
  },
};