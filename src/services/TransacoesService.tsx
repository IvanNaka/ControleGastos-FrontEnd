import type { Transacao } from "../types/Transacao";
import api from "./api";

export async function obterTransacoes(): Promise<Transacao[]> {
  const data = await api.get(`/transacoes`).then(res => res.data);
  return data ? data : [];
}

export async function criarTransacao(transacao: Transacao): Promise<Transacao> {
  const response = await api.post('/transacoes', transacao).then(res => res.data);
  return response;
}

export async function deletarTransacao(id: string): Promise<void> {
  const response = await api.delete(`/transacoes/${id}`);
  return response.data;
}
