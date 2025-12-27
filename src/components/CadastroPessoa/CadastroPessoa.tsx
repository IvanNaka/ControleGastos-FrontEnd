
import React, { useState, useEffect } from 'react';
import type { Pessoa } from '../../types/Pessoa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, Form, Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { PersonPlusFill, PeopleFill, Inbox, PersonFill, CheckCircleFill, CalendarEvent, ExclamationTriangleFill, TrashFill } from 'react-bootstrap-icons';
import { criarPessoa, deletarPessoa, obterPessoas } from '../../services/PessoasService';


export function CadastroPessoa() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
  const [nomePessoa, setNomePessoa] = useState('');
  const [idadePessoa, setIdadePessoa] = useState('');

  const usuarioId = '90606ffe-e371-4aa7-8adb-1848e7d5cc2e';


  useEffect(() => {
    carregarPessoas();
  }, []);


  const carregarPessoas = async () => {
    setPessoas(await obterPessoas(usuarioId));
  };

  const handleCriarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomePessoa.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    const idade = parseInt(idadePessoa);
    if (isNaN(idade) || idade <= 0) {
      toast.error('Idade deve ser um número positivo');
      return;
    }

    try {

      var response =  await criarPessoa({ nome: nomePessoa, idade, usuarioId: usuarioId });
      if (!response) {
        toast.error('Erro ao cadastrar pessoa');
        return;
      }
      toast.success('Pessoa cadastrada com sucesso!');
      
      setNomePessoa('');
      setIdadePessoa('');
  
      carregarPessoas();
    } catch (error) {
      toast.error('Erro ao cadastrar pessoa');
    }
  };

  const handleDeletarPessoa = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja deletar ${nome}? Todas as transações dessa pessoa também serão deletadas.`)) {
      deletarPessoa(id);
      toast.success('Pessoa deletada com sucesso!');
      carregarPessoas();
    }
  };

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={5} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0 text-white">
                <PersonPlusFill size={20} className="me-2" />
                Cadastrar Nova Pessoa
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Card.Text className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                Adicione uma pessoa que pode realizar transações no sistema
              </Card.Text>
              <Form onSubmit={handleCriarPessoa}>
                <Form.Group className="mb-3" controlId="nome">
                  <Form.Label className="fw-semibold">Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome completo"
                    value={nomePessoa}
                    onChange={(e) => setNomePessoa(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="idade">
                  <Form.Label className="fw-semibold">Idade</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Digite a idade"
                    min="1"
                    max="150"
                    value={idadePessoa}
                    onChange={(e) => setIdadePessoa(e.target.value)}
                    required
                    className="py-2"
                  />
                  <Form.Text className="text-warning fw-medium">
                    Menores de 18 anos só podem cadastrar despesas!
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="bg-dark text-white">
                  <CheckCircleFill size={20} className="me-2" />
                  Cadastrar Pessoa
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7} md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0 text-white">
                <PeopleFill size={20} className="me-2" />
                Pessoas Cadastradas
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <span className="text-muted me-2">Total de pessoas:</span>
                <Badge bg="info" className="px-3 py-2 fs-6">{pessoas.length}</Badge>
              </div>
              {pessoas.length === 0 ? (
                <div className="text-center py-5">
                  <Inbox size={64} className="text-muted mb-3" />
                  <p className="text-muted fs-5">Nenhuma pessoa cadastrada ainda</p>
                  <p className="text-muted small">Comece cadastrando uma pessoa ao lado</p>
                </div>
              ) : (
                <ListGroup variant="flush" className="border rounded">
                  {pessoas.map((pessoa, index) => (
                    <ListGroup.Item
                      key={pessoa.id}
                      className="d-flex justify-content-between align-items-center py-3 border-0"
                      style={{ 
                        borderBottom: index < pessoas.length - 1 ? '1px solid #e9ecef' : 'none',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PersonFill size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold">{pessoa.nome}</h6>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted">
                              <CalendarEvent size={14} className="me-1" />
                              {pessoa.idade} anos
                            </small>
                            {pessoa.idade < 18 && (
                              <Badge bg="warning" text="dark" className="px-2">
                                <ExclamationTriangleFill size={12} className="me-1" />
                                Menor
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeletarPessoa(pessoa.id!, pessoa.nome)}
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
