import type { 
  ParamsForPagingFetch,
  PagingTableData,
  COSBucketSecret,
  TreeNodeData,
  Honor,
  HonorDetail,
  HonorProject,
  HonorApplication,
  MemberProfile,
  DepartmentProfile,
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
  Video,
  PersonalDeed,
  DepartmentDeed,
  AwardedDepartmentDetail,
  AwardedDepartmentDisplayDetail,
} from './use-api-types';
import type { SearchParameters } from 'ofetch';
import type { AnnualAssessment } from './use-api-types';

export const useLogin = (
  params: {
    username: string;
    password: string;
    rememberMe: boolean;
  }
) => nativeFetch<boolean>('/user/login', 'post', params);

export const useLogout = () =>
  nativeFetch<boolean>('/user/logout', 'post');

export const useModifyPassword = (params: { oldPasswd: string; newPasswd: string }) => 
  nativeFetch<boolean>('/user/modifyPasswd', 'post', params);

export const useGetAutoCompleteItems = (url: string, params: SearchParameters) => 
  nativeFetch<string[]>(url, 'get', params);

export const useGetDepartmentTree = () =>
  get<TreeNodeData[]>('/selection/queryListDepartmentTree');

export const useGetEmployeeNames = () =>
  get<Omit<TreeNodeData, 'parentId' | 'children'>[]>('/selection/queryListEmployeeName');

export const useGetSelectOptionsByDict = (dictType: string) =>
  get<TreeNodeData[]>('/selection/queryListDictTreeByType', { dictType })

export const useGetSelectOptions = (selectTarget: string) =>
  selectTarget === 'DepartmentTree'
  ? useGetDepartmentTree()
  : selectTarget === 'EmployeeName'
    ? useGetEmployeeNames()
    : useGetSelectOptionsByDict(selectTarget);

export const useGetCOSSecret = () =>
  get<COSBucketSecret>('/cos/querySecret', void 0, void 0, { immediate: false });

export const useGetMembers = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/employee/queryPageEmployeeList', params, void 0, { immediate: false });

export const useQueryMemebers = (params: Record<string, any>) =>
  nativeFetch<any[]>('/employee/queryListEmployByCondition', 'post', params);

export const useDeleteMember = (params: { employeeId: number }) =>
  del('/employee/deleteEmployee', params);

export const useAddMember = (pararms: Record<string, any>) =>
  nativeFetch('/employee/addEmployee', 'post', pararms);

export const useModifyMember = (params: Record<string, any> & { id: number }) =>
  put('/employee/modifyEmployee', params);

export const useGetDepartments = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/department/queryPageDepartment', params, void 0, { immediate: false });

export const useQueryDepartments = (params: Record<string, any>) =>
  nativeFetch<any[]>('/department/queryListDepartmentByCondition', 'get', params);

export const useGetDepartmentProfile = (params: { departmentId: number }) =>
  get<DepartmentProfile>('/department/queryDepartmentDetail', params);

export const useDeleteDepartment = (params: { departmentId: number }) =>
  del('/department/deleteDepartment', params);

export const useAddDepartment = (params: Record<string, any>) =>
  nativeFetch('/department/addDepartment', 'post', params);

export const useModifyDepartment = (params: Record<string, any> & { id: number }) =>
  put('/department/modifyDepartment', params);

export const useGetLogs = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/operaLog/queryPageOperaLog', params, void 0, { immediate: false });

export const useQueryLogs = (params: Record<string, any>) =>
  nativeFetch<any[]>('/operaLog/queryListOperaLogByCondition', 'post', params);

export const useGetUsers = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/user/queryPageUser', params, void 0, { immediate: false });

export const useQueryUsers = (params: Record<string, any>) =>
  nativeFetch<any[]>('/user/queryListUserByCondition', 'post', params);

export const useAddUser = (parmas: {
  username: string,
  departmentName: string
}) =>
  nativeFetch('/user/addUser', 'post', parmas);

export const useDeleteUser = (params: { userId: number }) =>
  del('/user/deleteUser', params);

export const useResetUserPwd = (params: { userId: number }) =>
  put<string>('/user/resetPasswd', params);

export const useGetDictionaries = () =>
  get<TreeNodeData[]>('/dict/queryListDictTree');

export const useAddDictionary = (params: {
  parentId: number;
  dictName: string
}) => 
  nativeFetch<number>('/dict/addDict', 'post', params);

export const useDeleteDictionary = (params: { dictId: number }) =>
  del('/dict/deleteDict', params);

export const useModifyDictionary = (params: {
  dictId: number;
  dictNewName: string
}) => 
  put('/dict/modifyDict', params);

export const useGetHonors = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/honor/queryPageHonor', params, void 0, { immediate: false });

export const useQueryHonors = (params: Record<string, any>) =>
  nativeFetch<Honor[]>('/honor/queryListHonorByCondition', 'post', params);

export const useGetHonorDetail = (params: { honorId: number }, options?: OtherUseFetchOptions<HonorDetail>) =>
  get<HonorDetail>('/honor/queryHonorDetailById', params, void 0, options);

export const useDeleteHonor = (params: { honorId: number }) =>
  del('/honor/deleteHonor', params);

export const useAddHonor = (params: Record<string, any>) =>
  nativeFetch('/honor/addHonor', 'post', params);

export const useModifyHonor = (params: Record<string, any> & { id: number }) =>
  put('/honor/modifyHonor', params);

export const useGetHonorProjects = (params: ParamsForPagingFetch) => 
  get<PagingTableData>('/honorProject/queryPageHonorProject', params, void 0, { immediate: false });

export const useQueryHonorProjects = (params: Record<string, any>) =>
  nativeFetch('/honorProject/queryListHonorProject', 'post', params) as Promise<HonorProject[]>;

export const useDeleteHonorProject = (params: { honorProjectId: number }) =>
  del('/honorProject/deleteHonorProject', params);

export const useAddHonorProject = (params: Record<string, any>) =>
  nativeFetch('/honorProject/addHonorProject', 'post', params);

export const useModifyHonorProject = (params: Record<string, any> & { id: number }) =>
  put('/honorProject/modifyHonorProject', params);

export const useGetApplications = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/honorAuditApply/queryPageHonorAuditApply', params, void 0, { immediate: false });

export const useGetReturnedApplications = (params: ParamsForPagingFetch) =>
  get<PagingTableData>('/honorAuditApply/queryPageHonorAuditApplyDone', params);

export const useQueryApplications = (params: Record<string, any>) =>
  nativeFetch<HonorApplication[]>('/honorAuditApply/queryListHonorAuditApply', 'post', params);

export const useQueryReturnedApplications = (params: Record<string, any>) =>
  nativeFetch<HonorApplication[]>('/honorAuditApply/queryPageHonorAuditApplyDone', 'post', params);

export const useGetApplicationDetail = (params: { honorApplyId: number }, options?: OtherUseFetchOptions<HonorDetail>) =>
  get<HonorDetail>('/honorAuditApply/queryHonorDetail', params, void 0, options);

export const useReturnApplication = (params: { honorApplyId: number }) =>
  put('/honorAuditApply/auditHonorApply', params);

export const useRecoverApplication = (params: { honorApplyId: number }) =>
  put('/honorAuditApply/recoverHonorApply', params);

export const useCancelApplication = (params: { honorApplyId: number }) =>
  del('/honorAuditApply/deleteHonorApply', params);

export const useSubmitApplication = (params: Record<string, any>) =>
  nativeFetch('/honorAuditApply/applyHonor', 'post', params);

export const useSwitchService = (params: Record<string, any> & { employeeId: number }) =>
  put('/employeeChange/changeDepartment', params);

export const useGetHonorCount = () =>
  get<number>('/homeOverview/countHonor');

export const useGetMemberCount = () =>
  get<number>('/homeOverview/countEmployee');

export const useGetDepartmentCount = () =>
  get<number>('/homeOverview/countDepartment');

export const useGetLoginCount = () =>
  get<number>('/homeOverview/countLogin');

export const useGetDepartmentHonorsCount = () =>
  get<Record<string, number>>('/homeOverview/countDepartmentHonor');

export const useGetLastDecadeHonorData = () =>
  get<Record<string, number>>('/homeOverview/countHonorTrendByYear');

export const useGetHonorLevelsData = () =>
  get<Record<string, number>>('/homeOverview/countHonorByLevel');

export const useGetMemberProfile = (params: { employeeId: number }) =>
  get<MemberProfile>('/employee/queryEmployeeDetailById', params);

export const useGetJobHistory = (params: { employeeId: number }) =>
  get<JobHitory[]>('/employeeWork/queryListEmployeeWork', params);

export const useDeleteJobHistory = (params: { id: number }) =>
  del('/employeeWork/deleteEmployeeWork', params);

export const useAddJobHistory = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeWork/addEmployeeWork', 'post', params);

export const useModifyJobHistory = (params: Record<string, any> & { id: number }) =>
  put('/employeeWork/modifyEmployeeWork', params);

export const useGetAssessments = (params: { employeeId: number }) =>
  get<AnnualAssessment[]>('/employeeAnnualAssessment/queryListEmployeeAnnualAssessment', params);

export const useDeleteAssessment = (params: { id: number }) =>
  del('/employeeAnnualAssessment/deleteEmployeeAnnualAssessment', params);

export const useAddAssessment = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeAnnualAssessment/addEmployeeAnnualAssessment', 'post', params);

export const useModifyAssessment = (params: Record<string, any> & { id: number }) =>
  put('/employeeAnnualAssessment/modifyEmployeeAnnualAssessment', params);

export const useGetEvents = (params: { employeeId: number }) =>
  get<Event[]>('/employeeEvent/queryListEmployeeEvent', params);

export const useDeleteEvent = (params: { id: number }) =>
  del('/employeeEvent/deleteEmployeeEvent', params);

export const useAddEvent = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeEvent/addEmployeeEvent', 'post', params);

export const useModifyEvent = (params: Record<string, any> & { id: number }) =>
  put('/employeeEvent/modifyEmployeeEvent', params);

export const useGetContests = (params: { employeeId: number }) =>
  get<Contest[]>('/employeeCompetition/queryListEmployeeCompetition', params);

export const useDeleteContest = (params: { id: number }) =>
  del('/employeeCompetition/deleteEmployeeCompetition', params);

export const useAddContest = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeCompetition/addEmployeeCompetition', 'post', params);

export const useModifyContest = (params: Record<string, any> & { id: number }) =>
  put('/employeeCompetition/modifyEmployeeCompetition', params);

export const useGetTraining = (params: { employeeId: number }) =>
  get<Training[]>('/employeeTrain/queryListEmployeeTrain', params);

export const useDeleteTraining = (params: { id: number }) =>
  del('/employeeTrain/deleteEmployeeTrain', params);

export const useAddTraining = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/employeeTrain/addEmployeeTrain', 'post', params);

export const useModifyTraining = (params: Record<string, any> & { id: number }) =>
  put('/employeeTrain/modifyEmployeeTrain', params);

export const useGetTypical = (params: { employeeId: number }) =>
  get<Typical[]>('/public/listTypicalRoute', params);

export const useDeleteTypical = (params: { id: number }) =>
  del('/deleteTypicalRoute', params);

export const useAddTypical = (params: Record<string, any> & { employeeId: number }) =>
  nativeFetch('/addTypicalRoute', 'post', params);

export const useModifyTypical = (params: Record<string, any> & { id: number }) =>
  put('/modifyTypicalRoute', params);

export const useGetHonorRoute = (params: { employeeId: number }) =>
  get<HonorDetail[]>('/employeeHonor/queryListEmployeeHonor', params);

export const useGetMemberHonorCount = (params: { employeeId: number }) =>
  get<number>('/employeeOverview/countEmployeeHonor', params);

export const useGetMemberContestCount = (params: { employeeId: number }) =>
  get<number>('/employeeOverview/countEmployeeCompetition', params);

export const useGetMemberContributionCount = (params: { employeeId: number }) =>
  get<number>('/employeeOverview/countEmployeeContribute', params);

export const useGetMemberTrainingCount = (params: { employeeId: number }) =>
  get<number>('/employeeOverview/countEmployeeTrain', params);

export const useGetMemberHonorTrendData = (params: { employeeId: number }) =>
  get<Record<string, number>>('/employeeOverview/countEmployeeHonorTrendByYear', params);

export const useGetMemberHonorTypeData = (params: { employeeId: number }) =>
  get<Record<string, number>>('/employeeOverview/countEmployeeHonorByHonorType', params);

export const useGetMemberHonorLevelData = (params: { employeeId: number }) =>
  get<Record<string, number>>('/employeeOverview/countEmployeeHonorByHonorLevel', params);

export const useGetDepartmentMemberCount = (params: { departmentId: number }) =>
  get<number>('/homeOverview/countEmployeeByDepartmentId', params);

export const useGetDepartmentHonorCount = (params: { departmentId: number }) =>
  get<number>('/homeOverview/countHonorByDepartmentId', params);

export const useGetDepartmentSubCount = (params: { departmentId: number }) =>
  get<number>('/homeOverview/countDepartmentByDepartmentId', params);

export const useGetDepartmentHonorTrendData = (params: { departmentId: number }) =>
  get<Record<string, number>>('/homeOverview/countDepartmentHonorTrendByYear', params);

export const useGetDepartmentSubHonorData = (params: { departmentId: number }) =>
  get<Record<string, number>>('/homeOverview/countDepartmentHonorByDepartmentId', params);

export const useGetDepartmentHonorLevelData = (params: { departmentId: number }) =>
  get<Record<string, number>>('/homeOverview/countDepartmentHonorByLevel', params);

export const useGetPersonalDeedsList = (params: { employeeId: number }) =>
  get<PersonalDeed[]>('/employeeDeed/listEmployeeDeed', params);

export const useGetPersonalDeed = (params: { id: number }) =>
  get<Omit<PersonalDeed, 'digest' | 'employeeId'>>('/employeeDeed/queryEmployeeDeed', params);

export const useAddPersonalDeed = (params: Omit<PersonalDeed, 'id' | 'digest'> & { employeeId: number }) =>
  nativeFetch('/employeeDeed/editEmployeeDeed', 'post', params);

export const useModifyPersonalDeed = (params: Omit<PersonalDeed, 'digest'>) =>
  put('/employeeDeed/modifyEmployeeDeed', params);

export const useDeletePersonalDeed = (params: { id: number }) =>
  del('/employeeDeed/deleteEmployeeDeed', params);

export const useGetMemberHonors = (params: { employeeId: number }) =>
  get<Record<string, any>[]>('/selection/queryListEmployeeTypicalHonor', params);

export const useSetMemberAwarded = (params: { employeeId: number }) =>
  nativeFetch('/typicalCharacter/confirm', 'post', params);

export const useGetLevel0AwardedMembers = (parmas: ParamsForPagingFetch) =>
  post<PagingTableData<AwardedMemberDetail>>('/typicalCharacter/page', ref({ typicalLevel: 0, ...unref(parmas) }), void 0, { key: 'member-typical-level-0' });

export const useGetLevel1AwardedMembers = (parmas: ParamsForPagingFetch) =>
  post<PagingTableData<AwardedMemberDetail>>('/typicalCharacter/page', ref({ typicalLevel: 1, ...unref(parmas) }), void 0, { key: 'member-typical-level-1' });

export const useQueryAwardedMember = (params: Record<string, any>) =>
  nativeFetch<AwardedMemberDetail[]>('/typicalCharacter/listByCondition', 'post', params);

export const usePromoteAwardedMemberLevel = (params: { employeeId: number }) =>
  put('/typicalCharacter/promote', params);

export const useDemoteAwardedMemberLevel = (params: { employeeId: number }) =>
  del('/typicalCharacter/cancel', params);

export const useGetAwardedMemberDisplay = (params: { employeeId: number }) =>
  get<AwardedMemberDisplay>('/queryTypicalDisplay', params);

export const useModifyAwardedMemberDisplay = (params: {
  employeeId: number;
  displayImgUrl: string;
  displayContent: string;
}) =>
  put('/editTypicalDisplay', params);

export const useGetLogDetail = (params: { logId: number }) =>
  nativeFetch<LogDetail>('/operaLog/queryOperaLogDetailById', 'get', params);

export const useGetAwardedMembers = () =>
  get<AwardedMemberDetail[]>('/listTypicalCharacterVos');

export const useGetSelectedAwardedMembers = () =>
  get<AwardedMemberDetail[]>('/listDisplayTypicalCharacterVos');

export const useSortAwardedMemberDisplay = (params: number[]) =>
  put('/editTypicalSort', params);

export const useGetLevel1AwardedMembersDiplay = () =>
  get<AwardedMemberDisplayDetail[]>('/public/listTypicalCharacterCardVos', { typicalLevel: 1 });

export const useGetDepartmentsDisplay = () =>
  get<{ departmentId: number; departmentName: string; }[]>('/public/listPortalDepartmentVos');

export const useGetDepartmentAwardedMebers = (params: { departmentId: number }) =>
  get<AwardedMemberDisplayDetail[]>('/public/listDepartmentTypicalCharacterCardVos', params);

export const useGetVideos = (params: { employeeId: number }) =>
  get<Video[]>('/public/queryEmployeeVideoList', params);

export const useAddVideo = (params: {
  employeeId: number;
  videoName: string;
  videoUrl: string;
  videoCoverUrl: string;
  duration: string;
}) => nativeFetch('/addEmployeeVideo', 'post', params);

export const useDeleteVideos = (ids: number[]) =>
  put('/deleteEmployeeVideo', ids);

export const useGetEmployeeNamesAndPhotos = (params: number[]) =>
  nativeFetch<{ name: string; photoUrl: string }[]>('/employee/listEmployeePhoto', 'post', params);

export const useGetDepartmentEvents = (params: { departmentId: number }) =>
  get<Event[]>('/public/departmentEvent/list', params);

export const useAddDepartmentEvent = (params: Record<string, any> & { departmentId: number }) =>
  nativeFetch('/departmentEvent/add', 'post', params);

export const useModifyDepartmentEvent = (params: Event) =>
  put('/departmentEvent/update', params);

export const useDeleteDepartmentEvent = (params: { id: number }) =>
  del('/departmentEvent/delete', params);

export const useGetDepartmentContests = (params: { departmentId: number }) =>
  get<Contest[]>('/public/departmentCompetition/list', params);

export const useAddDepartmentContest = (params: Record<string, any> & { departmentId: number }) =>
  nativeFetch('/departmentCompetition/add', 'post', params);

export const useModifyDepartmentContest = (params: Contest) =>
  put('/departmentCompetition/update', params);

export const useDeleteDepartmentContest = (params: { id: number }) =>
  del('/departmentCompetition/delete', params);

export const useGetDepartmentDeedsList = (params: { departmentId: number }) =>
  get<DepartmentDeed[]>('/public/departmentDeed/list', params);

export const useGetDepartmentDeed = (params: { id: number }) =>
  get<Omit<DepartmentDeed, 'digest' | 'departmentId'>>('/public/departmentDeed/detail', params);

export const useAddDepartmentDeed = (params: Omit<DepartmentDeed, 'id' | 'digest'>) =>
  nativeFetch('/departmentDeed/add', 'post', params);

export const useModifyDepartmentDeed = (params: Omit<DepartmentDeed, 'departmentId' | 'digest'>) =>
  put('/departmentDeed/update', params);

export const useDeleteDepartmentDeed = (params: { id: number }) =>
  del('/departmentDeed/delete', params);

export const useGetLevel0AwardedDepartments = (parmas: ParamsForPagingFetch) =>
  post<PagingTableData<AwardedDepartmentDetail>>('/typicalDepartment/page', ref({ typicalLevel: 0, ...unref(parmas) }), void 0, { key: 'department-typical-level-0' });

export const useGetLevel1AwardedDepartments = (parmas: ParamsForPagingFetch) =>
  post<PagingTableData<AwardedDepartmentDetail>>('/typicalDepartment/page', ref({ typicalLevel: 1, ...unref(parmas) }), void 0, { key: 'department-typical-level-1' });

export const useQueryAwardedDepartment = (params: Record<string, any>) =>
  nativeFetch<AwardedDepartmentDetail[]>('/typicalDepartment/listByCondition', 'post', params);

export const useSetDepartmentAwarded = (params: { departmentId: number }) =>
  nativeFetch('/typicalDepartment/confirm', 'post', params);

export const usePromoteAwardedDepartmentLevel = (params: { departmentId: number }) =>
  put('/typicalDepartment/promote', params);

export const useDemoteAwardedDepartmentLevel = (params: { departmentId: number }) =>
  del('/typicalDepartment/cancel', params);

export const useGetAwardedDepartmentDisplay = (params: { departmentId: number }) =>
  get<AwardedDepartmentDisplay>('/typicalDepartmentDisplay/query', params);

export const useModifyAwardedDepartmentDisplay = (params: Omit<AwardedDepartmentDisplay, 'departmentName'>) =>
  put('/typicalDepartmentDisplay/edit', params);

export const useGetAwardedDepartments = () =>
  get<AwardedDepartmentDetail[]>('/listTypicalDepartmentVos');

export const useGetSelectedAwardedDepartments = () =>
  get<AwardedDepartmentDetail[]>('/listDisplayTypicalDepartmentVos');

export const useSortAwardedDepartmentDisplay = (params: number[]) =>
  put('/editTypicalDepartmentSort', params);

export const useGetLevel1AwardedDepartmentsDiplay = () =>
  get<AwardedDepartmentDisplayDetail[]>('/public/listTypicalDepartmentCardVos');