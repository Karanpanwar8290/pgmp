import { z } from 'zod';

export const GoalSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  completed: z.boolean().default(false),
  createdAt: z.any().optional(),
});

export type Goal = z.infer<typeof GoalSchema>;
