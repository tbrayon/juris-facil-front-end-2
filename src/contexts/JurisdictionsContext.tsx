import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const jurisdictionSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),

    // System fields
    active: z.boolean(),
});

export type Jurisdiction = z.infer<typeof jurisdictionSchema>;
export type JurisdictionInput = Omit<Jurisdiction, "id">;

// ------------------------
// API Functions
// ------------------------
async function fetchJurisdictions(): Promise<Jurisdiction[]> {
    try {
        const { data } = await api.get("/jurisdictions");

        return z.array(jurisdictionSchema).parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function createJurisdiction(jurisdiction: JurisdictionInput) {
    try {
        const { data } = await api.post("/jurisdictions", jurisdiction);
        return jurisdictionSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function updateJurisdiction(id: string, jurisdiction: JurisdictionInput) {
    try {
        const { data } = await api.patch(`/jurisdictions/${id}`, jurisdiction);
        return jurisdictionSchema.parse(data);
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
export interface JurisdictionsContextType {
    jurisdictions: Jurisdiction[];
    loading: boolean;
    error: unknown;
    addJurisdictionMutation: ReturnType<typeof useMutation<Jurisdiction, unknown, JurisdictionInput>>;
    updateJurisdictionMutation: ReturnType<typeof useMutation<Jurisdiction, unknown, { id: string, jurisdiction: JurisdictionInput }>>;
}

// ------------------------
// Context
// ------------------------
const JurisdictionsContext = createContext<JurisdictionsContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function JurisdictionsProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: jurisdictions = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["jurisdictions"],
        queryFn: fetchJurisdictions,
    });

    const addJurisdictionMutation = useMutation({
        mutationFn: createJurisdiction,
        onSuccess: () => {
            toast.success("Jurisdição cadastrada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["jurisdictions"] });
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar jurisdição.");
            console.log(error);
        },
    });

    const updateJurisdictionMutation = useMutation({
        mutationFn: ({ id, jurisdiction }: { id: string; jurisdiction: JurisdictionInput }) =>
            updateJurisdiction(id, jurisdiction),
        onSuccess: () => {
            toast.success("Jurisdição atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["jurisdictions"] });
        },
        onError: () => {
            toast.error("Erro ao atualizar jurisdição.");
        },
    });

    return (
        <JurisdictionsContext.Provider
            value={{
                jurisdictions,
                loading,
                error,
                addJurisdictionMutation,
                updateJurisdictionMutation,
            }}
        >
            {children}
        </JurisdictionsContext.Provider>
    );
}

// ------------------------
// Hook
// ------------------------
export function useJurisdictions() {
    const context = useContext(JurisdictionsContext);
    if (!context)
        throw new Error("useJurisdictions must be used within a ClientsProvider");
    return context;
}

