import z, { email } from "zod";

export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be atleast 8 characters').max(16, 'Password must be at most 16 characters long')
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be atleast 8 characters').max(16, 'Password must be at most 16 characters long'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;