import { Container, Button, Card } from 'react-bootstrap';
import { WalletFill, ArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div id="landing-page" className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <Container>
        <Card className="shadow-lg border-0 text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Body className="p-5">
            <div className="mb-4">
              <WalletFill size={80} className="text-dark mb-3" />
              <h1 className="display-4 fw-bold mb-3">Controle de Gastos</h1>
              <p className="lead text-muted mb-4">
                Gerencie suas finanças de forma simples e eficiente. 
                Controle receitas, despesas e muito mais.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              className="px-5 py-3 fw-semibold"
              onClick={() => navigate('/home')}
            >
              Acessar Sistema
              <ArrowRight size={24} className="ms-2" />
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
