/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata um CPF no padrão 000.000.000-00
 */
export function formatCPF(value: string): string {
  const numbers = removeNonNumeric(value);

  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);

  // Aplica a máscara de CPF
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
}

/**
 * Formata um CNPJ no padrão 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const numbers = removeNonNumeric(value);

  // Limita a 14 dígitos
  const limited = numbers.slice(0, 14);

  // Aplica a máscara de CNPJ
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return `${limited.slice(0, 2)}.${limited.slice(2)}`;
  } else if (limited.length <= 8) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  } else if (limited.length <= 12) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
  } else {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
  }
}

/**
 * Formata automaticamente CPF ou CNPJ baseado no tamanho
 */
export function formatCPFOrCNPJ(value: string): string {
  const numbers = removeNonNumeric(value);

  // Se tem até 11 dígitos, formata como CPF
  if (numbers.length <= 11) {
    return formatCPF(value);
  } else {
    // Se tem mais de 11 dígitos, formata como CNPJ
    return formatCNPJ(value);
  }
}

/**
 * Retorna a data atual no formato YYYY-MM-DD usando o fuso horário local
 * Evita problemas de diferença de um dia ao usar UTC
 */
export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Retorna a data e hora atual no formato ISO usando o fuso horário local
 * Evita problemas de diferença de um dia ao usar UTC
 */
export function getLocalDateTimeString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

/**
 * Formata uma data ISO (com timestamp) para DD/MM/YYYY HH:mm
 * Usado para datas que incluem horário
 */
export function formatDateTimeBR(isoString: string): string {
  if (!isoString) return '';

  // Extrai apenas a parte da data (antes do T)
  const datePart = isoString.split('T')[0];
  return formatDateBR(datePart);
}

/**
 * Formata um telefone no padrão (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * Aceita 10 ou 11 dígitos
 */
export function formatPhone(value: string): string {
  const numbers = removeNonNumeric(value);

  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);

  // Aplica a máscara de telefone
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    // Formato: (XX) XXXX-XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  } else {
    // Formato: (XX) XXXXX-XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
}

/**
 * Formata um CEP no padrão XXXXX-XXX
 */
export function formatCEP(value: string): string {
  const numbers = removeNonNumeric(value);

  // Limita a 8 dígitos
  const limited = numbers.slice(0, 8);

  // Aplica a máscara de CEP
  if (limited.length <= 5) {
    return limited;
  } else {
    return `${limited.slice(0, 5)}-${limited.slice(5)}`;
  }
}

/**
 * Formata um valor monetário no padrão brasileiro (R$ 0.000,00)
 */
export function formatCurrency(value: string): string {
  // Remove tudo exceto números
  const numbers = removeNonNumeric(value);

  // Se não há números, retorna vazio
  if (!numbers) return '';

  // Converte para número e divide por 100 para ter os centavos
  const amount = parseFloat(numbers) / 100;

  // Formata no padrão brasileiro
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Formata um percentual (0% a 100%)
 */
export function formatPercentage(value: string): string {
  // Remove tudo exceto números e vírgula/ponto
  const cleaned = value.replace(/[^\d,\.]/g, '');

  // Se não há números, retorna vazio
  if (!cleaned) return '';

  // Substitui vírgula por ponto para parseFloat
  const normalized = cleaned.replace(',', '.');
  const num = parseFloat(normalized);

  // Limita entre 0 e 100
  const limited = Math.min(Math.max(num, 0), 100);

  // Se for NaN, retorna vazio
  if (isNaN(limited)) return '';

  // Formata com até 2 casas decimais e adiciona o %
  return limited.toFixed(2).replace('.', ',') + '%';
}

/**
 * Formata número de contrato com barra e ano (XXX/AAAA)
 */
export function formatNumeroContrato(value: string): string {
  // Remove tudo exceto números e barra
  const cleaned = value.replace(/[^\d\/]/g, '');

  // Se já tem barra, mantém a formatação corretamente
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    const numero = parts[0]; // Mantém o número antes da barra
    const ano = parts[1] ? parts[1].slice(0, 4) : ''; // Limita a 4 dígitos o ano

    return numero + '/' + ano;
  }

  // Se não tem barra, retorna apenas os números digitados
  return cleaned;
}

/**
 * Formata número do processo no padrão CNJ: NNNNNNN-DD.AAAA.J.TT.OOOO
 * N = Número sequencial
 * DD = Dígito verificador
 * AAAA = Ano
 * J = Segmento da justiça
 * TT = Tribunal
 * OOOO = Origem
 */
export function formatNumeroProcesso(value: string): string {
  // Remove tudo exceto números, pontos e hífens
  const cleaned = value.replace(/[^\d\.\-]/g, '');

  // Remove apenas números para aplicar a máscara
  const numbers = removeNonNumeric(cleaned);

  // Se não tem números, retorna vazio
  if (!numbers) return '';

  // Aplica a máscara progressivamente: NNNNNNN-DD.AAAA.J.TT.OOOO
  let formatted = '';

  // Primeiros 7 dígitos (NNNNNNN)
  if (numbers.length <= 7) {
    formatted = numbers;
  }
  // Adiciona hífen e próximos 2 dígitos (NNNNNNN-DD)
  else if (numbers.length <= 9) {
    formatted = numbers.slice(0, 7) + '-' + numbers.slice(7);
  }
  // Adiciona ponto e próximos 4 dígitos (NNNNNNN-DD.AAAA)
  else if (numbers.length <= 13) {
    formatted = numbers.slice(0, 7) + '-' + numbers.slice(7, 9) + '.' + numbers.slice(9);
  }
  // Adiciona ponto e próximo dígito (NNNNNNN-DD.AAAA.J)
  else if (numbers.length <= 14) {
    formatted = numbers.slice(0, 7) + '-' + numbers.slice(7, 9) + '.' + numbers.slice(9, 13) + '.' + numbers.slice(13);
  }
  // Adiciona ponto e próximos 2 dígitos (NNNNNNN-DD.AAAA.J.TT)
  else if (numbers.length <= 16) {
    formatted = numbers.slice(0, 7) + '-' + numbers.slice(7, 9) + '.' + numbers.slice(9, 13) + '.' + numbers.slice(13, 14) + '.' + numbers.slice(14);
  }
  // Adiciona ponto e últimos 4 dígitos (NNNNNNN-DD.AAAA.J.TT.OOOO)
  else {
    formatted = numbers.slice(0, 7) + '-' + numbers.slice(7, 9) + '.' + numbers.slice(9, 13) + '.' + numbers.slice(13, 14) + '.' + numbers.slice(14, 16) + '.' + numbers.slice(16, 20);
  }

  return formatted;
}
