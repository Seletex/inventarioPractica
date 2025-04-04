import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Inventario from './pages/Inventario'
import Login from './pages/Login'
import Register from './pages/Register'


import { AuthContext } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
      <div className="App">
        <h1>Inventario</h1>
        <p>Bienvenido al sistema de inventario</p>
      </div>
    </AuthProvider>
  )
 
}

export default App
