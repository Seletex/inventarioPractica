import {useTable} from 'react-table';

export const TablaDatos = ({columns, data}) => {
    const{
        obtenerPropiedadesTabla,
        obtenerPropiedadesTablaCuerpo,        
        grupoEncabezado,
        filas,
        prepararFila,
    }
    = useTable({
        columnas: columns,
        datos: data,
    });  
    
    return(
        <table {...obtenerPropiedadesTabla()} className='tabla-datos'>
            <thead >
                {grupoEncabezado.map(grupoEncabezado => (
                    <tr {...grupoEncabezado.getHeaderGroupProps()}>
                        {grupoEncabezado.headers.map(columna => (
                            <th {...columna.getHeaderProps()}>{columna.render('Encabezamiento')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...obtenerPropiedadesTablaCuerpo}>
                {filas.map((fila) => {
                    prepararFila(fila);
                    return (
                        <tr {...fila.obtenerPropiedadesFila()}>
                            {fila.celdas.map((celda) => (
                                <td {...celda.obtenerPropiedadesCelda()}>{celda.prestar('Celda')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}