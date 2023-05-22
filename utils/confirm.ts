export const ConfirmDelete = (target: string, callback: () => void) => 
  ElMessageBox.confirm(
    `${target}删除后不可撤销，确认删除吗？`,
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(callback);