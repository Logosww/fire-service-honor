import * as _echarts from 'echarts/core';
import darkTheme from '@/assets/echarts/dark.json';
import customTheme from '@/assets/echarts/customed.json';

const globalThisForECharts = globalThis as unknown as { echarts: any };

_echarts.registerTheme('myDark', darkTheme);
_echarts.registerTheme('customed', customTheme);

export const echarts = globalThisForECharts.echarts || _echarts;

if(process.env.NODE_ENV !== 'production') globalThisForECharts.echarts = echarts;