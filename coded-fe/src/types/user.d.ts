export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  class_group?: string | number | null;
  birth_date: string | null;
  cpf: string | null;
  date_joined: string;
  last_login: string;
  updated_at: string;
  address?: {
    cep: string | null;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    localidade: string | null;
    uf: string | null;
  };
}

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type CreateUserInput = Omit<User, "id" | "date_joined" | "last_login" | "updated_at"> & {
  password?: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export type SearchUserParams = {
  name?: string;
  email?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT" | "";
  page?: number;
  limit?: number;
};

export type SearchUserResponse = {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
