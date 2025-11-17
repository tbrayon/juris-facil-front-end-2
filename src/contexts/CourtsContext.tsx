import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const courtSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),
    courtType: z.uuid(),

    // System fields
    active: z.boolean(),
});

export type Court = z.infer<typeof courtSchema>;
export type CourtInput = Omit<Court, "id">;

// ------------------------
// API Functions
// ------------------------
async function fetchCourts(): Promise<Court[]> {
    try {
        const { data } = await api.get("/courts");

        return z.array(courtSchema).parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function createCourt(court: CourtInput) {
    try {
        const { data } = await api.post("/courts", court);
        return courtSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function updateCourt(id: string, court: CourtInput) {
    try {
        const { data } = await api.patch(`/courts/${id}`, court);
        return courtSchema.parse(data);
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
export interface CourtsContextType {
    courts: Court[];
    loading: boolean;
    error: unknown;
    addCourtMutation: ReturnType<typeof useMutation<Court, unknown, CourtInput>>;
    updateCourtMutation: ReturnType<typeof useMutation<Court, unknown, { id: string, court: CourtInput }>>;
}

// ------------------------
// Context
// ------------------------
const CourtsContext = createContext<CourtsContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function CourtsProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: courts = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["courts"],
        queryFn: fetchCourts,
    });

    const addCourtMutation = useMutation({
        mutationFn: createCourt,
        onSuccess: () => {
            toast.success("Tribunal cadastrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["courts"] });
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar estágio processual.");
            console.log(error);
        },
    });

    const updateCourtMutation = useMutation({
        mutationFn: ({ id, court }: { id: string; court: CourtInput }) =>
            updateCourt(id, court),
        onSuccess: () => {
            toast.success("Tribunal atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["courts"] });
        },
        onError: () => {
            toast.error("Erro ao atualizar estágio processual.");
        },
    });

    return (
        <CourtsContext.Provider
            value={{
                courts,
                loading,
                error,
                addCourtMutation,
                updateCourtMutation,
            }}
        >
            {children}
        </CourtsContext.Provider>
    );
}

// ------------------------
// Hook
// ------------------------
export function useCourts() {
    const context = useContext(CourtsContext);
    if (!context)
        throw new Error("useCourts must be used within a ClientsProvider");
    return context;
}

