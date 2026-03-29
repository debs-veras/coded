import getAxios from "../configAxios";
import type { TypeOptions } from "react-toastify";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  type?: TypeOptions | "loading" | "dismiss";
  error?: unknown;
};

function handleError(err: unknown): ApiResponse<never> {
  let message = "Erro na requisição";
  let error: unknown = err;

  if (typeof err === "object" && err !== null) {
    const maybeAxios = err as {
      response?: { data?: { message?: string; error?: unknown } };
    };
    message = maybeAxios?.response?.data?.message ?? message;
    error = maybeAxios?.response?.data?.error ?? err;
  }

  return { success: false, message, error, type: "error" };
}

export async function postRequest<T = unknown>(
  url: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  const axios = getAxios();
  try {
    const { data } = await axios.post<ApiResponse<T>>(url, body);
    const success = data.success ?? true;
    return { ...data, success, message: data.message, type: data.type ?? 'success' };
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function getRequest<T = unknown>( url: string ): Promise<ApiResponse<T>> {
  const axios = getAxios();
  try {
    const { data } = await axios.get<ApiResponse<T>>(url);
    const success = data.success ?? true;
    return { ...data, success, message: data.message, type: data.type ?? 'success' };
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function deleteRequest<T = unknown>( url: string, body?: unknown ): Promise<ApiResponse<T>> {
  const axios = getAxios();
  try {
    const { data } = await axios.delete<ApiResponse<T>>(url, { data: body });
    const success = data.success ?? true;
    return { ...data, success, message: data.message, type: data.type ?? 'success' };
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function putRequest<T = unknown>(
  url: string,
  body: unknown,
): Promise<ApiResponse<T>> {
  const axios = getAxios();
  try {
    const { data } = await axios.put<ApiResponse<T>>(url, body);
    const success = data.success ?? true;
    return { ...data, success, message: data.message, type: data.type ?? 'success' };
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function patchRequest<T = unknown>(
  url: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const axios = getAxios();
  try {
    const { data } = await axios.patch<ApiResponse<T>>(url, body);
    const success = data.success ?? true;
    return { ...data, success, message: data.message, type: data.type ?? 'success' };
  } catch (err: unknown) {
    return handleError(err);
  }
}
