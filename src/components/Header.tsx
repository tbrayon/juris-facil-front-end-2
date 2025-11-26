import React from "react";
import {
  Scale,
  LogOut,
  Menu as MenuIcon,
  HomeIcon,
  Users,
  UserSquare2,
  FileText,
  Calendar,
  FileSignature,
  FileBarChart,
  BarChart3,
  LifeBuoy,
} from "lucide-react";

import { AppView } from "../types/navigation";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUsers } from "@/contexts/UsersContext";

interface HeaderProps {
  onLogout: () => void;
  onNavigate: (view: AppView) => void;
}

export default function Header({
  onLogout,
  onNavigate,
}: HeaderProps) {
  const [menuAberto, setMenuAberto] = React.useState(false);
  const { currentUser } = useUsers();

  // Tipagem explícita para evitar erro TS2345
  const menuItems: { view: AppView; label: string; icon: any }[] = [
    { view: "home", label: "Página Inicial", icon: HomeIcon },
    { view: "clientes", label: "Clientes", icon: Users },
    { view: "processos", label: "Processos", icon: FileText },
    { view: "prazos", label: "Prazos e Audiências", icon: Calendar },
    { view: "contratos", label: "Contratos", icon: FileSignature },
    { view: "relatorios", label: "Relatórios", icon: FileBarChart },
    ...(currentUser?.role === "admin"
      ? [{ view: "usuarios" as AppView, label: "Usuários", icon: UserSquare2 }]
      : []),
    { view: "dashboard", label: "Dashboard", icon: BarChart3 },
    { view: "suporte", label: "Suporte", icon: LifeBuoy },
  ];

  return (
    <header className="bg-white border-b-2 border-[#d4c4b0] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-4">
        {/* LOGO E TÍTULO */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
        >
          <div className="bg-gradient-to-br from-[#a16535] to-[#8b5329] p-2.5 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-[#2d1f16] font-semibold">
              JURIS <span className="text-[#a16535] font-normal">FÁCIL</span>
            </h1>
            <p className="text-xs text-[#6b5544] hidden sm:block">
              Sistema de Gestão Jurídica
            </p>
          </div>
        </button>

        {/* MENU MOBILE E TABLET (alterado de md:hidden para lg:hidden) */}
        <div className="flex lg:hidden items-center">
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white rounded-md p-2"
              >
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[280px] bg-white border-l-2 border-[#d4c4b0]"
            >
              {/* Cabeçalho do menu */}
              <div className="flex items-center gap-2 border-b border-[#d4c4b0] pb-3 mb-4">
                <Scale className="w-5 h-5 text-[#a16535]" />
                <h2 className="text-[#2d1f16] font-medium text-lg">Menu</h2>
              </div>

              {/* Card do usuário */}
              <div className="bg-[#f8f6f3] border border-[#e3d7c9] rounded-lg p-3 mb-3">
                <p className="text-xs text-[#6b5544] mb-0.5">Bem-vindo(a),</p>
                <p className="text-sm font-medium text-[#2d1f16] leading-tight">
                  {currentUser?.name}
                </p>
              </div>

              {/* Itens do menu */}
              <div className="mt-2 flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.view}
                    variant="ghost"
                    onClick={() => {
                      onNavigate(item.view);
                      setMenuAberto(false);
                    }}
                    className="w-full justify-start text-[#2d1f16] hover:text-[#a16535] hover:bg-[#f6f3ee]"
                  >
                    <item.icon className="w-4 h-4 mr-2 text-[#a16535]" />
                    {item.label}
                  </Button>
                ))}
                <Separator className="my-2" />
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="w-full justify-start border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* USUÁRIO + SAIR (DESKTOP) (alterado de md:flex para lg:flex) */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-[#6b5544]">Bem-vindo(a),</p>
            <p className="text-sm font-medium text-[#2d1f16]">{currentUser?.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-2 border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white rounded-md px-4 py-1.5 text-sm flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
