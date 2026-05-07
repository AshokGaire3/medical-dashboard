import { api } from './client';
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from '../types';

export const authApi = {
 login: (body: LoginInput) => api.post<AuthResponse>('/auth/login', body, { skipAuth: true }),
 register: (body: RegisterInput) =>
 api.post<AuthResponse>('/auth/register', body, { skipAuth: true }),
 me: () => api.get<AuthUser>('/auth/me'),
};
