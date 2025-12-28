import { Container, Button, Card, Alert } from 'react-bootstrap';
import { WalletFill, ArrowRight, MicrosoftTeams, BoxArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
export function LandingPage() {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log('Login successful:', response);

      // Extrair dados do usuário
      const account = response.account;
      const userData = {
        nome: account.name || '',
        email: account.username || '',
        azureAdId: account.localAccountId || account.homeAccountId || ''
      };

      try {
        await api.post('/Usuarios', userData);
        console.log('Usuário registrado com sucesso');
        
        toast.success('Login realizado com sucesso!');
      } catch (apiError) {
        console.error('Erro ao registrar usuário:', apiError);
        // Continuar mesmo se houver erro no registro
      }

      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Falha ao fazer login. Por favor, tente novamente.');
      toast.error('Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      toast.success('Logout realizado com sucesso!');
      setError('');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Erro ao fazer logout');
    }
  };


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

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {accounts.length > 0 ? (
              <div className="mb-4">
                <Alert variant="success">
                  Bem-vindo, {accounts[0].name}!
                </Alert>
                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-5 py-3 fw-semibold"
                    onClick={() => navigate('/home')}
                  >
                    Acessar Sistema
                    <ArrowRight size={24} className="ms-2" />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="lg" 
                    className="px-5 py-3 fw-semibold d-flex align-items-center justify-content-center"
                    onClick={handleLogout}
                  >
                    <BoxArrowRight size={24} className="me-2" />
                    Sair
                  </Button>
                </div>
              </div>
            ) : (
              <div className="d-grid gap-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-5 py-3 fw-semibold d-flex align-items-center justify-content-center"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  <MicrosoftTeams size={24} className="me-2" />
                  {loading ? 'Entrando...' : 'Entrar com Azure AD'}
                </Button>
              </div>
            )}
            
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
