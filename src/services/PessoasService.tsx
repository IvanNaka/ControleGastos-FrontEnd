import type { Pessoa } from "../types/Pessoa";
import api from "./api";

export async function obterPessoas(usuarioId: string): Promise<Pessoa[]> {
  const data = await api.get(`/pessoas/usuario/${usuarioId}`).then(res => res.data);
  return data ? data : [];
}

export async function criarPessoa(pessoa: Pessoa): Promise<Pessoa> {
  const response = await api.post('/pessoas', pessoa).then(res => res.data);
  return response;
}

export async function deletarPessoa(id: string): Promise<void> {
   const response = await api.delete(`/pessoas/${id}`);
   return response.data;
}
