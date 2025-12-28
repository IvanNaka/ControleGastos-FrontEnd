import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { accounts } = useMsal();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    // Permite acesso se tiver conta MSAL
    if (accounts.length === 0) {
      navigate('/', { replace: true });
    }
  }, [accounts.length, navigate]);

  // Se não tiver nem conta MSAL bloqueia
  if (accounts.length === 0) {
    return null;
  }

  return <>{children}</>;
}
