import { useTable, useSortBy, usePagination } from "react-table"; // *** IMPORTAR usePagination ***
import React from "react";
import PropTypes from "prop-types"; // Importar PropTypes
import { Button } from "primereact/button"; // Importa Button

export const TablaEquipos = ({ columns, data, ...extraProps }) => { // Permite pasar props adicionales a la tabla principal si es necesario
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page, // Contiene solo las filas de la página actual
    // Props y funciones para paginación
    canPreviousPage,
    canNextPage,
    //pageOptions, // Array de índices de página (ej: [0, 1, 2])
    pageCount, // Número total de páginas
   // gotoPage, // Función para ir a una página específica (si la necesitas en UI avanzada)
    nextPage, // Función para ir a la siguiente página
    previousPage, // Función para ir a la página anterior
    setPageSize, // Función para cambiar el tamaño de la página
    state: { pageIndex, pageSize }, // Estado actual de paginación (índice, tamaño)
  } = useTable(
    {
      columns,
      data: data || [], // Usar un array vacío si 'data' es null/undefined
      initialState: { pageIndex: 0, pageSize: 10 }, // Estado inicial de paginación
    },
    useSortBy, // Habilitar ordenación
    usePagination // *** HABILITAR PAGINACIÓN ***
  );

  // Cuando la paginación está activa (usePagination), 'page' ya contiene solo las filas de la página actual.
  const datosAMostrar = page || rows; 



  return (
    <div className="w-full"> {/* Contenedor principal */}
      <table
        {...getTableProps()} // Props básicas de react-table para la tabla
        className="w-full border-separate" // Clases de Tailwind
        style={{ borderSpacing: 0 }} // Eliminar espacio entre bordes de celdas
        {...extraProps} // Pasar props adicionales al elemento <table>
      >
        {/* Estilos básicos para bordes y padding (pueden ir en CSS separado) */}
        <style>{`
          .tabla-react th, .tabla-react td { /* Añadir clase para aplicar estilos */
            border-right: 1px solid #e5e7eb;
            padding: 0.5rem;
          }
          .tabla-react th:last-child, .tabla-react td:last-child {
            border-right: none;
          }
          /* Estilo opcional para ordenación */
          .tabla-react th {
              cursor: pointer; /* Indicar que la cabecera es clickeable para ordenar */
          }
          .tabla-react th.is-sorted-asc::after { content: " ▲"; } /* Indicador de orden ascendente */
          .tabla-react th.is-sorted-desc::after { content: " ▼"; } /* Indicador de orden descendente */
          .tabla-react th.is-sorted-none::after { content: " ◇"; opacity: 0.2;} /* Indicador de no ordenado */

        `}</style>
        {/* Aplicar clase para los estilos CSS */ }
        <thead className="tabla-react">
          {headerGroups.map((headerGroup) => (
            // getHeaderGroupProps() ya incluye una key única
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
              {headerGroup.headers.map((column) => {
                let sortedClass = 'is-sorted-none';
                if (column.isSorted) {
                  sortedClass = column.isSortedDesc ? 'is-sorted-desc' : 'is-sorted-asc';
                }
                return (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.getHeaderProps().key}
                      className={` /* Clases de estilos para cabecera */ ${sortedClass}`}
                  >
                    {/* Renderizar el contenido de la cabecera (string o componente) */}
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="tabla-react"> {/* Aplicar clase para los estilos CSS */}
          {/* Mapear sobre 'page' porque la paginación está activa */}
          {datosAMostrar.map((row) => {
            prepareRow(row); // Preparar cada fila es esencial
            // getRowProps() ya incluye una key única
            return (
              <tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map((cell) => (
                   // getCellProps() ya incluye una key única
                   <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                     {/* Renderizar el contenido de la celda (basado en accessor o Cell función) */}
                     {cell.render("Cell")}
                   </td>
                 ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Controles de Paginación */}
      <div className="flex justify-between items-center mt-3 p-2">
        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-left"
            className="p-button-rounded p-button-text p-button-sm items-center text-align-center"
            onClick={previousPage}
            disabled={!canPreviousPage} // Deshabilitar si no se puede ir atrás
            tooltip="Página anterior"
          />
          {/* Indicador de página actual / total */}
          <span className="text-sm">
            Página <strong>{pageIndex + 1}</strong> de{" "}
            <strong>{pageCount}</strong> {/* Mostrar número total de páginas */}
          </span>
          <Button
            icon="pi pi-angle-right"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={nextPage}
            disabled={!canNextPage} // Deshabilitar si no se puede ir adelante
            tooltip="Página siguiente"
          />
        </div>

        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Filas por página:</span> {/* Ajustar texto */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value)); // Actualizar tamaño de página
            }}
            className="p-inputtext p-component p-inputtext-sm"
          >
            {/* Opciones de tamaño de página */}
            {[5, 10, 20, 30, 50, 100].map((size) => ( // Añadir 100 como opción
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// *** Prop Types Actualizados para react-table ***
// Definen la estructura que se espera para las props 'columns' y 'data'
TablaEquipos.propTypes = {
  /**
   * Array de definiciones de columna para react-table.
   * Cada objeto debe tener al menos 'Header' y 'accessor'.
   * 'Cell' es una función opcional para renderizado custom.
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired, // Título de la columna
      accessor: PropTypes.string.isRequired, // Clave para acceder al dato en la fila
      Cell: PropTypes.func, // Función opcional para renderizar la celda
      // Puedes añadir más props de react-table si las usas (ej: disableSortBy, id)
    })
  ).isRequired,
  /**
   * Array de objetos que representan los datos de la tabla.
   * Cada objeto debe tener claves que coincidan con los 'accessor' de las columnas.
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Puedes añadir validación para otras props que pases al componente si las hay
};


export default TablaEquipos; // Eliminar si usas export const