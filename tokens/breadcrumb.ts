import type { InjectionKey, ComputedRef } from 'vue';
import type { Breadcrumb } from '@/constants';

export const breadcrumbsKey: InjectionKey<ComputedRef<Breadcrumb[]>> =
  Symbol('BreadcrumbKey');