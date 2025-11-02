import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from "../api/axios";
import axios from 'axios';

// ------------------------
// Zod Schemas
// ------------------------
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  username: z.string(),
  role: z.uuid(),
  phone: z.string().optional(),
  active: z.boolean(),
  createdAt: z.string(),
});

export const CurrentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type NewUserInput = Omit<User, 'id' | 'createdAt'>;

// ------------------------
// Context Type
// ------------------------
export interface UsersContextType {
  users: User[];
  loading: boolean;
  error: unknown;
  addUserMutation: ReturnType<typeof useMutation<User, unknown, NewUserInput>>;
  updateUserMutation: ReturnType<typeof useMutation<User, unknown, { id: string; user: NewUserInput }>>;
  activateUserMutation: ReturnType<typeof useMutation<User, unknown, string>>;
  deactivateUserMutation: ReturnType<typeof useMutation<User, unknown, string>>;
  authenticateMutation: ReturnType<typeof useMutation<User | null, unknown, { email: string; password: string }>>;
  logoutMutation: ReturnType<typeof useMutation<void, unknown, void>>;
  currentUser: CurrentUser | null;
}

// ------------------------
// Context
// ------------------------
const UsersContext = createContext<UsersContextType | undefined>(undefined);

// ------------------------
// API Functions
// ------------------------
async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get('/users');
  return z.array(UserSchema).parse(data);
}

async function createUser(user: NewUserInput) {
  const { data } = await api.post('/users', user);
  return UserSchema.parse(data);
}

async function updateUser(id: string, user: NewUserInput) {
  const { data } = await api.patch(`/users/${id}`, user);
  return UserSchema.parse(data);
}

async function activateUser(id: string) {
  const { data } = await api.patch(`/users/${id}/activate`);
  return UserSchema.parse(data);
}

async function deactivateUser(id: string) {
  const { data } = await api.patch(`/users/${id}/deactivate`);
  return UserSchema.parse(data);
}

async function authenticateUser(email: string, password: string) {
  try {
    const { data } = await api.post('/login', { email, password });
    return CurrentUserSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const { data } = await api.get('/user');

    return CurrentUserSchema.parse(data);
  } catch {
    return null;
  }
}

async function logoutUser() {
  await api.post('/logout');
}

// ------------------------
// Provider
// ------------------------
export function UsersProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Queries
  const { data: users = [], isLoading, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const { data: currentUser } = useQuery({ queryKey: ['currentUser'], queryFn: fetchCurrentUser });

  // Mutations
  const addUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: NewUserInput }) => updateUser(id, user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const activateUserMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deactivateUserMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const authenticateMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authenticateUser(email, password),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
  });

  return (
    <UsersContext.Provider
      value={{
        users,
        loading: isLoading,
        error,
        addUserMutation,
        updateUserMutation,
        activateUserMutation,
        deactivateUserMutation,
        authenticateMutation,
        logoutMutation,
        currentUser: currentUser || null,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

// ------------------------
// Hook
// ------------------------
export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) throw new Error('useUsers must be used within a UsersProvider');
  return context;
}
