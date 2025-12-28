export interface Categoria {
  id?: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
  usuarioId?: string;
}

export type FinalidadeCategoria = 1 | 2 | 3;

export const FinalidadeCategoria = {
  Receita: 1 as const,
  Despesa: 2 as const,
  Ambas: 3 as const,
}
