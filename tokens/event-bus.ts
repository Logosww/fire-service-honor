import type { InjectionKey } from 'vue';
import type { EventBusKey, UseEventBusReturn } from '@vueuse/core';

export type EventType = 'confirm' | 'submit' | 'delete';
export type EventBusContext = UseEventBusReturn<[
  event: EventType,
  FormOrEmploeeId?: number | string,
  id?: number
], void>;

export const eventBusKey: EventBusKey<[
  event: EventType,
  FormOrEmploeeId?: number | string,
  id?: number
]> = Symbol('eventBusKey');
export const eventBusContextKey: InjectionKey<EventBusContext> = Symbol('eventBusContextKey');