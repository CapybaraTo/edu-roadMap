import Cookies from 'js-cookie';
// import fp from '@fingerprintjs/fingerprintjs';   // 生成客户端的唯一指纹
import { TOKEN_COOKIE_NAME, removeAuthToken } from './jwt';

type HttpOptionsType = RequestInit | { headers: Record<string, any> };

type AppResponse = Record<string, any>;

// 错误对象的类型
export type FetchError = {
  status: number;
  message: string;
};

// 错误对象的类型
export type AppError = {
  status: number;
  message: string;
  errors?: { message: string; location: string }[];
};

type ApiReturn<ResponseType, ErrorType> = {
  response?: ResponseType;
  error?: ErrorType | FetchError;
};

/**
 * Wrapper around fetch to make it easy to handle errors
 *
 * @param url
 * @param options
 */
// 一个泛型异步函数，用于封装 fetch 请求，并处理响应和错误
export async function httpCall<
  ResponseType = AppResponse,
  ErrorType = AppError,
>(
  url: string,
  options?: HttpOptionsType,
): Promise<ApiReturn<ResponseType, ErrorType>> {
  let statusCode: number = 0;
  try {
    // const fingerprintPromise = await fp.load();
    // const fingerprint = await fingerprintPromise.get();

    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get(TOKEN_COOKIE_NAME)}`,
        // fp: fingerprint.visitorId,
        ...(options?.headers ?? {}),
      }),
    });
    statusCode = response.status;

    // @ts-ignore
    const doesAcceptHtml = options?.headers?.['Accept'] === 'text/html';

    const data = doesAcceptHtml ? await response.text() : await response.json();

    if (response.ok) {
      return {
        response: data as ResponseType,
        error: undefined,
      };
    }

    // Logout user if token is invalid
    // 如果响应状态码为 401，调用 removeAuthToken 来清除认证令牌，并刷新页面。
    // 如果响应状态码为 403，可以重定向到账户页面或返回错误（代码中被注释掉了）
    if (data.status === 401) {
      removeAuthToken();
      window.location.reload();
      return { response: undefined, error: data as ErrorType };
    }

    if (data.status === 403) {
      // window.location.href = '/account'; // @fixme redirect option should be configurable
      return { response: undefined, error: data as ErrorType };
    }

    return {
      response: undefined,
      error: data as ErrorType,
    };
  } catch (error: any) {
    return {
      response: undefined,
      error: {
        status: statusCode,
        message: error.message,
      },
    };
  }
}

// 一个泛型异步函数，用于发起 POST 请求。
export async function httpPost<
  ResponseType = AppResponse,
  ErrorType = AppError,
>(
  url: string,
  body: Record<string, any>,
  options?: HttpOptionsType,
): Promise<ApiReturn<ResponseType, ErrorType>> {
  return httpCall<ResponseType, ErrorType>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// 一个泛型异步函数，用于发起 GET 请求。
export async function httpGet<ResponseType = AppResponse, ErrorType = AppError>(
  url: string,
  queryParams?: Record<string, any>,
  options?: HttpOptionsType,
): Promise<ApiReturn<ResponseType, ErrorType>> {
  const searchParams = new URLSearchParams(queryParams).toString();
  const queryUrl = searchParams ? `${url}?${searchParams}` : url;

  return httpCall<ResponseType, ErrorType>(queryUrl, {
    credentials: 'include',
    method: 'GET',
    ...options,
  });
}

// 类似于 httpPost，但设置请求方法为 'PATCH'。
export async function httpPatch<
  ResponseType = AppResponse,
  ErrorType = AppError,
>(
  url: string,
  body: Record<string, any>,
  options?: HttpOptionsType,
): Promise<ApiReturn<ResponseType, ErrorType>> {
  return httpCall<ResponseType, ErrorType>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// 类似于 httpPost，但设置请求方法为 'PUT'。
export async function httpPut<ResponseType = AppResponse, ErrorType = AppError>(
  url: string,
  body: Record<string, any>,
  options?: HttpOptionsType,
): Promise<ApiReturn<ResponseType, ErrorType>> {
  return httpCall<ResponseType, ErrorType>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// 用于发起 DELETE 请求   使用 httpCall 函数，并设置请求方法为 'DELETE'  
export async function httpDelete<
  ResponseType = AppResponse,
  ErrorType = AppError,
>(
  url: string,
  options?: HttpOptionsType,
): Promise<ApiReturn<ResponseType, ErrorType>> {
  return httpCall<ResponseType, ErrorType>(url, {
    ...options,
    method: 'DELETE',
  });
}
