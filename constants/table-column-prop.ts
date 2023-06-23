export interface TableColumnProps {
  prop: string;
  label?: string;
  width?: string;
};

export type TableColumnPropsMap = Record<string, TableColumnProps[]>;

export const tableColumnPropsMap: TableColumnPropsMap = {
  '/member': [
    {
      prop: 'employeeName',
      label: '姓名'
    },
    {
      prop: 'employeeDepartment',
      label: '集体'
    },
    {
      prop: 'employeePositionRank',
      label: '职级'
    },
    {
      prop: 'employeeTypeName',
      label: '人员类别'
    }
  ],
  '/department': [
    {
      prop: 'departmentName',
      label: '集体名称'
    },
    {
      prop: 'departmentLeader',
      label: '集体负责人'
    },
    {
      prop: 'departmentPhone',
      label: '联系电话'
    }
  ],
  '/log': [
    {
      prop: 'operaType',
      label: '日志类型'
    },
    {
      prop: 'operaTime',
      label: '日志时间'
    },
    {
      prop: 'operaDescription',
      label: '日志描述'
    },
    {
      prop: 'operaUsername',
      label: '操作者'
    }
  ],
  '/administrator': [
    {
      prop: 'username',
      label: '用户名'
    },
    {
      prop: 'departmentName',
      label: '集体'
    },
    {
      prop: 'loginTime',
      label: '最后登录时间'
    }
  ],
  '/honor': [
    {
      prop: 'honorPersonType',
      label: '荣誉者类型'
    },
    {
      prop: 'honorPerson',
      label: '荣誉获得者'
    },
    {
      prop: 'honorName',
      label: '荣誉名称'
    },
    {
      prop: 'issueDate',
      label: '获奖日期'
    }
  ],
  '/honorProject': [
    {
      prop: 'honorName',
      label: '荣誉名称'
    },
    {
      prop: 'honorTypeAndLevel',
      label: '荣誉类别/荣誉级别'
    },
    {
      prop: 'honorScore',
      label: '荣誉分值'
    }
  ],
  '/honorAudit/undealt': [
    {
      prop: 'honorPersonType',
      label: '荣誉者类别'
    },
    {
      prop: 'honorPersonName',
      label: '荣誉获得者'
    },
    {
      prop: 'honorName',
      label: '荣誉名称'
    },
    {
      prop: 'honorApplyDateTime',
      label: '申请日期'
    },
    {
      prop: 'honorApplyPerson',
      label: '申请人'
    }
  ],
  '/honorAudit/dealt': [
    {
      prop: 'honorPersonType',
      label: '荣誉者类别'
    },
    {
      prop: 'honorPersonName',
      label: '荣誉获得者'
    },
    {
      prop: 'honorName',
      label: '荣誉名称'
    },
    {
      prop: 'honorApplyDateTime',
      label: '申请日期'
    },
    {
      prop: 'honorApplyPerson',
      label: '申请人'
    },
    {
      prop: 'auditStatus',
      label: '审核结果'
    }
  ],
  '/honorApply/undealt': [
    {
      prop: 'honorPersonType',
      label: '荣誉者类别'
    },
    {
      prop: 'honorPersonName',
      label: '荣誉获得者'
    },
    {
      prop: 'honorName',
      label: '荣誉名称'
    },
    {
      prop: 'honorApplyDateTime',
      label: '申请日期'
    },
    {
      prop: 'honorApplyPerson',
      label: '申请人'
    }
  ],
  '/honorApply/dealt': [
    {
      prop: 'honorPersonType',
      label: '荣誉者类别'
    },
    {
      prop: 'honorPersonName',
      label: '荣誉获得者'
    },
    {
      prop: 'honorName',
      label: '荣誉名称'
    },
    {
      prop: 'honorApplyDateTime',
      label: '申请日期'
    },
    {
      prop: 'honorApplyPerson',
      label: '申请人'
    },
    {
      prop: 'auditStatus',
      label: '审核结果'
    }
  ],
  '/serviceChange': [
    {
      prop: 'employeeName',
      label: '姓名'
    },
    {
      prop: 'employeeDepartment',
      label: '集体'
    },
    {
      prop: 'employeePositionRank',
      label: '职级'
    },
    {
      prop: 'employeeTypeName',
      label: '人员类别'
    }
  ],
  'jobHistory': [
    {
      prop: 'startDate',
      label: '开始日期'
    },
    {
      prop: 'endDate',
      label: '结束日期'
    },
    {
      prop: 'unit',
      label: '工作单位'
    },
    {
      prop: 'position',
      label: '职务'
    }
  ],
  'annualAssessment': [
    {
      prop: 'annual',
      label: '年度'
    },
    {
      prop: 'assessmentUnit',
      label: '考评单位'
    },
    {
      prop: 'assessmentLevel',
      label: '考评等级'
    },
    {
      prop: 'assessmentRemark',
      label: '备注'
    }
  ],
  'event': [
    {
      prop: 'eventTime',
      label: '事件日期'
    },
    {
      prop: 'eventType',
      label: '事件类别'
    },
    {
      prop: 'eventContent',
      label: '事件内容'
    },
    {
      prop: 'eventDescription',
      label: '事件描述'
    }
  ],
  'contest': [
    {
      prop: 'competitionDate',
      label: '竞赛日期'
    },
    {
      prop: 'competitionType',
      label: '竞赛类别'
    },
    {
      prop: 'competitionName',
      label: '竞赛名称'
    },
    {
      prop: 'competitionAward',
      label: '竞赛奖项'
    }
  ],
  'training': [
    {
      prop: 'startDate',
      label: '开始日期'
    },
    {
      prop: 'endDate',
      label: '结束日期'
    },
    {
      prop: 'trainType',
      label: '培训类别'
    },
    {
      prop: 'trainUnit',
      label: '培训单位'
    },
    {
      prop: 'trainResult',
      label: '培训结果'
    }
  ],
  'typical': [
    {
      prop: 'typicalDate',
      label: '典型确定日期'
    },
    {
      prop: 'typicalType',
      label: '典型类别'
    },
    {
      prop: 'typicalUnit',
      label: '典型单位'
    },
    {
      prop: 'typeDescription',
      label: '典型描述'
    }
  ],
  '/typicalCharactor': [
    {
      prop: 'employeeName',
      label: '姓名'
    },
    {
      prop: 'employeeDepartmentName',
      label: '部门'
    },
    {
      prop: 'employeePosition',
      label: '职级'
    }
  ],
};