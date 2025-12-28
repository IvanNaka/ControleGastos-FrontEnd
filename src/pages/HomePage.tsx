import { useState } from 'react'
import { CadastroPessoa } from '../components/CadastroPessoa'
import { CadastroCategoria } from '../components/CadastroCategoria';
import { CadastroTransacao } from '../components/CadastroTransacao';
import { RelatorioTransacoes } from '../components/RelatorioTransacoes';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { 
  PersonFill, 
  TagsFill, 
  CashCoin, 
  FileBarGraphFill,
  WalletFill,
  BoxArrowRight,
  PersonCircle
} from 'react-bootstrap-icons';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

type PaginaAtiva = 'pessoas' | 'categorias' | 'transacoes' | 'relatorio';

export function HomePage() {
  const [paginaAtiva, setPaginaAtiva] = useState<PaginaAtiva>('transacoes');
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      navigate('/');
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  const renderizarPagina = () => {
    switch (paginaAtiva) {
      case 'pessoas':
        return <CadastroPessoa />;
      case 'categorias':
        return <CadastroCategoria />;
      case 'transacoes':
        return <CadastroTransacao />;
      case 'relatorio':
        return <RelatorioTransacoes />;
      default:
        return <CadastroTransacao />;
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-0" fixed="top" style={{ zIndex: 1030 }}>
        <Container>
          <Navbar.Brand href="#" className="fw-bold">
            <WalletFill className="me-2" size={28} />
            Controle de Gastos
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link 
                active={paginaAtiva === 'pessoas'}
                onClick={() => setPaginaAtiva('pessoas')}
                className="d-flex align-items-center"
              >
                <PersonFill className="me-2" />
                Pessoas
              </Nav.Link>
              <Nav.Link 
                active={paginaAtiva === 'categorias'}
                onClick={() => setPaginaAtiva('categorias')}
                className="d-flex align-items-center"
              >
                <TagsFill className="me-2" />
                Categorias
              </Nav.Link>
              <Nav.Link 
                active={paginaAtiva === 'transacoes'}
                onClick={() => setPaginaAtiva('transacoes')}
                className="d-flex align-items-center"
              >
                <CashCoin className="me-2" />
                Transações
              </Nav.Link>
              <Nav.Link 
                active={paginaAtiva === 'relatorio'}
                onClick={() => setPaginaAtiva('relatorio')}
                className="d-flex align-items-center"
              >
                <FileBarGraphFill className="me-2" />
                Relatório
              </Nav.Link>
              {accounts.length > 0 && (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="user-dropdown" className="d-flex align-items-center">
                    <PersonCircle className="me-2" size={20} />
                    {accounts[0].name || accounts[0].username}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>
                      <BoxArrowRight className="me-2" />
                      Sair
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="min-vh-100 bg-light" style={{ paddingTop: '56px' }}>
        {renderizarPagina()}
      </div>
    </>
  );
}
