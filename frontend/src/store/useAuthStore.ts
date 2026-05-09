import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'DEPT_ADMIN' | 'FACULTY' | 'STUDENT';
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

// Only persist the JWT token — NOT user data
const storedToken = localStorage.getItem('auth-token');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken,

  setAuth: (user, token) => {
    localStorage.setItem('auth-token', token); // store only the token
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (user) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('auth-token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
