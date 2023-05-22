export interface Breadcrumb {
  title: string;
  to?: string;
  replace?: boolean;
};

export type BreadcrumbMap = Record<string, Breadcrumb[]>;

export const breadcrumbMap: BreadcrumbMap = {
  '/member': [
    {
      title: '人员',
      to: '/member',
      replace: true
    },
    { title: '人员管理' }
  ],
  '/department': [
    {
      title: '集体',
      to: '/department',
      replace: true
    },
    { title: '集体管理' }
  ],
  '/honor': [
    {
      title: '荣誉',
      to: '/honor',
      replace: true
    },
    { title: '荣誉管理' }
  ],
  '/honorAudit': [
    {
      title: '荣誉',
      to: '/honorAudit',
      replace: true
    },
    { title: '荣誉审核' }
  ],
  '/honorApply': [
    {
      title: '荣誉',
      to: '/honorApply',
      replace: true
    },
    { title: '荣誉申请' }
  ],
  '/honorProject': [
    {
      title: '荣誉',
      to: '/honorProject',
      replace: true
    },
    { title: '荣誉项目管理' }
  ],
  '/honorStatistics': [
    {
      title: '荣誉',
      to: '/honorStatistics',
      replace: true
    },
    { title: '荣誉统计' }
  ],
  '/serviceChange': [
    {
      title: '关系',
      to: '/serviceChange',
      replace: true
    },
    { title: '关系变动' }
  ],
  '/log': [
    {
      title: '系统',
      to: '/log',
      replace: true
    },
    { title: '日志管理' }
  ],
  '/administrator': [
    {
      title: '系统',
      to: '/administrator',
      replace: true
    },
    { title: '管理员管理' }
  ],
  '/dictionary': [
    {
      title: '系统',
      to: '/dictionary',
      replace: true
    },
    { title: '字典管理' }
  ],
  '/memberDetail': [
    {
      title: '人员',
      to: '/memberDetail',
      replace: true
    },
    { title: '人员信息' }
  ],
  '/setPassword': [
    {
      title: '管理员',
      to: '/setPassword',
      replace: true
    },
    { title: '管理员密码修改' }
  ]
};