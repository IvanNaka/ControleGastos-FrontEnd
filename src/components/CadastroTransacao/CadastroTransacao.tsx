import React, { useState, useEffect } from 'react';
import type { Transacao } from '../../types/Transacao';
import { TipoTransacao } from '../../types/Transacao';
import type { Pessoa } from '../../types/Pessoa';
import type { Categoria } from '../../types/Categoria';
import { FinalidadeCategoria } from '../../types/Categoria';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, Form, Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { 
  CashCoin, 
  ArrowUpCircleFill, 
  ArrowDownCircleFill, 
  TrashFill, 
  PersonFill,
  TagFill,
  FileTextFill,
  CurrencyDollar
} from 'react-bootstrap-icons';
import { criarTransacao, deletarTransacao, obterTransacoes } from '../../services/TransacoesService';
import { obterPessoas } from '../../services/PessoasService';
import { obterCategorias } from '../../services/CategoriasService';

export function CadastroTransacao() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Categoria[]>([]);
  
  const [pessoaId, setPessoaId] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [categoriaId, setCategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const usuarioId = '90606ffe-e371-4aa7-8adb-1848e7d5cc2e';

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    // Filtrar categorias compatíveis com o tipo selecionado
    const categoriasFiltradas = categorias.filter(cat => 
      cat.finalidade === FinalidadeCategoria.Ambas || 
      (tipo === TipoTransacao.Receita && cat.finalidade === FinalidadeCategoria.Receita) ||
      (tipo === TipoTransacao.Despesa && cat.finalidade === FinalidadeCategoria.Despesa)
    );
    setCategoriasFiltradas(categoriasFiltradas);
    
    // Reset categoria se não for compatível
    if (categoriaId) {
      const categoriaAtual = categorias.find(c => c.id === categoriaId);
      if (categoriaAtual && !categoriasFiltradas.find(c => c.id === categoriaId)) {
        setCategoriaId('');
      }
    }
  }, [tipo, categorias, categoriaId]);

  const carregarDados = async () => {
    const [pessoasData, categoriasData, transacoesData] = await Promise.all([
      obterPessoas(usuarioId),
      obterCategorias(usuarioId),
      obterTransacoes(usuarioId)
    ]);
    
    setPessoas(pessoasData);
    setCategorias(categoriasData);
    setTransacoes(transacoesData);
  };

  const handleCriarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pessoaId) {
      toast.error('Pessoa é obrigatória');
      return;
    }

    if (!categoriaId) {
      toast.error('Categoria é obrigatória');
      return;
    }

    if (!descricao.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }

    if (!valor || parseFloat(valor) <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    try {
      const response = await criarTransacao({
        pessoaId,
        categoriaId,
        tipo,
        descricao: descricao.trim(),
        valor: parseFloat(valor),
        usuarioId
      });

      if (!response) {
        toast.error('Erro ao cadastrar transação');
        return;
      }

      toast.success('Transação cadastrada com sucesso!');
      limparFormulario();
      carregarDados();
    } catch (error) {
      toast.error('Erro ao cadastrar transação');
      console.error(error);
    }
  };

  const handleDeletarTransacao = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir esta transação?')) {
      return;
    }

    try {
      await deletarTransacao(id);
      toast.success('Transação excluída com sucesso!');
      carregarDados();
    } catch (error) {
      toast.error('Erro ao excluir transação');
      console.error(error);
    }
  };

  const limparFormulario = () => {
    setPessoaId('');
    setTipo(TipoTransacao.Despesa);
    setCategoriaId('');
    setDescricao('');
    setValor('');
  };

  const getNomePessoa = (id: string) => {
    return pessoas.find(p => p.id === id)?.nome || 'Desconhecido';
  };

  const getDescricaoCategoria = (id: string) => {
    return categorias.find(c => c.id === id)?.descricao || 'Desconhecido';
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const calcularTotal = () => {
    return transacoes.reduce((total, t) => {
      return t.tipo === TipoTransacao.Receita ? total + t.valor : total - t.valor;
    }, 0);
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-dark text-white">
          <h4 className="mb-0">
            <CashCoin className="me-2" />
            Cadastrar Nova Transação
          </h4>
          <small className="text-light">Registre uma nova despesa ou receita no sistema</small>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleCriarTransacao}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <PersonFill className="me-2" />
                    Pessoa
                  </Form.Label>
                  <Form.Select
                    value={pessoaId}
                    onChange={(e) => setPessoaId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma pessoa</option>
                    {pessoas.map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <TagFill className="me-2" />
                    Categoria
                  </Form.Label>
                  <Form.Select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoriasFiltradas.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.descricao}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Apenas categorias compatíveis com o tipo selecionado
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {tipo === TipoTransacao.Receita ? (
                      <ArrowUpCircleFill className="me-2 text-success" />
                    ) : (
                      <ArrowDownCircleFill className="me-2 text-danger" />
                    )}
                    Tipo de Transação
                  </Form.Label>
                  <Form.Select
                    value={tipo}
                    onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}
                    required
                  >
                    <option value={TipoTransacao.Despesa}>Despesa</option>
                    <option value={TipoTransacao.Receita}>Receita</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FileTextFill className="me-2" />
                    Descrição
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Compra no supermercado"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <CurrencyDollar className="me-2" />
                    Valor (R$)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid">
              <Button variant="dark" size="lg" type="submit">
                Cadastrar Transação
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Transações Cadastradas</h5>
            <small>Total de {transacoes.length} transação(ões) no sistema</small>
          </div>
          <Badge bg={calcularTotal() >= 0 ? 'success' : 'danger'} className="fs-6">
            Saldo: {formatarValor(calcularTotal())}
          </Badge>
        </Card.Header>
        <Card.Body>
          {transacoes.length === 0 ? (
            <p className="text-muted text-center py-4">
              Nenhuma transação cadastrada ainda.
            </p>
          ) : (
            <ListGroup variant="flush">
              {transacoes.map((transacao) => (
                <ListGroup.Item 
                  key={transacao.id} 
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="flex-grow-1">
                    {transacao.tipo === TipoTransacao.Receita ? (
                      <ArrowUpCircleFill className="me-2 text-success" size={20} />
                    ) : (
                      <ArrowDownCircleFill className="me-2 text-danger" size={20} />
                    )}
                    <strong>{transacao.descricao}</strong>
                    <div className="text-muted small">
                      {getNomePessoa(transacao.pessoaId)} • {getDescricaoCategoria(transacao.categoriaId)}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className={`fw-bold ${transacao.tipo === TipoTransacao.Receita ? 'text-success' : 'text-danger'}`}>
                      {transacao.tipo === TipoTransacao.Receita ? '+' : '-'} {formatarValor(transacao.valor)}
                    </div>
                    <Badge 
                      bg={transacao.tipo === TipoTransacao.Receita ? 'success' : 'danger'}
                      className="me-2"
                    >
                      {transacao.tipo === TipoTransacao.Receita ? 'RECEITA' : 'DESPESA'}
                    </Badge>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => transacao.id && handleDeletarTransacao(transacao.id)}
                    >
                      <TrashFill />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
