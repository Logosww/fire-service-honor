import type { InjectionKey, WritableComputedRef } from 'vue';

export const isDarkInjectionKey: InjectionKey<WritableComputedRef<Boolean>> = Symbol('isDarkInjectionKey');