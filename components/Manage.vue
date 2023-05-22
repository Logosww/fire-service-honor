<template>
  <div class="manage-container">
    <div class="query-container">
      <slot name="query" />
    </div>
    <el-skeleton :loading="tableLoading" :throttle="500" animated>
      <template #template>
        <div class="table-skeleton" v-for="n in 11">
          <el-skeleton-item variant="rect" />
        </div>
      </template>
      <div class="table-container">
        <ClientOnly>
          <el-table
            :height="height * .7"
            :data="resolvedData"
            v-loading="isQuerying"
            table-layout="auto"
            stripe
          >
            <el-table-column type="selection" v-if="multipleSelect" />
            <el-table-column type="index" v-if="!hideIndex" />
            <el-table-column
              v-for="(item, index) in tableColumnProps"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              align="center"
            />
            <slot name="tableOperationColumn" />
            <template #empty>
              <el-empty :image-size="240" />
            </template>
          </el-table>
        </ClientOnly>
        <el-pagination 
          style="justify-content: center; margin-top: 20px;"
          layout="total, prev, pager, next"
          :total="resolvedPaginationProps.total"
          :page-count="resolvedPaginationProps.pageCount"
          :page-size="resolvedPaginationProps.pageSize"
          :current-page="resolvedPaginationProps.currentPage"
          @current-change="page => paramsForPadingFetch.page = page"
          hide-on-single-page
        />
      </div>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { containerHeightKey } from '@/tokens';

import type { ParamsForPagingFetch } from '@/composables/use-api-types';
import type { TableColumnProps } from '@/constants';

const props = defineProps<{
  tableColumnProps: TableColumnProps[];
  multipleSelect?: boolean;
  hideIndex?: boolean;
  composablePath?: string;
}>();

let queryFormCache: Record<string, any>;

const height = inject(containerHeightKey)!;

const tableLoading = ref(true);
const isQuerying = ref(false);
const queryResultCurrentPage = ref(1);

const paramsForPadingFetch: ParamsForPagingFetch = ref({
  page: 1,
  size: 20
});

const result = ref<any[]>([]);
const isQueryed = ref(false);
const resolvedData = computed(() => isQueryed.value ? result.value : data.value.records);
const resolvedPaginationProps = computed(() => ({
  total: isQueryed.value ? result.value.length : data.value.total,
  pageCount: isQueryed.value ? undefined : data.value.pages,
  pageSize: paramsForPadingFetch.value.size,
  currentPage: isQueryed.value 
    ? queryResultCurrentPage.value 
    : paramsForPadingFetch.value.page
}));

const doQuery = ref<(params?: any) => void>();

const queryData = (form: Record<string, any>) => {
  const formKeys = Object.keys(form);
  const formValues = Object.values(form);
  const isFormValid = formKeys.length && formValues.some(value => !!value);
  if(!isFormValid) 
    return ElMessage({ type: 'warning', message: '查询条件不能为空', grouping: true });
  form = filterFormNull(form);

  !doQuery.value && 
    (doQuery.value = useDebounceFn((form?: Record<string, any>) => {
      if(form) queryFormCache = form;
      queryTableData(queryFormCache)
        .then(res => result.value = res)
        .catch(() => isQueryed.value = false)
        .finally(() => isQuerying.value = false);
    }, 250, { rejectOnCancel: true }));

  isQuerying.value = isQueryed.value = true;
  doQuery.value(form);
};

const restoreQuery = (form: Record<string, any>) => {
  restoreForm(form);
  isQuerying.value = isQueryed.value = false;
  result.value = [];
};

const refreshData = 
  computed(() => isQueryed.value ? doQuery.value! : fetchDataMethod);

defineExpose({
  queryData,
  refreshData,
  restoreQuery
});

const {
  data,
  fetchDataMethod,
  queryTableData
} = await useFetchTableData(paramsForPadingFetch, props.composablePath);

await fetchDataMethod();
tableLoading.value = false;

</script>

<style lang="scss">
  @use '@/assets/style/components/manage' as *;
</style>