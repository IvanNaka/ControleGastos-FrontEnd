export interface Categoria {
  id?: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
  usuarioId: string;
}

export enum FinalidadeCategoria {
  Receita = 1,
  Despesa = 2,
  Ambas = 3
}
