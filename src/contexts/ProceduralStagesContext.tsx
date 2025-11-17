import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const proceduralStageSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),

    // System fields
    active: z.boolean(),
});

export type ProceduralStage = z.infer<typeof proceduralStageSchema>;
export type ProceduralStageInput = Omit<ProceduralStage, "id">;

// ------------------------
// API Functions
// ------------------------
async function fetchProceduralStages(): Promise<ProceduralStage[]> {
    try {
        const { data } = await api.get("/proceduralStages");

        return z.array(proceduralStageSchema).parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function createProceduralStage(proceduralStage: ProceduralStageInput) {
    try {
        const { data } = await api.post("/proceduralStages", proceduralStage);
        return proceduralStageSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function updateProceduralStage(id: string, proceduralStage: ProceduralStageInput) {
    try {
        const { data } = await api.patch(`/proceduralStages/${id}`, proceduralStage);
        return proceduralStageSchema.parse(data);
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
export interface ProceduralStagesContextType {
    proceduralStages: ProceduralStage[];
    loading: boolean;
    error: unknown;
    addProceduralStageMutation: ReturnType<typeof useMutation<ProceduralStage, unknown, ProceduralStageInput>>;
    updateProceduralStageMutation: ReturnType<typeof useMutation<ProceduralStage, unknown, { id: string, proceduralStage: ProceduralStageInput }>>;
}

// ------------------------
// Context
// ------------------------
const ProceduralStagesContext = createContext<ProceduralStagesContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function ProceduralStagesProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: proceduralStages = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["proceduralStages"],
        queryFn: fetchProceduralStages,
    });

    const addProceduralStageMutation = useMutation({
        mutationFn: createProceduralStage,
        onSuccess: () => {
            toast.success("Estágio processual cadastrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["proceduralStages"] });
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar estágio processual.");
            console.log(error);
        },
    });

    const updateProceduralStageMutation = useMutation({
        mutationFn: ({ id, proceduralStage }: { id: string; proceduralStage: ProceduralStageInput }) =>
            updateProceduralStage(id, proceduralStage),
        onSuccess: () => {
            toast.success("Estágio processual atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["proceduralStages"] });
        },
        onError: () => {
            toast.error("Erro ao atualizar estágio processual.");
        },
    });

    return (
        <ProceduralStagesContext.Provider
            value={{
                proceduralStages,
                loading,
                error,
                addProceduralStageMutation,
                updateProceduralStageMutation,
            }}
        >
            {children}
        </ProceduralStagesContext.Provider>
    );
}

// ------------------------
// Hook
// ------------------------
export function useProceduralStages() {
    const context = useContext(ProceduralStagesContext);
    if (!context)
        throw new Error("useProceduralStages must be used within a ClientsProvider");
    return context;
}

