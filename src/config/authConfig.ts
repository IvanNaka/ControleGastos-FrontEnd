import type { PopupRequest } from "@azure/msal-browser";
import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
    authority: 'https://login.microsoftonline.com/common',  
    redirectUri: window.location.origin, 
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }, 
};

export const loginRequest: PopupRequest = {
   scopes:  [`${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`],
};

// Scopes específicos para sua API backend
export const apiRequest = {
  scopes: [
    `${import.meta.env.VITE_AZURE_CLIENT_ID}/.default`,
  ],
};
