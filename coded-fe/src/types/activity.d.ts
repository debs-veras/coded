import { Class } from './class';
import { User } from './user';

export type Activity = {
  id: number;
  title: string;
  description: string;
  class_group: number;
  class?: Class;
  teacher_id?: number;
  teacher?: User | number;
  due_date: string;
  max_score?: string;
  status?: string;
  created_at: string;
};

export type StudentResponse = {
  id: number;
  activity: {
    id: number;
    title: string;
    max_score: string;
  };
  student: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    role: string;
  };
  content: string;
  score?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
};

export type SearchActivityResponse = {
  data: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SearchResponseResponse = {
  data: StudentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SearchActivityParams = {
  title?: string;
  page?: number;
  limit?: number;
};

export type SearchStudentResponseParams = {
  title?: string;
  student_name?: string;
  page?: number;
  limit?: number;
};
