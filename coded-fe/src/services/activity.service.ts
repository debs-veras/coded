import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  type ApiResponse,
} from '../utils/axiosRequest';
import type {
  Activity,
  StudentResponse,
  SearchActivityResponse,
  SearchResponseResponse,
  SearchActivityParams,
  SearchStudentResponseParams,
} from '../types/activity';
import type { StudentDashboardData } from '../types/dashboard';

export async function getTeacherActivities(
  params: SearchActivityParams
): Promise<ApiResponse<SearchActivityResponse>> {
  const query = new URLSearchParams();
  if (params.title) query.append('title', params.title);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined) query.append('limit', params.limit.toString());

  const queryString = query.toString();
  const url = `/me/atividades${queryString ? `?${queryString}` : ''}`;
  return getRequest<SearchActivityResponse>(url);
}

export async function getActivityById(
  id: number | string
): Promise<ApiResponse<Activity>> {
  return getRequest<Activity>(`/atividades/${id}`);
}

export async function createActivity(
  data: Partial<Activity>
): Promise<ApiResponse<Activity>> {
  return postRequest<Activity>('/atividades', data);
}

export async function updateActivity(
  id: number | string,
  data: Partial<Activity>
): Promise<ApiResponse<Activity>> {
  return patchRequest<Activity>(`/atividades/${id}`, data);
}

export async function deleteActivity(
  id: number | string
): Promise<ApiResponse<null>> {
  return deleteRequest<null>(`/atividades/${id}`);
}

export async function getActivityResponses(
  activityId: number | string,
  params: SearchStudentResponseParams = {}
): Promise<ApiResponse<SearchResponseResponse>> {
  const query = new URLSearchParams();
  if (params.student_name) query.append('student_name', params.student_name);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined)
    query.append('limit', params.limit.toString());

  const queryString = query.toString();
  const url = `/atividades/${activityId}/respostas${
    queryString ? `?${queryString}` : ''
  }`;
  return getRequest<SearchResponseResponse>(url);
}

export async function gradeResponse(
  responseId: number | string,
  data: { score: number; feedback: string }
): Promise<ApiResponse<StudentResponse>> {
  return patchRequest<StudentResponse>(`/respostas/${responseId}`, data);
}

export async function getStudentActivities(
  params: SearchActivityParams
): Promise<ApiResponse<SearchActivityResponse>> {
  const query = new URLSearchParams();
  if (params.title) query.append('title', params.title);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined)
    query.append('limit', params.limit.toString());

  const queryString = query.toString();
  const url = `/me/atividades${queryString ? `?${queryString}` : ''}`;
  return getRequest<SearchActivityResponse>(url);
}

export async function getStudentResponses(
  params: SearchStudentResponseParams = {}
): Promise<ApiResponse<SearchResponseResponse>> {
  const query = new URLSearchParams();
  if (params.title) query.append('title', params.title);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.limit !== undefined) query.append('limit', params.limit.toString());

  const queryString = query.toString();
  const url = `/me/respostas${queryString ? `?${queryString}` : ''}`;
  return getRequest<SearchResponseResponse>(url);
}

export async function submitResponse(data: {
  activity: number;
  content: string;
}): Promise<ApiResponse<StudentResponse>> {
  return postRequest<StudentResponse>('/respostas', data);
}

export async function updateResponse(
  responseId: number | string,
  data: { content: string }
): Promise<ApiResponse<StudentResponse>> {
  return patchRequest<StudentResponse>(`/respostas/${responseId}`, data);
}

export async function getStudentDashboard(): Promise<
  ApiResponse<StudentDashboardData>
> {
  return getRequest<StudentDashboardData>('/users/dashboard');
}
