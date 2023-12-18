import type { FetchResult } from '@/utils';
import type { Ref } from 'vue';

export type TypicalLevel =  -1 | 0 | 1;

export type ParamsForPagingFetch = Ref<{
  page: number;
  size?: number
}>;

export interface PagingTableData<T = Record<string, any>> {
  page: number;
  size: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
  records: (T & { id: number })[];
};

export interface COSBucketSecret {
  credentials: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
  };
  startTime: number;
  expiredTime: number;
};

export interface TreeNodeData {
  id: number;
  label: string;
  parentId: number;
  children?: TreeNodeData[];
};

export interface DepartmentProfile {
  id: number;
  departmentName: string;
  departmentLeader: string;
  departmentPhone: string;
  departmentParent: string;
  departmentDescription: string;
  departmentHonorList: Honor[];
  departmentPhoto: string[];
  typicalLevel?: TypicalLevel;
};

export interface Honor {
  id: number;
  honorPersonType: string;
  honorPerson: string;
  honorName: string;
  issueDate: string;
};

export interface HonorDetail {
  id: number;
  honorPersonType: string;
  honorPerson: string[] | number[];
  honorName: string;
  issueDate: string;
  honorLevel: string;
  honorDesc: string;
  honorPhoto: string;
  honorType: string;
  issueUnit: string;
  issueNumber: string;
};

export interface HonorProject {
  id: number;
  honorName: string;
  honorTypeAndLevel: string;
  honorScore: number;
};

export interface HonorApplication {
  id: number;
  honorPersonType: string;
  honorPersonName: string;
  honorName: string;
  honorApplyDateTime: string;
  honorApplyPerson: string;
};

export interface MemberProfile {
  id: number;
  employeeName: string;
  employeeDepartment: string;
  employeePositionRank: string;
  employeeTypeName: string;
  employeeAvatar: string;
  employeeLifePhoto: string[];
  employeeSex: string;
  employeeBirthdayDate: string;
  employeeJoinDate: string;
  employeeTitleRank: string[];
  employeeStatus: string;
  employeeQuitDate: string;
  typicalLevel?: TypicalLevel;
  radar: {
    '劳': number;
    '绩': number;
    '基': number;
    '纪': number;
    '能': number;
    '政': number;
  }
};



export interface JobHitory {
  id: number;
  startDate: string;
  endDate: string;
  unit: string;
  position: string;
};

export interface AnnualAssessment {
  id: number;
  annual: string;
  assessmentUnit: string;
  assessmentLevel: string;
  assessmentRemark: string;
};

export interface Event {
  id: number;
  eventTime: string;
  eventContent: string;
  eventType: string;
  eventDescription: string;
};

export interface Contest {
  id: number;
  competitionDate: string;
  competitionName: string;
  competitionType: string;
  competitionAward: string;
};

export interface Training {
  id: number;
  startDate: string;
  endDate: string;
  trainUnit: string;
  trainType: string;
  trainResult: string;
};

export interface Typical {
  id: number;
  typicalDate: string;
  typicalType: string;
  typicalUnit: string;
  typeDescription: string;
};

export interface ElTableRowScope {
  $index: number;
  cellIndex: number;
  row: Record<string, any> & { id: number };
};

export interface AwardedMemberDetail {
  id: number;
  employeeName: string;
  employeePosition: string;
  employeeDepartmentName: string;
};

export interface AwardedDepartmentDetail {
  id: number;
  departmentName: string;
  departmentParentName: string;
  departmentLeader: string;
};

export interface LogDetail {
  operaUsername: string;
  departmentName: string;
  isAdmin: boolean;
  operaModule: string;
  operaType: string;
  operaDescription: string;
  result: boolean;
  operaTime: string
};

export interface TypicalHonor {
  honorName: string;
  honorPerson: string;
  honorLevel: string;
  issueDate: string;
};

export interface AwardDisplay {
  displayImgUrl: string;
  displayContent: string;
};

export interface AwardedMemberDisplay extends AwardDisplay {
  employeeId: number;
  employeeName: string;
};

export interface AwardedMemberDisplayDetail extends AwardedMemberDisplay {
  employeePosition: string;
  employeeDepartmentName: string;
  typicalEmployeePhoto: string;
  typicalHonors: string[];
  radarMap: {
    '劳': number;
    '绩': number;
    '基': number;
    '纪': number;
    '能': number;
    '政': number;
  }
};

export interface AwardedDepartmentDisplay extends AwardDisplay {
  departmentId: number;
  departmentName: string;
};

export interface AwardedDepartmentDisplayDetail extends AwardedDepartmentDisplay {
  departmentPhoto: string;
  departmentHonors: string[];
};

export interface Video {
  id: number;
  videoUrl: string;
  videoName: string;
  videoCoverUrl: string;
  videoDuration: string;
};

export interface Deed {
  id?: number;
  title: string;
  digest: string;
  coverPathUrl?: string;
  content?: string;
}

export interface PersonalDeed extends Deed {
  employeeId?: number;
};

export interface DepartmentDeed extends Deed {
  departmentId?: number;
};

export type FetchTableDataComposable = (params: ParamsForPagingFetch) => FetchResult<PagingTableData>;
export type QueryTableDataMethod = (params: Record<string, any>) => Promise<any[]>;

export type AutoCompleteQueryTarget
  = 'UserName' | 'EmployeeName';