import { sendRedirect } from 'h3';

import type {
  AsyncData,
  UseFetchOptions as _UseFetchOptions
} from '#app';
import type { MaybeRef } from '@vueuse/core';
import type { SearchParameters, FetchOptions, FetchResponse } from 'ofetch';

interface ResOptions<T = void> {
  data: T;
  code: number;
  msg: string;
};

type PostRequestBody = MaybeRef<Record<string, any>>;
type UseFetchOptions<T> = _UseFetchOptions<ResOptions<T>, T>;
export type OtherUseFetchOptions<T = void> = Omit<UseFetchOptions<T>, 'query' | 'body' | 'headers'>;
type RequestMethodType = 
  "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
export type WatchOption = OtherUseFetchOptions<unknown>['watch'];

let message: typeof ElMessage | undefined;

const baseURL = process.env.NODE_ENV === 'production' ? 'https://api.pams.ishortv.top': '/api';

const interceptors: Pick<FetchOptions<'json'>, 'onResponse' | 'onResponseError'> = {
  onResponse: ({ response }) => {
    const { _data, ok } = response as FetchResponse<ResOptions<unknown>>;
    if(!ok) return;
    
    const { code, msg } = _data!;
    if(code !== 1) {
      message?.({ type: 'error', message: msg });
      return Promise.reject(msg);
    }
  },
  onResponseError: ({ response }) => {
    const { status } = response;
    if(status === 401 || status === 409) {
      message?.({ type: 'error', message: '登录信息过期，请重新登录' });
      redirectToLogin();
    } else if(status === 403) 
      message!({ type: 'error', message: '你的权限不足' });
    else message?.({ type: 'error', message: '网络异常' });

    return Promise.reject(response.statusText);
  },
}

const redirectToLogin = async () => {
  if(process.server) {
    const event = useRequestEvent();
    return sendRedirect(event!, '/login', 301);
  }
  else await navigateTo('/login', { redirectCode: 302 });
};

/**
 * 封装 useFetch
 * @param { string } url 请求地址
 * @param { UseFetchOptions } options useFetchOptions
 * @param { object } headers 自定义Headers
 */
const fetch = <T = void>(
  url: string,
  options?: UseFetchOptions<T>,
  headers?: HeadersInit
) => {
  // consider to send cookies instead of adding token to the headers
  const originalHeaders = useRequestHeaders(['cookie']);
  const customHeaders = originalHeaders 
    ? {
      // proxy bypass cookies from client, only work in server-side call on API
      ...headers,
      cookie: originalHeaders.cookie ?? ''
    }
    : headers;
  
  message = process.server ? undefined : ElMessage;

  return useFetch(
    url,
    { 
      credentials: 'include',
      headers: customHeaders,
      baseURL,
      deep: false,
      transform: (res: ResOptions<T>) => res ? res.data : null,
      ...interceptors,
      ...options
    }
  ) as AsyncData<T, null>;
};

export type FetchResult<T = void> = ReturnType<typeof fetch<T>>;

// 封装 ofetch，只用于客户端请求接口，而非 SSR 阶段的 AsyncData。
export const nativeFetch = async <T = void>(
  url: string,
  method: RequestMethodType,
  params?: SearchParameters | PostRequestBody,
  headers?: HeadersInit
) => {
  const resolvedParams = method === 'get' || method === 'delete'
    ? { query: params as SearchParameters }
    : { body: params as PostRequestBody };
  
  message = ElMessage;

  return $fetch<ResOptions<T>>(url, {
    method,
    baseURL,
    credentials: 'include',
    ...resolvedParams,
    ...interceptors,
    headers
  }).then(({ data }) => data);
};

export const get = <T>(
  url: string,
  query?: SearchParameters,
  headers?: HeadersInit,
  otherOptions?: OtherUseFetchOptions<T>
) =>
  fetch<T>(url, { method: 'get', query, ...otherOptions }, headers);

export const post = <T>(
  url: string,
  body?: PostRequestBody,
  headers?: HeadersInit,
  otherOptions?: OtherUseFetchOptions<T>
) =>
  fetch<T>(url, { method: 'post', body, ...otherOptions }, {
    'Content-Type': 'application/json',
    ...headers
  });

export const put = <T = void>(
  url: string,
  body: PostRequestBody,
  headers?: HeadersInit
) =>
  nativeFetch<T>(url, 'put', body, { 'Content-Type': 'application/json', ...headers });

export const del = <T = void>(
  url: string,
  params?: SearchParameters,
  headers?: HeadersInit
) =>
  nativeFetch<T>(url, 'delete', params, { 'Content-Type': 'application/x-www-form-urlencoded', ...headers });