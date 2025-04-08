import { Routes,Route } from "react-router-dom"

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<PaginaPrincipal><PaginaLogin/></PaginaPrincipal>} />
        <Route path="/inventario" element={<RutaPrivada><PaginaInventario/></RutaPrivada>} />
        <Route path="/login" element={<RutaPublica><PaginaLogin/></RutaPublica>} />
        <Route path="/registro" element={<RutaPublica><PaginaRegistro/></RutaPublica>} />
        <Route path="/tablero" element={<RutaPrivada><Tablero/></RutaPrivada>} />
        <Route path="*" element={<RutaPublica><PaginaLogin/></RutaPublica>} />
        <Route path="/:id" element={<RutaPrivada><PaginaInventario/></RutaPrivada>} />
        <Route path="/home" element={<h1>Este es el Hogar</h1>} />
    </Routes>
  )
}

export default AppRouter
