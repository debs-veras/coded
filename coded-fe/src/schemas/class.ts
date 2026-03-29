import { z } from 'zod';

export const classSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres').optional(),
  teacher: z.union([z.string(), z.number()]),
});

export type ClassFormType = z.infer<typeof classSchema>;
