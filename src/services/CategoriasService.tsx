import api from './api';
import type { Categoria } from '../types/Categoria';

export const obterCategorias = async (usuarioId: string): Promise<Categoria[]> => {
  try {
    const response = await api.get(`/categorias/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    return [];
  }
};

export const criarCategoria = async (categoria: Categoria): Promise<Categoria | null> => {
  try {
    const response = await api.post('/categorias', categoria);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return null;
  }
};

export const deletarCategoria = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/categorias/${id}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return false;
  }
};
