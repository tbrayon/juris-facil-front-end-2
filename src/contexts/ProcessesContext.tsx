import axios from "axios";
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@/api/axios";
import { clientSchema } from "./ClientsContext";

const RefSchema = z.object({
  id: z.uuid(),
  name: z.string(),
}).optional().nullable();

export const ProcessSchema = z.object({
  id: z.uuid(),
  client: clientSchema,

  processNumber: z.string().optional().nullable(), // numeroProcesso
  distributionDate: z.string().optional().nullable(), // dataDistribuicao
  responsibleAttorney: z.string().optional().nullable(), // advogadoResponsavel
  proceduralHub: z.string().optional().nullable(), // polo
  opposingParty: z.string().optional().nullable(), // parteContraria
  actionType: z.string().optional().nullable(), // tipoAcao
  actionObject: z.string().optional().nullable(), // objetoAcao
  claimValue: z.string().optional().nullable(), // valorCausa
  proceduralStage: RefSchema, // faseProcessual
  courtType: RefSchema, // tipo de tribunal
  court: RefSchema, // tribunal
  state: z.string().optional().nullable(),

  district: z.string().optional().nullable(), // comarca
  branch: z.string().optional().nullable(), // vara
  jurisdiction: RefSchema, // tipoJurisdicao
  competence: RefSchema, // competencia

  status: RefSchema,
  priority: z.string().optional().nullable(),
  nextDeadline: z.string().optional().nullable(), // proximoPrazo
  processLink: z.string().optional().nullable(), // linkProcesso
  processNotes: z.string().optional().nullable(), // observacoesProcesso

  createdAt: z.string(), // dataCadastro
  lastUpdatedAt: z.string(),
});

export const ProcessInputSchema = z.object({
  client: z.uuid(),

  processNumber: z.string().optional().nullable(), // numeroProcesso
  distributionDate: z.string().optional().nullable(), // dataDistribuicao
  responsibleAttorney: z.string().optional().nullable(), // advogadoResponsavel
  proceduralHub: z.string().optional().nullable(), // polo
  opposingParty: z.string().optional().nullable(), // parteContraria
  actionType: z.string().optional().nullable(), // tipoAcao
  actionObject: z.string().optional().nullable(), // objetoAcao
  claimValue: z.string().optional().nullable(), // valorCausa
  proceduralStage: z.uuid().optional().nullable(), // faseProcessual
  courtType: z.uuid().optional().nullable(), // tipo de tribunal
  court: z.uuid().optional().nullable(), // tribunal
  state: z.string().optional().nullable(),

  district: z.string().optional().nullable(), // comarca
  branch: z.string().optional().nullable(), // vara
  jurisdiction: z.string().optional().nullable(), // tipoJurisdicao
  competence: z.string().optional().nullable(), // competencia

  status: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
  nextDeadline: z.string().optional().nullable(), // proximoPrazo
  processLink: z.string().optional().nullable(), // linkProcesso
  processNotes: z.string().optional().nullable(), // observacoesProcesso
});

export const ExpenseSchema = z.object({
  id: z.uuid(),
  process: z.uuid(),

  amount: z.string().nullable(), // decimal → string
  purpose: z.string().nullable(),

  lastUpdatedBy: z.uuid(),
  lastUpdatedAt: z.string(),
  createdBy: z.uuid(),
  createdAt: z.string(),
});

export const NotificationSchema = z.object({
  id: z.uuid(),
  process: z.uuid(),

  type: z.string().nullable(),
  sentAt: z.string().nullable(),
  receivedAt: z.string().nullable(),
  notes: z.string().nullable(),

  lastUpdatedBy: z.uuid(),
  lastUpdatedAt: z.string(),
  createdBy: z.uuid(),
  createdAt: z.string(),
});

export const NoteSchema = z.object({
  id: z.uuid(),
  process: z.uuid(),

  content: z.string(),

  createdBy: z.uuid(),
  createdAt: z.string(),
});

export type Process = z.infer<typeof ProcessSchema>;
export type ProcessInput = z.infer<typeof ProcessInputSchema>;

export type Expense = z.infer<typeof ExpenseSchema>;
export type ExpenseInput = Omit<Process, "id" | "createdAt" | "createdBy" | "lastUpdatedAt" | "lastUpdatedBy">;

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationInput = Omit<Notification, "id" | "createdAt" | "createdBy" | "lastUpdatedAt" | "lastUpdatedBy">;

export type Note = z.infer<typeof NoteSchema>;
export type NoteInput = Omit<Note, "id" | "createdAt" | "createdBy" | "lastUpdatedAt" | "lastUpdatedBy">;

// ------------------------
// API Functions
// ------------------------
async function fetchProcesses(): Promise<Process[]> {
  try {
    const { data } = await api.get("/processes");

    return z.array(ProcessSchema).parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

interface CreateProcessInput {
  process: ProcessInput
}

async function createProcess({ process }: CreateProcessInput) {
  try {
    const { data } = await api.post("/processes", { process });

    return ProcessInputSchema.parse(data.process);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

interface UpdateProcessInput {
  process: ProcessInput
}

async function updateProcess(id: string, { process }: UpdateProcessInput) {
  try {
    const { data } = await api.patch(`/processes/${id}`, { process });

    return ProcessInputSchema.parse(data.process);
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
export interface ProcessesContextType {
  processes: Process[];
  loading: boolean;
  error: unknown;
  addProcessMutation: ReturnType<typeof useMutation<ProcessInput, unknown, CreateProcessInput>>;
  updateProcessMutation: ReturnType<typeof useMutation<ProcessInput, unknown, { id: string, data: UpdateProcessInput }>>;
}

// ------------------------
// Context
// ------------------------
const ProcessesContext = createContext<ProcessesContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function ProcessesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: processes = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["processes"],
    queryFn: fetchProcesses,
  });

  const addProcessMutation = useMutation({
    mutationFn: createProcess,
    onSuccess: () => {
      toast.success("Processo cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["processes"] });
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar processo.");
      console.log(error);
    },
  });

  const updateProcessMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessInput }) =>
      updateProcess(id, data),
    onSuccess: () => {
      toast.success("Processe atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["processes"] });
    },
    onError: (e) => {
      console.log(e);
      toast.error("Erro ao atualizar Processe.");
    },
  });

  return (
    <ProcessesContext.Provider
      value={{
        processes,
        loading,
        error,
        addProcessMutation,
        updateProcessMutation,
      }}
    >
      {children}
    </ProcessesContext.Provider>
  );
}

// ------------------------
// Hook
// ------------------------
export function useProcesses() {
  const context = useContext(ProcessesContext);
  if (!context)
    throw new Error("useProcesses must be used within a ProcessesProvider");
  return context;
}


