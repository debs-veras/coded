import type { UserRole } from "../types/user";


export const translateRole = (role: UserRole | string): string => {
  const roles: Record<string, string> = {
    ADMIN: "Administrador",
    TEACHER: "Professor",
    STUDENT: "Aluno",
  };

  return roles[role] || role;
};

export const getRoleBadgeStyles = (role: UserRole | string) => {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    ADMIN: {
      bg: "bg-purple-100 dark:bg-purple-500/10",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-500/20",
    },
    TEACHER: {
      bg: "bg-blue-100 dark:bg-blue-500/10",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/20",
    },
    STUDENT: {
      bg: "bg-green-100 dark:bg-green-500/10",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-200 dark:border-green-500/20",
    },
  };

  return (
    styles[role] || {
      bg: "bg-gray-100 dark:bg-gray-500/10",
      text: "text-gray-700 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-500/20",
    }
  );
};

export const getDashboardPath = (role: UserRole | string): string => {
  const paths: Record<string, string> = {
    ADMIN: "/users",
    TEACHER: "/atividades",
    STUDENT: "/dashboard",
  };

  return paths[role] || "/";
};
