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
   scopes:  ["api://a0e8ed63-ce40-4d38-8e25-2f3cc5e581f1/access_as_user"],
};

// Scopes específicos para sua API backend
export const apiRequest = {
  scopes: [
    "api://a0e8ed63-ce40-4d38-8e25-2f3cc5e581f1/access_as_user",
  ],
};
