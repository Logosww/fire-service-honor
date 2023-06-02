import type { InjectionKey, Ref } from 'vue';

export const navsKey: InjectionKey<Ref<string[]>> = Symbol('navsKey');