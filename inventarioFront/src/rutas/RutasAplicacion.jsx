import {Routes,Route} from 'react-router-dom'
import {PaginaPrincipal} from '../paginas/PaginaPrincipal'
import {PaginaInventario} from '../paginas/PaginaInventario'
import {PaginaLogin} from '../paginas/PaginaLogin'
import {PaginaRegistro} from '../paginas/PaginaRegistro'
import {Tablero} from '../paginas/Tablero'
import {RutaPrivada} from './RutaPrivada'
import {RutaPublica} from './RutaPublica'


const RutasAplicacion = () => {
    return(
        <Routes>
            <Route path='/' element={<PaginaPrincipal><PaginaLogin/></PaginaPrincipal>}/>
            <Route path='/inventario' element={<RutaPrivada><PaginaInventario/></RutaPrivada>}/>
            <Route path='/login' element={<RutaPublica><PaginaLogin/></RutaPublica>}/>
            <Route path='/registro' element={<RutaPublica><PaginaRegistro/></RutaPublica>}/>
            <Route path='/tablero' element={<RutaPrivada><Tablero/></RutaPrivada> }/>
            <Route path='*' element={<RutaPublica><PaginaLogin/></RutaPublica>}/>
        </Routes>
    )
}
export default RutasAplicacion
// export default RutasAplicacion;