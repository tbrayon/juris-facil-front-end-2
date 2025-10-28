// src/components/Sac.tsx

import React from 'react';
// Importe um ícone apropriado, como LifeBuoy (boia) ou MessageSquare (balão de mensagem)
import { LifeBuoy, MessageSquare } from 'lucide-react'; 

// URL do grupo do WhatsApp
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/BU1iRDPbpzSK2T4bu4mj30";

export function Sac() {
  return (
    // Container principal da página/seção de suporte
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-md border border-[#d4c4b0] max-w-2xl mx-auto mt-10"> 
      
      {/* Título da Seção */}
      <h2 className="text-2xl font-semibold text-[#2d1f16] mb-4 flex items-center">
        <LifeBuoy className="w-6 h-6 mr-3 text-[#a16535]" /> {/* Ícone no título */}
        Precisa de Suporte?
      </h2>

      {/* Mensagem principal */}
      <p className="text-[#4a3629] mb-6 text-base md:text-lg">
        Se você encontrar qualquer problema, tiver dúvidas ou precisar de ajuda com o sistema Juris Fácil, 
        não hesite em entrar em contato. Nossa equipe de suporte está disponível para ajudar!
      </p>

      {/* Botão/Link para o WhatsApp */}
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank" // Abre o link em uma nova aba/janela
        rel="noopener noreferrer" // Medida de segurança recomendada para target="_blank"
        // Estilização para parecer um botão, usando suas cores
        className="inline-flex items-center justify-center px-5 py-2.5 bg-[#a16535] text-white font-medium rounded-md shadow-sm hover:bg-[#8b5329] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a16535] transition-colors duration-200"
      >
        <MessageSquare className="w-5 h-5 mr-2" /> {/* Ícone dentro do botão */}
        Entrar em Contato via WhatsApp
      </a>

      {/* Você pode adicionar mais informações aqui se desejar, como um email ou telefone */}
      {/* <div className="mt-8 border-t border-[#d4c4b0] pt-6 text-sm text-[#6b5544]">
        <p>Você também pode nos contatar por email: <a href="mailto:suporte@jurisfacil.com" className="text-[#a16535] hover:underline">suporte@jurisfacil.com</a></p>
      </div>
      */}

    </div>
  );
}

// Se você prefere usar export default:
// export default Sac;