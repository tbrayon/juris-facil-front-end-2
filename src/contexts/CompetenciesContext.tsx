import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const competenceSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),

    // System fields
    active: z.boolean(),
});

export type Competence = z.infer<typeof competenceSchema>;
export type CompetenceInput = Omit<Competence, "id">;

// ------------------------
// API Functions
// ------------------------
async function fetchCompetencies(): Promise<Competence[]> {
    try {
        const { data } = await api.get("/competencies");

        return z.array(competenceSchema).parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function createCompetence(competence: CompetenceInput) {
    try {
        const { data } = await api.post("/competencies", competence);
        return competenceSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function updateCompetence(id: string, competence: CompetenceInput) {
    try {
        const { data } = await api.patch(`/competencies/${id}`, competence);
        return competenceSchema.parse(data);
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
export interface CompetenciesContextType {
    competencies: Competence[];
    loading: boolean;
    error: unknown;
    addCompetenceMutation: ReturnType<typeof useMutation<Competence, unknown, CompetenceInput>>;
    updateCompetenceMutation: ReturnType<typeof useMutation<Competence, unknown, { id: string, competence: CompetenceInput }>>;
}

// ------------------------
// Context
// ------------------------
const CompetenciesContext = createContext<CompetenciesContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function CompetenciesProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: competencies = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["competencies"],
        queryFn: fetchCompetencies,
    });

    const addCompetenceMutation = useMutation({
        mutationFn: createCompetence,
        onSuccess: () => {
            toast.success("Competência cadastrada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["competencies"] });
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar competência.");
            console.log(error);
        },
    });

    const updateCompetenceMutation = useMutation({
        mutationFn: ({ id, competence }: { id: string; competence: CompetenceInput }) =>
            updateCompetence(id, competence),
        onSuccess: () => {
            toast.success("Competência atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["competencies"] });
        },
        onError: () => {
            toast.error("Erro ao atualizar competência.");
        },
    });

    return (
        <CompetenciesContext.Provider
            value={{
                competencies,
                loading,
                error,
                addCompetenceMutation,
                updateCompetenceMutation,
            }}
        >
            {children}
        </CompetenciesContext.Provider>
    );
}

// ------------------------
// Hook
// ------------------------
export function useCompetencies() {
    const context = useContext(CompetenciesContext);
    if (!context)
        throw new Error("useCompetencies must be used within a ClientsProvider");
    return context;
}

