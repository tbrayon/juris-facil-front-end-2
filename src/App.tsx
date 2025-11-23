import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Container from './components/Container';

import { UsersProvider } from './contexts/UsersContext';
import { ClientsProvider } from './contexts/ClientsContext';
import { ProcessosProvider } from './contexts/ProcessosContext';
import { Toaster } from './components/ui/sonner';
import { ClientesProvider } from './contexts/ClientesContext';
import { ProcessesProvider } from './contexts/ProcessesContext';
import { CompetenciesProvider } from './contexts/CompetenciesContext';
import { CourtsProvider } from './contexts/CourtsContext';
import { CourtTypesProvider } from './contexts/CourtTypesContext';
import { JurisdictionsProvider } from './contexts/JurisdictionsContext';
import { ProceduralStagesProvider } from './contexts/ProceduralStagesContext';
import { StatusProvider } from './contexts/StatusContext';
import { ContractsProvider } from './contexts/ContractsContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersProvider>
        <ClientesProvider>
          <ClientsProvider>
            <ProcessosProvider>
              <ProcessesProvider>
                <CompetenciesProvider>
                  <CourtsProvider>
                    <CourtTypesProvider>
                      <JurisdictionsProvider>
                        <ProceduralStagesProvider>
                          <StatusProvider>
                            <ContractsProvider>
                              <Toaster position="top-right" richColors />
                              <Container />
                            </ContractsProvider>
                          </StatusProvider>
                        </ProceduralStagesProvider>
                      </JurisdictionsProvider>
                    </CourtTypesProvider>
                  </CourtsProvider>
                </CompetenciesProvider>
              </ProcessesProvider>
            </ProcessosProvider>
          </ClientsProvider>
        </ClientesProvider>
      </UsersProvider>
    </QueryClientProvider>
  );
}

export default App;
