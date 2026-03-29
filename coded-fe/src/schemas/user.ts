import { z } from 'zod';
export const RoleEnum = z.enum(['STUDENT', 'ADMIN', 'TEACHER']);

export const userSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'Senha deve ter no mínimo 6 caracteres')
      .optional(),
    password_confirm: z.string().min(6, 'Confirme sua nova senha').optional(),
    role: RoleEnum,
    phone: z.string().nullable().optional(),
    birth_date: z.string().nullable().optional(),
    cpf: z
      .string()
      .min(11, 'CPF deve ter 11 dígitos')
      .max(14, 'CPF muito longo')
      .nullable()
      .optional(),
    address: z
      .object({
        cep: z.string().nullable().optional(),
        logradouro: z.string().nullable().optional(),
        numero: z.string().nullable().optional(),
        bairro: z.string().nullable().optional(),
        localidade: z.string().nullable().optional(),
        uf: z.string().nullable().optional(),
      })
      .optional(),
    class_group: z.union([z.string(), z.number()]).nullable().optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'As senhas não coincidem',
    path: ['password_confirm'],
  })
  .refine(
    (data) => {
      if (data.role === 'STUDENT' && !data.class_group) {
        return false;
      }
      return true;
    },
    {
      message: 'Selecione uma turma',
      path: ['class_group'],
    }
  );
