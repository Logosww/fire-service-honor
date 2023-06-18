import * as _echarts from 'echarts/core';
import darkTheme from '@/assets/echarts/dark.json';

const globalThisForECharts = globalThis as unknown as { echarts: any };

_echarts.registerTheme('myDark', darkTheme);

export const echarts = globalThisForECharts.echarts || _echarts;

if(process.env.NODE_ENV !== 'production') globalThisForECharts.echarts = echarts;