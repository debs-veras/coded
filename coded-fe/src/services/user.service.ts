import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  type ApiResponse,
} from "../utils/axiosRequest";
import type {
  CreateUserInput,
  SearchUserParams,
  SearchUserResponse,
  UpdateUserInput,
  User,
} from "../types/user";

export async function getAllUsers(
  params: SearchUserParams,
): Promise<ApiResponse<SearchUserResponse>> {
  const query = new URLSearchParams();

  if (params.name) query.append("name", params.name);
  if (params.email) query.append("email", params.email);
  if (params.role) query.append("role", params.role);
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined) query.append("limit", params.limit.toString());

  const queryString = query.toString();
  const url = `/users/${queryString ? `?${queryString}` : ""}`;

  return getRequest<SearchUserResponse>(url);
}

export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return getRequest<User>(`/users/${id}`);
}

export async function createUser(
  data: CreateUserInput,
): Promise<ApiResponse<User>> {
  return postRequest<User>("/users/", data);
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<ApiResponse<User>> {
  return putRequest<User>(`/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  return deleteRequest<null>(`/users/${id}`);
}
