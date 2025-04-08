import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './autenticacion/contexto/ContextoAutenticacion.jsx'
import { BrowserRouter } from 'react-router-dom'


//import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </React.StrictMode>,
)
/*<HelmetProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Toaster />
          <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
          >
            <App />
          </Auth0Provider>
        </QueryClientProvider>
      </HelmetProvider>*/
