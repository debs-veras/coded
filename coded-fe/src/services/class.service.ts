import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  type ApiResponse,
} from '../utils/axiosRequest';
import type {
  Class,
  CreateClassInput,
  SearchClassParams,
  SearchClassResponse,
  UpdateClassInput,
} from '../types/class';

export async function getAllClasses(
  params: SearchClassParams
): Promise<ApiResponse<SearchClassResponse>> {
  const query = new URLSearchParams();

  if (params.name) query.append('name', params.name);
  if (params.teacher) query.append('teacher', params.teacher);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined) query.append('limit', params.limit.toString());

  const queryString = query.toString();
  const url = `/classes/${queryString ? `?${queryString}` : ''}`;

  return getRequest<SearchClassResponse>(url);
}

export async function getClassById(id: string): Promise<ApiResponse<Class>> {
  return getRequest<Class>(`/classes/${id}`);
}

export async function createClass(data: CreateClassInput): Promise<ApiResponse<Class>> {
  return postRequest<Class>('/classes/', data);
}

export async function updateClass(
  id: string,
  data: UpdateClassInput
): Promise<ApiResponse<Class>> {
  return putRequest<Class>(`/classes/${id}`, data);
}

export async function deleteClass(id: string): Promise<ApiResponse<null>> {
  return deleteRequest<null>(`/classes/${id}`);
}
