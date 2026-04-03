import { LoginDto, RegisterDto } from "../schemas/auth.schemas";
import { api } from "./api";

export const authApi = {
    login: async (data: LoginDto) => {
        const res = await api.post<{ access_token: string }>('/auth/login', data);
        return res.data;
    },

    register: async (data: Omit<RegisterDto, 'confirmPassword'>) => {
        const res = await api.post('/user', data);
        return res.data;
    },
};