import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

// ------------------------
// Zod Schema
// ------------------------
export const courtTypeSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),

    // System fields
    active: z.boolean(),
});

export type CourtType = z.infer<typeof courtTypeSchema>;
export type CourtTypeInput = Omit<CourtType, "id">;

// ------------------------
// API Functions
// ------------------------
async function fetchCourtTypes(): Promise<CourtType[]> {
    try {
        const { data } = await api.get("/courtTypes");

        return z.array(courtTypeSchema).parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function createCourtType(courtType: CourtTypeInput) {
    try {
        const { data } = await api.post("/courtTypes", courtType);
        return courtTypeSchema.parse(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
        }

        throw error;
    }
}

async function updateCourtType(id: string, courtType: CourtTypeInput) {
    try {
        const { data } = await api.patch(`/courtTypes/${id}`, courtType);
        return courtTypeSchema.parse(data);
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
export interface CourtTypesContextType {
    courtTypes: CourtType[];
    loading: boolean;
    error: unknown;
    addCourtTypeMutation: ReturnType<typeof useMutation<CourtType, unknown, CourtTypeInput>>;
    updateCourtTypeMutation: ReturnType<typeof useMutation<CourtType, unknown, { id: string, courtType: CourtTypeInput }>>;
}

// ------------------------
// Context
// ------------------------
const CourtTypesContext = createContext<CourtTypesContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function CourtTypesProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: courtTypes = [],
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["courtTypes"],
        queryFn: fetchCourtTypes,
    });

    const addCourtTypeMutation = useMutation({
        mutationFn: createCourtType,
        onSuccess: () => {
            toast.success("Tipo de tribunal cadastrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["courtTypes"] });
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar estágio processual.");
            console.log(error);
        },
    });

    const updateCourtTypeMutation = useMutation({
        mutationFn: ({ id, courtType }: { id: string; courtType: CourtTypeInput }) =>
            updateCourtType(id, courtType),
        onSuccess: () => {
            toast.success("Tipo de tribunal atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["courtTypes"] });
        },
        onError: () => {
            toast.error("Erro ao atualizar estágio processual.");
        },
    });

    return (
        <CourtTypesContext.Provider
            value={{
                courtTypes,
                loading,
                error,
                addCourtTypeMutation,
                updateCourtTypeMutation,
            }}
        >
            {children}
        </CourtTypesContext.Provider>
    );
}

// ------------------------
// Hook
// ------------------------
export function useCourtTypes() {
    const context = useContext(CourtTypesContext);
    if (!context)
        throw new Error("useCourtTypes must be used within a ClientsProvider");
    return context;
}

