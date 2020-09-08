import { ContextOptions, KeyValuePair } from '../interfaces';
import { ContextHolder } from './ContextHolder';

interface RequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  params?: any;
  contentType?: string;
  responseType?: 'json' | 'plain' | 'blob';
}

const request = async (context: ContextOptions, opts: RequestOptions) => {
  console.log('request.buildRequestHeaders', context, opts);
  const headers = await buildRequestHeaders(context, opts.contentType);
  console.log('request.prepareUrl');
  const url = await prepareUrl(context, opts.url, opts.params);

  const response = await fetch(url, {
    body: opts.body ? JSON.stringify(opts.body) : null,
    method: opts.method ?? 'GET',
    headers,
    credentials: context.requestCredentials || 'same-origin',
  });

  if (!response.ok) {
    let errorMessage = await response.json();
    if (errorMessage.errors) {
      errorMessage = errorMessage.errors.join(', ');
    } else if (typeof errorMessage !== 'string') {
      errorMessage = `Error ${response.status} - ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  if (!opts.responseType || opts.responseType === 'json') {
    try {
      return await response.json();
    } catch (e) {
      return {};
    }
  } else if (opts.responseType === 'blob') {
    return await response.blob();
  } else {
    return await response.text();
  }
};

export const requestE = async (context: ContextOptions, opts: RequestOptions) => {
  console.log('|request| export const requestE', context, opts);
};

async function requestAF(context: ContextOptions, opts: RequestOptions) {
  console.log('|request| async function requestAF', context, opts);
}

export async function requestAFE(context: ContextOptions, opts: RequestOptions) {
  console.log('|request| export async function requestAFE', context, opts);
}

function getBaseUrl(context: ContextOptions): string {
  let baseUrl = context.baseUrl;
  const prefix = context.urlPrefix || 'frontegg';
  // Append everything we need to the base url
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  if (!baseUrl.endsWith(prefix)) {
    baseUrl += prefix;
  }
  return baseUrl;
}

async function prepareUrl(context: ContextOptions, url: string, params?: any): Promise<string> {
  console.log('prepareUrl.getBaseUrl');
  const baseUrl = await getBaseUrl(context);
  console.log('prepareUrl.buildQueryParams');
  const paramsToSend = await buildQueryParams(context, params);

  let finalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const hasKeys = Object.keys(paramsToSend).length > 0;
  if (paramsToSend && hasKeys) {
    const urlParams = new URLSearchParams(paramsToSend);
    finalUrl += `?${urlParams}`;
  }

  return finalUrl;
}

async function buildRequestHeaders(
  context: ContextOptions,
  contentType: string = 'application/json'
): Promise<Record<string, string>> {
  console.log(
    'buildRequestHeaders.tokenResolver',
    context,
    contentType,
    ContextHolder.getContext(),
    ContextHolder.getAccessToken()
  );
  let authToken;
  if (context.tokenResolver) {
    authToken = await context.tokenResolver();
  } else {
    authToken = ContextHolder.getAccessToken();
  }
  const headers: Record<string, string> = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  for (const additionalHeader of await getAdditionalHeaders(context)) {
    headers[`${additionalHeader.key}`] = `${additionalHeader.value}`;
  }
  headers['x-frontegg-source'] = 'frontegg-react';
  return headers;
}

async function buildQueryParams(context: ContextOptions, params?: any) {
  if (!params) {
    params = {};
  }

  const additionalQueryParams = await getAdditionalQueryParams(context);
  for (const queryParam of additionalQueryParams) {
    params[queryParam.key] = queryParam.value;
  }

  const keys = Object.keys(params);
  for (const key of keys) {
    const value = params[key];
    params[key] = typeof value === 'object' ? JSON.stringify(value) : value;
  }

  return params;
}

async function getAdditionalQueryParams(context: ContextOptions): Promise<KeyValuePair[]> {
  let output: KeyValuePair[] = [];
  if (context.additionalQueryParamsResolver) {
    output = await context.additionalQueryParamsResolver();
  }
  return output;
}

async function getAdditionalHeaders(context: ContextOptions): Promise<KeyValuePair[]> {
  let output: KeyValuePair[] = [];
  if (context.additionalHeadersResolver) {
    output = await context.additionalHeadersResolver();
  }
  return output;
}

export const Get = async (context: ContextOptions, url: string, params?: any, responseType?: any) =>
  request(context, {
    url,
    method: 'GET',
    params,
    responseType,
  });

export const Post = async (context: ContextOptions, url: string, body?: any, params?: any, responseType?: any) => {
  const options: RequestOptions = {
    url,
    method: 'POST',
    contentType: 'application/json',
    body,
    params,
    responseType,
  };
  let res;
  res = await requestE(context, options);
  console.log('requestE.res', res);
  res = await requestAF(context, options);
  console.log('requestAF.res', res);
  res = await requestAFE(context, options);
  console.log('requestAFE.res', res);
  res = await request(context, options);
  console.log('request.res', res);
  return res;
};

export const Patch = async (context: ContextOptions, url: string, body?: any, params?: any, responseType?: any) =>
  request(context, {
    url,
    method: 'PATCH',
    contentType: 'application/json',
    body,
    params,
    responseType,
  });

export const Put = async (context: ContextOptions, url: string, body?: any, params?: any, responseType?: any) =>
  request(context, {
    url,
    method: 'PUT',
    contentType: 'application/json',
    body,
    params,
    responseType,
  });

export const Delete = async (context: ContextOptions, url: string, body?: any, params?: any, responseType?: any) =>
  request(context, {
    url,
    method: 'DELETE',
    contentType: 'application/json',
    body,
    params,
    responseType,
  });

export const Download = async (context: ContextOptions, url: string, body?: any, params?: any) =>
  request(context, {
    url,
    method: 'POST',
    contentType: 'application/json',
    body,
    params,
    responseType: 'blob',
  });
