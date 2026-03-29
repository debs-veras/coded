import type { User } from "./user";

export type LoginPayload = {
  email: string;
  password: string;
};


export type LoginData = User & {
  access: string;
  refresh?: string;
};