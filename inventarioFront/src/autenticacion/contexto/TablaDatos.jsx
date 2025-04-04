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
        <table {...obtenerPropiedadesTabla()}>
            <thead {...obtenerPropiedadesTablaCuerpo()}>
                {grupoEncabezado.map((grupo, index) => (
                    <tr key={index}>
                        {grupo.map((columna) => (
                            <th {...columna.getHeaderProps()}>{columna.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...filas}>
                {filas.map((fila) => {
                    prepararFila(fila);
                    return (
                        <tr {...fila.getRowProps()}>
                            {fila.cells.map((celda) => (
                                <td {...celda.getCellProps()}>{celda.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}