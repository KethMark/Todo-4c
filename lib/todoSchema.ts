import z from "zod";

export const todoSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  age: z
    .string()
    .min(1, { message: "Age is required" })
    .regex(/^\d+$/, { message: "Age must be a valid number" })
    .refine((val) => {
      const num = parseInt(val, 10);
      return num > 0 && num < 150;
    }, { 
      message: "Age must be between 1 and 149" 
    }),
  email: z.email(),
  gender: z.string().min(1, "Gender is required."),
  completed: z.boolean().optional(),
});

export type TodoSchema = z.infer<typeof todoSchema>;