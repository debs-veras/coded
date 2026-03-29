export interface Class {
  id: string;
  name: string;
  description: string;
  teacher: { id: string; name: string; email: string };
  students?: string[];
  created_at?: string;
  updated_at?: string;
  teacher_name?: string;
  total_students?: number;
}

export type CreateClassInput = {
  name: string;
  description?: string;
  teacher: string | number;
};

export type UpdateClassInput = Partial<CreateClassInput>;

export type SearchClassParams = {
  name?: string;
  teacher?: string;
  page?: number;
  limit?: number;
};

export type SearchClassResponse = {
  data: Class[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
