import React, { useState, useEffect } from 'react';
import type { Categoria } from '../../types/Categoria';
import { FinalidadeCategoria } from '../../types/Categoria';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, Form, Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { TagFill, TagsFill, Inbox, CheckCircleFill, TrashFill, ArrowRepeat, CashCoin, WalletFill } from 'react-bootstrap-icons';
import { criarCategoria, deletarCategoria, obterCategorias } from '../../services/CategoriasService';


export function CadastroCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Ambas);

  const usuarioId = '90606ffe-e371-4aa7-8adb-1848e7d5cc2e';

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setCategorias(await obterCategorias(usuarioId));
  };

  const handleCriarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }

    try {
      const response = await criarCategoria({ 
        descricao, 
        finalidade, 
        usuarioId 
      });
      
      if (!response) {
        toast.error('Erro ao cadastrar categoria');
        return;
      }
      
      toast.success('Categoria cadastrada com sucesso!');
      setDescricao('');
      setFinalidade(FinalidadeCategoria.Ambas);
      carregarCategorias();
    } catch (error) {
      toast.error('Erro ao cadastrar categoria');
    }
  };

  const handleDeletarCategoria = async (id: string, descricao: string) => {
    if (window.confirm(`Tem certeza que deseja deletar a categoria "${descricao}"? Todas as transações com essa categoria também serão afetadas.`)) {
      const success = await deletarCategoria(id);
      if (success) {
        toast.success('Categoria deletada com sucesso!');
        carregarCategorias();
      } else {
        toast.error('Erro ao deletar categoria');
      }
    }
  };

  const getFinalidadeBadge = (finalidade: FinalidadeCategoria) => {
    switch (finalidade) {
      case FinalidadeCategoria.Receita:
        return <Badge bg="success" className="px-2"><CashCoin size={12} className="me-1" />Receita</Badge>;
      case FinalidadeCategoria.Despesa:
        return <Badge bg="danger" className="px-2"><WalletFill size={12} className="me-1" />Despesa</Badge>;
      case FinalidadeCategoria.Ambas:
        return <Badge bg="info" className="px-2"><ArrowRepeat size={12} className="me-1" />Ambas</Badge>;
      default:
        return null;
    }
  };


  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={5} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ background: '#667eea' }}>
              <h5 className="mb-0 text-white">
                <TagFill size={20} className="me-2" />
                Cadastrar Nova Categoria
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Card.Text className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                Crie categorias para classificar suas transações
              </Card.Text>
              <Form onSubmit={handleCriarCategoria}>
                <Form.Group className="mb-3" controlId="descricao">
                  <Form.Label className="fw-semibold">Descrição</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Alimentação, Salário, Transporte..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="finalidade">
                  <Form.Label className="fw-semibold">Finalidade</Form.Label>
                  <Form.Select
                    value={finalidade}
                    onChange={(e) => setFinalidade(Number(e.target.value) as FinalidadeCategoria)}
                    className="py-2"
                  >
                    <option value={FinalidadeCategoria.Ambas}>Ambas (Despesa e Receita)</option>
                    <option value={FinalidadeCategoria.Despesa}>Despesa</option>
                    <option value={FinalidadeCategoria.Receita}>Receita</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Define se a categoria pode ser usada em despesas, receitas ou ambas
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold" style={{ background: '#667eea', border: 'none' }}>
                  <CheckCircleFill size={20} className="me-2" />
                  Cadastrar Categoria
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header style={{ background: '#f5576c' }}>
              <h5 className="mb-0 text-white">
                <TagsFill size={20} className="me-2" />
                Categorias Cadastradas
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <span className="text-muted me-2">Total de categorias:</span>
                <Badge bg="info" className="px-3 py-2 fs-6">{categorias.length}</Badge>
              </div>
              {categorias.length === 0 ? (
                <div className="text-center py-5">
                  <Inbox size={64} className="text-muted mb-3" />
                  <p className="text-muted fs-5">Nenhuma categoria cadastrada ainda</p>
                  <p className="text-muted small">Comece cadastrando uma categoria ao lado</p>
                </div>
              ) : (
                <ListGroup variant="flush" className="border rounded">
                  {categorias.map((categoria, index) => (
                    <ListGroup.Item
                      key={categoria.id}
                      className="d-flex justify-content-between align-items-center py-3 border-0"
                      style={{ 
                        borderBottom: index < categorias.length - 1 ? '1px solid #e9ecef' : 'none',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <TagFill size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold">{categoria.descricao}</h6>
                          <div className="d-flex align-items-center gap-2">
                            {getFinalidadeBadge(categoria.finalidade)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeletarCategoria(categoria.id!, categoria.descricao)}
                        className="d-flex align-items-center"
                      >
                        <TrashFill size={14} className="me-1" />
                        Deletar
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
