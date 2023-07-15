import type { HttpResponse } from '@/utils';
import type { 
  ParamsForPagingFetch,
  PagingTableData,
  COSBucketSecret,
  TreeNodeData,
  DepartmentDetail,
  Honor,
  HonorDetail,
  HonorProject,
  HonorApplication,
  MemberProfile,
  JobHitory,
  Event,
  Contest,
  Training,
  Typical,
  AwardedMemberDetail,
  LogDetail,
  TypicalHonor,
  AwardedMemberDisplay,
  AwardedMemberDisplayDetail,
  Video
} from './use-api-types';
import type { SearchParameters } from 'ofetch';
import { AnnualAssessment } from './use-api-types';

export const useLogin = (
  params: {
    username: string;
    password: string;
    rememberMe: boolean;
  }
) => nativeFetch('/user/login', 'post', params) as Promise<boolean>;

export const useLogout = () =>
  nativeFetch('/user/logout', 'post') as Promise<boolean>;

export const useModifyPassword = (params: { oldPasswd: string; newPasswd: string }) => 
  nativeFetch('/user/modifyPasswd', 'post', params) as Promise<boolean>;

export const useGetAutoCompleteItems = (url: string, params: SearchParameters) => 
  nativeFetch(url, 'get', params) as Promise<string[]>;

export const useGetDepartmentTree = () =>
  get('/selection/queryListDepartmentTree') as HttpResponse<Record<string, any>[]>;

export const useGetEmployeeNames = () =>
  get('/selection/queryListEmployeeName') as HttpResponse<any[]>;

export const useGetSelectOptionsByDict = (dictType: string) =>
  get('/selection/queryListDictTreeByType', { dictType }) as HttpResponse<Record<string, any>[]>

export const useGetSelectOptions = (selectTarget: string) =>
  selectTarget === 'DepartmentTree'
  ? useGetDepartmentTree()
  : selectTarget === 'EmployeeName'
    ? useGetEmployeeNames()
    : useGetSelectOptionsByDict(selectTarget);

export const useGetCOSSecret = () =>
  get('/cos/querySecret', undefined, undefined, { immediate: false }) as HttpResponse<COSBucketSecret>;

export const useGetMembers = (params: ParamsForPagingFetch) =>
  get('/employee/queryPageEmployeeList', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useQueryMemebers = (params: Record<string, any>) =>
  nativeFetch('/employee/queryListEmployByCondition', 'post', params) as Promise<any[]>;

export const useDeleteMember = (params: { employeeId: number }) =>
  del('/employee/deleteEmployee', params) as Promise<null>;

export const useAddMember = (pararms: Record<string, any>) =>
  nativeFetch('/employee/addEmployee', 'post', pararms) as Promise<null>;

export const useModifyMember = (params: Record<string, any> & { id: number }) =>
  put('/employee/modifyEmployee', params) as Promise<null>;

export const useGetDepartments = (params: ParamsForPagingFetch) =>
  get('/department/queryPageDepartment', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useQueryDepartments = (params: Record<string, any>) =>
  nativeFetch('/department/queryListDepartmentByCondition', 'get', params) as Promise<any[]>;

export const useGetDepartmentDetail = (params: { departmentId: number }) =>
  get('/department/queryDepartmentDetail', params) as HttpResponse<DepartmentDetail>;

export const useDeleteDepartment = (params: { departmentId: number }) =>
  del('/department/deleteDepartment', params) as Promise<null>;

export const useAddDepartment = (params: Record<string, any>) =>
  nativeFetch('/department/addDepartment', 'post', params) as Promise<null>;

export const useModifyDepartment = (params: Record<string, any> & { id: number }) =>
  put('/department/modifyDepartment', params) as Promise<null>;

export const useGetLogs = (params: ParamsForPagingFetch) =>
  get('/operaLog/queryPageOperaLog', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useQueryLogs = (params: Record<string, any>) =>
  nativeFetch('/operaLog/queryListOperaLogByCondition', 'post', params) as Promise<any[]>;

export const useGetUsers = (params: ParamsForPagingFetch) =>
  get('/user/queryPageUser', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useQueryUsers = (params: Record<string, any>) =>
  nativeFetch('/user/queryListUserByCondition', 'post', params) as Promise<any[]>;

export const useAddUser = (parmas: {
  username: string,
  departmentName: string
}) =>
  nativeFetch('/user/addUser', 'post', parmas) as Promise<null>;

export const useDeleteUser = (params: { userId: number }) =>
  del('/user/deleteUser', params) as Promise<null>;

export const useResetUserPwd = (params: { userId: number }) =>
  put('/user/resetPasswd', params) as Promise<string>;

export const useGetDictionaries = () =>
  get('/dict/queryListDictTree') as HttpResponse<TreeNodeData[]>;

export const useAddDictionary = (params: {
  parentId: number;
  dictName: string
}) => 
  nativeFetch('/dict/addDict', 'post', params) as Promise<number>;

export const useDeleteDictionary = (params: { dictId: number }) =>
  del('/dict/deleteDict', params) as Promise<null>;

export const useModifyDictionary = (params: {
  dictId: number;
  dictNewName: string
}) => 
  put('/dict/modifyDict', params) as Promise<null>;

export const useGetHonors = (params: ParamsForPagingFetch) =>
  get('/honor/queryPageHonor', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useQueryHonors = (params: Record<string, any>) =>
  nativeFetch('/honor/queryListHonorByCondition', 'post', params) as Promise<Honor[]>;

export const useGetHonorDetail = (params: { honorId: number }) =>
  get('/honor/queryHonorDetailById', params) as HttpResponse<HonorDetail>

export const useDeleteHonor = (params: { honorId: number }) =>
  del('/honor/deleteHonor', params) as Promise<null>;

export const useAddHonor = (params: Record<string, any>) =>
  nativeFetch('/honor/addHonor', 'post', params) as Promise<null>;

export const useModifyHonor = (params: Record<string, any> & { id: number }) =>
  put('/honor/modifyHonor', params) as Promise<null>;

export const useGetHonorProjects = (params: ParamsForPagingFetch) => 
  get('/honorProject/queryPageHonorProject', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useQueryHonorProjects = (params: Record<string, any>) =>
  nativeFetch('/honorProject/queryListHonorProject', 'post', params) as Promise<HonorProject[]>;

export const useDeleteHonorProject = (params: { honorProjectId: number }) =>
  del('/honorProject/deleteHonorProject', params) as Promise<null>;

export const useAddHonorProject = (params: Record<string, any>) =>
  nativeFetch('/honorProject/addHonorProject', 'post', params) as Promise<null>;

export const useModifyHonorProject = (params: Record<string, any> & { id: number }) =>
  put('/honorProject/modifyHonorProject', params) as Promise<null>;

export const useGetApplications = (params: ParamsForPagingFetch) =>
  get('/honorAuditApply/queryPageHonorAuditApply', params, undefined, { immediate: false }) as HttpResponse<PagingTableData>;

export const useGetReturnedApplications = (params: ParamsForPagingFetch) =>
  get('/honorAuditApply/queryPageHonorAuditApplyDone', params) as HttpResponse<PagingTableData>;

export const useQueryApplications = (params: Record<string, any>) =>
  nativeFetch('/honorAuditApply/queryListHonorAuditApply', 'post', params) as Promise<HonorApplication[]>;

export const useQueryReturnedApplications = (params: Record<string, any>) =>
  nativeFetch('/honorAuditApply/queryPageHonorAuditApplyDone', 'post', params) as Promise<HonorApplication[]>;

export const useGetApplicationDetail = (params: { honorApplyId: number }) =>
  get('/honorAuditApply/queryHonorDetail', params) as HttpResponse<HonorDetail>;

export const useReturnApplication = (params: { honorApplyId: number }) =>
  put('/honorAuditApply/auditHonorApply', params) as Promise<null>;

export const useRecoverApplication = (params: { honorApplyId: number }) =>
  put('/honorAuditApply/recoverHonorApply', params) as Promise<null>;

export const useCancelApplication = (params: { honorApplyId: number }) =>
  del('/honorAuditApply/deleteHonorApply', params) as Promise<null>;

export const useSubmitApplication = (params: Record<string, any>) =>
  nativeFetch('/honorAuditApply/applyHonor', 'post', params) as Promise<null>;

export const useSwitchService = (params: Record<string, any> & { id: number }) =>
  put('/employeeChange/changeDepartment', params) as Promise<null>;

export const useGetHonorCount = () =>
  get('/homeOverview/countHonor') as HttpResponse<number>;

export const useGetMemberCount = () =>
  get('/homeOverview/countEmployee') as HttpResponse<number>;

export const useGetDepartmentCount = () =>
  get('/homeOverview/countDepartment') as HttpResponse<number>;

export const useGetLoginCount = () =>
  get('/homeOverview/countLogin') as HttpResponse<number>;

export const useGetDeparmentHonorsCount = () =>
  get('/homeOverview/countDepartmentHonor') as HttpResponse<Record<string, number>>;

export const useGetLastDecadeHonorData = () =>
  get('/homeOverview/countHonorTrendByYear') as HttpResponse<Record<string, number>>;

export const useGetHonorLevelsData = () =>
  get('/homeOverview/countHonorByLevel') as HttpResponse<Record<string, number>>;

export const useGetMemberProfile = (params: { employeeId: number }) =>
  get('/employee/queryEmployeeDetailById', params) as HttpResponse<MemberProfile>;

export const useGetJobHistory = (params: { employeeId: number }) =>
  get('/employeeWork/queryListEmployeeWork', params) as HttpResponse<JobHitory[]>;

export const useDeleteJobHistory = (params: { id: number }) =>
  del('/employeeWork/deleteEmployeeWork', params) as Promise<null>;

export const useAddJobHistory = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeWork/addEmployeeWork', 'post', params) as Promise<null>;

export const useModifyJobHistory = (params: Record<string, any> & { id: number }) =>
  put('/employeeWork/modifyEmployeeWork', params) as Promise<null>;

export const useGetAssessments = (params: { employeeId: number }) =>
  get('/employeeAnnualAssessment/queryListEmployeeAnnualAssessment', params) as HttpResponse<AnnualAssessment[]>;

export const useDeleteAssessment = (params: { id: number }) =>
  del('/employeeAnnualAssessment/deleteEmployeeAnnualAssessment', params) as Promise<null>;

export const useAddAssessment = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeAnnualAssessment/addEmployeeAnnualAssessment', 'post', params) as Promise<null>;

export const useModifyAssessment = (params: Record<string, any> & { id: number }) =>
  put('/employeeAnnualAssessment/modifyEmployeeAnnualAssessment', params) as Promise<null>;

export const useGetEvents= (params: { employeeId: number }) =>
  get('/employeeEvent/queryListEmployeeEvent', params) as HttpResponse<Event[]>;

export const useDeleteEvent = (params: { id: number }) =>
  del('/employeeEvent/deleteEmployeeEvent', params) as Promise<null>;

export const useAddEvent = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeEvent/addEmployeeEvent', 'post', params) as Promise<null>;

export const useModifyEvent = (params: Record<string, any> & { id: number }) =>
  put('/employeeEvent/modifyEmployeeEvent', params) as Promise<null>;

export const useGetContests = (params: { employeeId: number }) =>
  get('/employeeCompetition/queryListEmployeeCompetition', params) as HttpResponse<Contest[]>;

export const useDeleteContest = (params: { id: number }) =>
  del('/employeeCompetition/deleteEmployeeCompetition', params) as Promise<null>;

export const useAddContest = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeCompetition/addEmployeeCompetition', 'post', params) as Promise<null>;

export const useModifyContest = (params: Record<string, any> & { id: number }) =>
  put('/employeeCompetition/modifyEmployeeCompetition', params) as Promise<null>;

export const useGetTraining = (params: { employeeId: number }) =>
  get('/employeeTrain/queryListEmployeeTrain', params) as HttpResponse<Training[]>;

export const useDeleteTraining = (params: { id: number }) =>
  del('/employeeTrain/deleteEmployeeTrain', params) as Promise<null>;

export const useAddTraining = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeTrain/addEmployeeTrain', 'post', params) as Promise<null>;

export const useModifyTraining = (params: Record<string, any> & { id: number }) =>
  put('/employeeTrain/modifyEmployeeTrain', params) as Promise<null>;

export const useGetTypical = (params: { employeeId: number }) =>
  get('/public/listTypicalRoute', params) as HttpResponse<Typical[]>;

export const useDeleteTypical = (params: { id: number }) =>
  del('/deleteTypicalRoute', params) as Promise<null>;

export const useAddTypical = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/addTypicalRoute', 'post', params) as Promise<null>;

export const useModifyTypical = (params: Record<string, any> & { id: number }) =>
  put('/modifyTypicalRoute', params) as Promise<null>;

export const useGetHonorRoute = (params: { employeeId: number }) =>
  get('/employeeHonor/queryListEmployeeHonor', params) as HttpResponse<HonorDetail[]>;

export const useGetMemberHonorCount = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeHonor', params) as HttpResponse<number>;

export const useGetMemberContestCount = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeCompetition', params) as HttpResponse<number>;

export const useGetMemberContributionCount = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeContribute', params) as HttpResponse<number>;

export const useGetMemberTrainingCount = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeTrain', params) as HttpResponse<number>;

export const useGetMemberHonorTrendData = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeHonorTrendByYear', params) as HttpResponse<Record<string, number>>;

export const useGetMemberHonorTypeData = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeHonorByHonorType', params) as HttpResponse<Record<string, number>>;

export const useGetMemberHonorLevelData = (params: { employeeId: number }) =>
  get('/employeeOverview/countEmployeeHonorByHonorLevel', params) as HttpResponse<Record<string, number>>;

export const useGetDepartmentMemberCount = (params: { departmentId: number }) =>
  get('/homeOverview/countEmployeeByDepartmentId', params) as HttpResponse<number>;

export const useGetDepartmentHonorCount = (params: { departmentId: number }) =>
  get('/homeOverview/countHonorByDepartmentId', params) as HttpResponse<number>;

export const useGetDepartmentSubCount = (params: { departmentId: number }) =>
  get('/homeOverview/countDepartmentByDepartmentId', params) as HttpResponse<number>;

export const useGetDepartmentHonorTrendData = (params: { departmentId: number }) =>
  get('/homeOverview/countDepartmentHonorTrendByYear', params) as HttpResponse<Record<string, number>>;

export const useGetDepartmentSubHonorData = (params: { departmentId: number }) =>
  get('/homeOverview/countDepartmentHonorByDepartmentId', params) as HttpResponse<Record<string, number>>;

export const useGetDepartmentHonorLevelData = (params: { departmentId: number }) =>
  get('/homeOverview/countDepartmentHonorByLevel', params) as HttpResponse<Record<string, number>>;

export const useGetPersonalDeed = (params: { employeeId: number }) =>
  get('/employeeDeed/queryEmployeeDeed', params) as HttpResponse<string>;

export const useModifyPersonalDeed = (params: { employeeId: number; content: string }) =>
  nativeFetch('/employeeDeed/editEmployeeDeed', 'post', params) as Promise<null>;

export const useDeletePersonalDeed = (params: { employeeId: number }) =>
  del('/employeeDeed/deleteEmployeeDeed', params) as Promise<null>;

export const useGetMemberHonors = (params: { employeeId: number }) =>
  get('/selection/queryListEmployeeTypicalHonor', params) as HttpResponse<Record<string, any>[]>;

export const useSetMemberAwarded = (params: { employeeId: number }) =>
  nativeFetch('/typicalCharacter/confirm', 'post', params) as Promise<null>;

export const useGetLevel0AwardedMembers = (parmas: ParamsForPagingFetch) =>
  post('/typicalCharacter/page', ref({ typicalLevel: 0, ...unref(parmas) }), undefined, { key: 'level-0' }) as HttpResponse<PagingTableData>;

export const useGetLevel1AwardedMembers = (parmas: ParamsForPagingFetch) =>
  post('/typicalCharacter/page', ref({ typicalLevel: 1, ...unref(parmas) }), undefined, { key: 'level-1' }) as HttpResponse<PagingTableData>;

export const useGetLevel2AwardedMembers = (parmas: ParamsForPagingFetch) =>
  post('/typicalCharacter/page', ref({ typicalLevel: 2, ...unref(parmas) }), undefined, { key: 'level-2' }) as HttpResponse<PagingTableData>;

export const useQueryAwardedMember = (params: Record<string, any>) =>
  nativeFetch('/typicalCharacter/listByCondition', 'post', params) as Promise<AwardedMemberDetail[]>;

export const usePromoteAwardedMemberLevel = (params: { employeeId: number }) =>
  put('/typicalCharacter/promote', params) as Promise<null>;

export const useDemoteAwardedMemberLevel = (params: { employeeId: number }) =>
  del('/typicalCharacter/cancel', params) as Promise<null>;

export const useGetAwardedMemberDisplay = (params: { employeeId: number }) =>
  get('/queryTypicalDisplay', params) as HttpResponse<AwardedMemberDisplay>;

export const useModifyAwardedMemberDisplay = (params: {
  employeeId: number;
  displayImgUrl: string;
  displayContent: string;
}) =>
  put('/editTypicalDisplay', params) as Promise<null>;

export const useGetLogDetail = (params: { logId: number }) =>
  nativeFetch('/operaLog/queryOperaLogDetailById', 'get', params) as Promise<LogDetail>;

export const useGetLifePhotos = () =>
  get('/portal/listLifePhoto') as HttpResponse<string[]>;

export const useGetAwardedMembersAll = () =>
  get('/portal/listTypicalCharacter') as HttpResponse<(AwardedMemberDetail & { isTypicalDeed: boolean })[]>

export const useGetTypicalHonors = () =>
  get('/portal/listTypicalHonor') as HttpResponse<TypicalHonor[]>;

export const useGetDepartmentPhotos = () => 
  get('/portal/listBrigade') as HttpResponse<{ departmentId: number; departmentPhoto: string; departmentName: string; }[]>;

export const useGetAwardedMembers = () =>
  get('/listTypicalCharacterVos') as HttpResponse<AwardedMemberDetail[]>;

export const useGetSelectedAwardedMembers = () =>
  get('/listDisplayTypicalCharacterVos') as HttpResponse<AwardedMemberDetail[]>;

export const useSortAwardedMemberDisplay = (params: number[]) =>
  put('/editTypicalSort', params) as Promise<null>;

export const useGetLevel1AwardedMembersDiplay = () =>
  get('/public/listTypicalCharacterCardVos', { typicalLevel: 1 }, undefined, { key: 'typical-level-1' }) as HttpResponse<AwardedMemberDisplayDetail[]>;

export const useGetLevel2AwardedMembersDiplay = () =>
  get('/public/listTypicalCharacterCardVos', { typicalLevel: 2 }, undefined, { key: 'typical-level-2' }) as HttpResponse<AwardedMemberDisplayDetail[]>;

export const useGetDepartmentsDisplay = () =>
  get('/public/listPortalDepartmentVos') as HttpResponse<{ departmentId: number; departmentName: string; }[]>;

export const useGetDepartmentAwardedMebers = (params: { departmentId: number }) =>
  get('/public/listDepartmentTypicalCharacterCardVos', params) as HttpResponse<AwardedMemberDisplayDetail[]>;

export const useGetVideos = (params: { employeeId: number }) =>
  get('/public/queryEmployeeVideoList', params) as HttpResponse<Video[]>;

export const useAddVideo = (params: {
  employeeId: number;
  videoName: string;
  videoUrl: string;
  videoCoverUrl: string;
}) => nativeFetch('/addEmployeeVideo', 'post', params) as Promise<null>;

export const useDeleteVideos = (ids: number[]) => 
  put('/deleteEmployeeVideo', ids) as Promise<null>;