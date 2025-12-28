import axios from 'axios';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/authConfig';

const api = axios.create({
  // baseURL: 'https://localhost:7086/api'
  baseURL: 'https://controlegastosapi-chapc5fgg5g6acah.brazilsouth-01.azurewebsites.net/api'
});

// Criar instância MSAL para obter tokens
const msalInstance = new PublicClientApplication(msalConfig);

// Interceptor para adicionar o Bearer token nas requisições
api.interceptors.request.use(
  async (config) => {
    try {
      await msalInstance.initialize();
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length > 0) {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["api://a0e8ed63-ce40-4d38-8e25-2f3cc5e581f1/access_as_user"],
          account: accounts[0],
        });
        if (response.accessToken) {
          config.headers.Authorization = `Bearer ${response.accessToken}`;
        }
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
      // Se falhar ao obter o token silenciosamente, a requisição continua sem o token
      // O backend deve retornar 401 e o frontend pode redirecionar para login
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Token inválido ou expirado');
    }
    return Promise.reject(error);
  }
);

export default api;