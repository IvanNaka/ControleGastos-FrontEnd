export interface Transacao {
  id?: string;
  pessoaId: string;
  categoriaId: string;
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  usuarioId?: string;
}

export enum TipoTransacao {
  Receita = 1,
  Despesa = 2
}
