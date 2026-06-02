export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function mascaraCpf(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function cpfValido(valor: string): boolean {
  const d = apenasDigitos(valor);
  if (d.length !== 11) return false;
  return !/^(\d)\1{10}$/.test(d);
}

export function mascaraTelefone(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function telefoneValido(valor: string): boolean {
  if (!valor.trim()) return true;
  const tamanho = apenasDigitos(valor).length;
  return tamanho === 10 || tamanho === 11;
}

export function mascaraData(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascaraDataHora(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 12);
  const data = mascaraData(d.slice(0, 8));
  const hora = d.slice(8);
  if (hora.length === 0) return data;
  if (hora.length <= 2) return `${data} ${hora}`;
  return `${data} ${hora.slice(0, 2)}:${hora.slice(2)}`;
}

export function dataBRparaISO(valor: string): string | null {
  const match = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return `${yyyy}-${mm}-${dd}`;
}

export function dataHoraBRparaISO(valor: string): string | null {
  const match = valor.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, dd, mm, yyyy, hh, min] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const hours = Number(hh);
  const minutes = Number(min);
  if (hours > 23 || minutes > 59) return null;
  const date = new Date(year, month - 1, day, hours, minutes);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date.toISOString();
}

export function mascaraCrm(valor: string): string {
  return valor.replace(/[^a-zA-Z0-9/-]/g, '').toUpperCase().slice(0, 15);
}

export function mascaraNumero(valor: string, max?: number): string {
  const d = apenasDigitos(valor);
  return max ? d.slice(0, max) : d;
}

export function dataHoraAtualBR(): string {
  const agora = new Date();
  const dd = String(agora.getDate()).padStart(2, '0');
  const mm = String(agora.getMonth() + 1).padStart(2, '0');
  const yyyy = agora.getFullYear();
  const hh = String(agora.getHours()).padStart(2, '0');
  const min = String(agora.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
