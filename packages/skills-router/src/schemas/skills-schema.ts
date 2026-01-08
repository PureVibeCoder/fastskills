import { z } from 'zod';

export const SkillMetaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  source: z.string(),
  triggers: z.array(z.string()),
  path: z.string(),
  fullDescription: z.string().optional(),
});

export const SkillsIndexSchema = z.array(SkillMetaSchema);

export type SkillMetaValidated = z.infer<typeof SkillMetaSchema>;

export function validateSkillsIndex(data: unknown): SkillMetaValidated[] {
  return SkillsIndexSchema.parse(data);
}

export function safeValidateSkillsIndex(data: unknown): { 
  success: true; 
  data: SkillMetaValidated[]; 
} | { 
  success: false; 
  error: z.ZodError; 
} {
  const result = SkillsIndexSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
