<template>
  <div ref="containerRef" class="chart-container"></div>
</template>

<script lang="ts" setup>
import { echarts } from '@/utils/echarts';
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { isDarkInjectionKey } from '@/tokens';

import type { ECharts } from 'echarts/core';
import type {
  BarSeriesOption, 
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption
} from 'echarts/charts';
import type {
  RadarComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

type ECSeriesOption = 
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | RadarSeriesOption;

export type ECOption = ComposeOption<
  | ECSeriesOption
  | RadarComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>;

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

const props = defineProps<{
  option: ECOption
}>();

const { path } = useRoute();
const isIndex = path === '/' || path === '/display/department';

const containerRef = ref<HTMLDivElement>();
let chart: ECharts;

useResizeObserver(containerRef, () => chart!.resize());

const isDark = inject(isDarkInjectionKey)!;

onMounted(() => {
  const dom = containerRef.value!;
  chart = echarts.init(dom,
    isIndex
      ? 'customed'
      : isDark.value ? 'myDark' : undefined);

  props.option && chart.setOption(props.option);
});

watch(
  () => props.option, 
  () => props.option && chart.setOption(props.option)
);

!isIndex && watch(isDark, val => {
  chart.dispose();
  chart = echarts.init(containerRef.value!, val ? 'myDark' : undefined);
  chart.setOption(props.option);
});
</script>