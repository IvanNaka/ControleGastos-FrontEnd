import { useState, useEffect } from 'react';
import type { Transacao } from '../../types/Transacao';
import { TipoTransacao } from '../../types/Transacao';
import type { Pessoa } from '../../types/Pessoa';
import type { Categoria } from '../../types/Categoria';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Container, Row, Col, ListGroup, Badge, Form, Button } from 'react-bootstrap';
import { 
  ArrowUpCircleFill, 
  ArrowDownCircleFill,
  PersonFill,
  TagFill,
  FileBarGraphFill,
  FunnelFill,
  XCircleFill
} from 'react-bootstrap-icons';
import { obterTransacoes } from '../../services/TransacoesService';
import { obterPessoas } from '../../services/PessoasService';
import { obterCategorias } from '../../services/CategoriasService';

export function RelatorioTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [pessoaFiltro, setPessoaFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [pessoasData, categoriasData, transacoesData] = await Promise.all([
        obterPessoas(),
        obterCategorias(),
        obterTransacoes()
      ]);
      
      setPessoas(pessoasData);
      setCategorias(categoriasData);
      setTransacoes(transacoesData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    }
  };

  const limparFiltros = () => {
    setPessoaFiltro('');
    setCategoriaFiltro('');
  };

  const transacoesFiltradas = transacoes.filter(transacao => {
    const filtroPessoa = !pessoaFiltro || transacao.pessoaId === pessoaFiltro;
    const filtroCategoria = !categoriaFiltro || transacao.categoriaId === categoriaFiltro;
    return filtroPessoa && filtroCategoria;
  });

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

  const calcularEstatisticas = () => {
    const receitas = transacoesFiltradas
      .filter(t => t.tipo === TipoTransacao.Receita)
      .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = transacoesFiltradas
      .filter(t => t.tipo === TipoTransacao.Despesa)
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saldo = receitas - despesas;

    return { receitas, despesas, saldo };
  };

  const { receitas, despesas, saldo } = calcularEstatisticas();
  const hasFiltrosAtivos = pessoaFiltro || categoriaFiltro;

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-dark text-white">
          <h4 className="mb-0">
            <FileBarGraphFill className="me-2" />
            Relatório de Transações
          </h4>
          <small className="text-light">Visualize e filtre suas receitas e despesas</small>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <PersonFill className="me-2" />
                    Filtrar por Pessoa
                  </Form.Label>
                  <Form.Select
                    value={pessoaFiltro}
                    onChange={(e) => setPessoaFiltro(e.target.value)}
                  >
                    <option value="">Todas as pessoas</option>
                    {pessoas.map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <TagFill className="me-2" />
                    Filtrar por Categoria
                  </Form.Label>
                  <Form.Select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.descricao}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  className="mb-3 w-100"
                  onClick={limparFiltros}
                  disabled={!hasFiltrosAtivos}
                >
                  <XCircleFill className="me-2" />
                  Limpar
                </Button>
              </Col>
            </Row>

            {hasFiltrosAtivos && (
              <div className="alert alert-info mb-0">
                <FunnelFill className="me-2" />
                <strong>Filtros ativos:</strong>
                {pessoaFiltro && <span className="ms-2">Pessoa: {getNomePessoa(pessoaFiltro)}</span>}
                {categoriaFiltro && <span className="ms-2">Categoria: {getDescricaoCategoria(categoriaFiltro)}</span>}
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-0">Receitas</h6>
                  <h3 className="text-success mb-0">{formatarValor(receitas)}</h3>
                </div>
                <ArrowUpCircleFill size={40} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-danger">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-0">Despesas</h6>
                  <h3 className="text-danger mb-0">{formatarValor(despesas)}</h3>
                </div>
                <ArrowDownCircleFill size={40} className="text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className={`shadow-sm border-${saldo >= 0 ? 'success' : 'danger'}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-0">Saldo</h6>
                  <h3 className={`mb-0 text-${saldo >= 0 ? 'success' : 'danger'}`}>
                    {formatarValor(saldo)}
                  </h3>
                </div>
                <Badge 
                  bg={saldo >= 0 ? 'success' : 'danger'} 
                  className="fs-6"
                >
                  {saldo >= 0 ? 'Positivo' : 'Negativo'}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white">
          <h5 className="mb-0">
            Transações
            <Badge bg="light" text="dark" className="ms-2">
              {transacoesFiltradas.length} {transacoesFiltradas.length === 1 ? 'transação' : 'transações'}
            </Badge>
          </h5>
        </Card.Header>
        <Card.Body>
          {transacoesFiltradas.length === 0 ? (
            <p className="text-muted text-center py-4">
              {hasFiltrosAtivos 
                ? 'Nenhuma transação encontrada com os filtros aplicados.'
                : 'Nenhuma transação cadastrada ainda.'
              }
            </p>
          ) : (
            <ListGroup variant="flush">
              {transacoesFiltradas.map((transacao) => (
                <ListGroup.Item 
                  key={transacao.id} 
                  className="d-flex justify-content-between align-items-start py-3"
                >
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      {transacao.tipo === TipoTransacao.Receita ? (
                        <ArrowUpCircleFill className="me-2 text-success" size={24} />
                      ) : (
                        <ArrowDownCircleFill className="me-2 text-danger" size={24} />
                      )}
                      <h6 className="mb-0">{transacao.descricao}</h6>
                    </div>
                    <div className="text-muted small">
                      <PersonFill className="me-1" />
                      {getNomePessoa(transacao.pessoaId)}
                      <span className="mx-2">•</span>
                      <TagFill className="me-1" />
                      {getDescricaoCategoria(transacao.categoriaId)}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className={`fw-bold fs-5 ${transacao.tipo === TipoTransacao.Receita ? 'text-success' : 'text-danger'}`}>
                      {transacao.tipo === TipoTransacao.Receita ? '+' : '-'} {formatarValor(transacao.valor)}
                    </div>
                    <Badge 
                      bg={transacao.tipo === TipoTransacao.Receita ? 'success' : 'danger'}
                    >
                      {transacao.tipo === TipoTransacao.Receita ? 'RECEITA' : 'DESPESA'}
                    </Badge>
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
