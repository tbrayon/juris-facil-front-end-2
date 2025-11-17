import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const statusSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),

    // System fields
    active: z.boolean(),
});

export type Status = z.infer<typeof statusSchema>;
export type StatusInput = Omit<Status, "id">;

// ------------------------
// API Functions
// ------------------------
async function fetchStatus(): Promise<Status[]> {
    try {
        const { data } = await api.get("/status");

        return z.array(statusSchema).parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function createStatus(status: StatusInput) {
    try {
        const { data } = await api.post("/status", status);
        return statusSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function updateStatus(id: string, status: StatusInput) {
    try {
        const { data } = await api.patch(`/status/${id}`, status);
        return statusSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}


// ------------------------
// Context Type
// ------------------------
export interface StatusContextType {
    status: Status[];
    loading: boolean;
    error: unknown;
    addStatusMutation: ReturnType<typeof useMutation<Status, unknown, StatusInput>>;
    updateStatusMutation: ReturnType<typeof useMutation<Status, unknown, { id: string, status: StatusInput }>>;
}

// ------------------------
// Context
// ------------------------
const StatusContext = createContext<StatusContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function StatusProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: status = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["status"],
        queryFn: fetchStatus,
    });

    const addStatusMutation = useMutation({
        mutationFn: createStatus,
        onSuccess: () => {
            toast.success("Status cadastrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["status"] });
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar status.");
            console.log(error);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: StatusInput }) =>
            updateStatus(id, status),
        onSuccess: () => {
            toast.success("Status atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["status"] });
        },
        onError: () => {
            toast.error("Erro ao atualizar status.");
        },
    });

    return (
        <StatusContext.Provider
            value={{
                status,
                loading,
                error,
                addStatusMutation,
                updateStatusMutation,
            }}
        >
            {children}
        </StatusContext.Provider>
    );
}

// ------------------------
// Hook
// ------------------------
export function useStatus() {
    const context = useContext(StatusContext);
    if (!context)
        throw new Error("useStatus must be used within a ClientsProvider");
    return context;
}

