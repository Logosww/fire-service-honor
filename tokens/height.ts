import type { InjectionKey, Ref } from 'vue';

export const containerHeightKey: InjectionKey<Ref<number>> = Symbol('containerHeightKey');