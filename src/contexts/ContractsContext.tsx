import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/api/axios";
import axios from "axios";

export const ContractSchema = z.object({
  id: z.uuid(),

  process: z.uuid(),

  contractNumber: z.string().nullable(),
  contractValue: z.string().nullable(),
  contractPercentage: z.string().nullable(),
  attorneyFees: z.string().nullable(),
  sucumbencyFees: z.string().nullable(),

  amountToReceive: z.string().nullable(),
  dueDate: z.string().nullable(),
  paymentMethod: z.string().nullable(),
  financialStatus: z.string().nullable(),
  installmentsNumber: z.string().nullable(),
  paymentDate: z.string().nullable(),

  contractTemplate: z.string().nullable(),

  lastUpdatedBy: z.uuid(),
  lastUpdatedAt: z.string(),
  createdBy: z.uuid(),
  createdAt: z.string(),
});

export type Contract = z.infer<typeof ContractSchema>
export type ContractInput = Omit<Contract, "id" | "createdAt" | "createdBy" | "lastUpdatedAt" | "lastUpdatedBy">;


// ------------------------
// API Functions
// ------------------------
async function fetchContracts(): Promise<Contract[]> {
  try {
    const { data } = await api.get("/contracts");

    return z.array(ContractSchema).parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

async function createContract(contract: ContractInput) {
  try {
    const { data } = await api.post("/contracts", contract);
    return ContractSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || new Error('Erro de servidor. Por favor, tente novamente mais tarde!');
    }

    throw error;
  }
}

async function updateContract(id: string, contract: ContractInput) {
  try {
    const { data } = await api.patch(`/contracts/${id}`, contract);
    return ContractSchema.parse(data);
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
export interface ContractsContextType {
  contracts: Contract[];
  loading: boolean;
  error: unknown;
  addContractMutation: ReturnType<typeof useMutation<Contract, unknown, ContractInput>>;
  updateContractMutation: ReturnType<typeof useMutation<Contract, unknown, { id: string, contract: ContractInput }>>;
}

// ------------------------
// Context
// ------------------------
const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

// ------------------------
// Provider
// ------------------------
export function ContractsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: contracts = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });

  const addContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      toast.success("Contrato cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar contracto.");
      console.log(error);
    },
  });

  const updateContractMutation = useMutation({
    mutationFn: ({ id, contract }: { id: string; contract: ContractInput }) =>
      updateContract(id, contract),
    onSuccess: () => {
      toast.success("Contrato atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar contrato.");
    },
  });

  return (
    <ContractsContext.Provider
      value={{
        contracts,
        loading,
        error,
        addContractMutation,
        updateContractMutation,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
}

// ------------------------
// Hook
// ------------------------
export function useContracts() {
  const context = useContext(ContractsContext);
  if (!context)
    throw new Error("useContracts must be used within a ContractsProvider");
  return context;
}



