export interface Transacao {
  id?: string;
  pessoaId: string;
  categoriaId: string;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  usuarioId?: string;
}

export type TipoTransacao = 1 | 2;

export const TipoTransacao = {
  Receita: 1 as const,
  Despesa: 2 as const,
};
