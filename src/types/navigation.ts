// src/types/navigation.ts
export type AppView =
  | 'welcome'
  | 'login'
  | 'suporte'
  | 'termos'
  | 'privacidade'
  | 'cookies'
  | 'home'
  | 'dashboard'
  | 'clientes'
  | 'processos'
  | 'prazos'
  | 'contratos'
  | 'relatorios'
  | 'usuarios';

export type NavigateFunc = (view: AppView) => void;