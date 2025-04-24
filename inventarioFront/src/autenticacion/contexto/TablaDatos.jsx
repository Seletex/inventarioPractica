// Archivo: TablaEquipos.jsx (o TablaDatos.jsx)

import { useTable, useSortBy, usePagination } from "react-table";
import React from "react";
import PropTypes from "prop-types";

import { Button } from "primereact/button";
// Importa tus estilos si los moviste a un archivo CSS
// import './TablaEquipos.css'; // <<< Asegúrate de que esta línea exista y la ruta sea correcta si usas un archivo CSS


/**
 * Componente de tabla que utiliza react-table para paginación, ordenación y renderizado flexible.
 * Incluye controles de paginación básicos con PrimeReact.
 */
// *** 1. Consumir la prop 'loading' y otras props específicas ***
export const TablaEquipos = ({ columns, data, }) => { // Captura 'loading' y el resto en 'restProps'
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    //pageOptions,
    pageCount,
    //gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || [],
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // La prop 'loading' ahora está disponible aquí para ser usada (ej: mostrar un spinner o overlay)
  // {loading && <Spinner />} // Implementa tu indicador de carga si es necesario

  return (
    <div className="w-full">
      <table
        {...getTableProps()} // Esto pasa las props estándar de react-table (role="table", etc.)
        className="w-full border-separate tabla-react" // Aplica clases de estilo (Tailwind + tu clase CSS)
        style={{ borderSpacing: 0 }}
        // *** 1. NO PASAR la prop 'loading' al <table> ***
        // {...restProps} // Quita esto si no estás pasando otras props HTML válidas desde el padre
      >
        {/* Si usas un archivo CSS importado, elimina la etiqueta <style> */ }
        {/*
        <style jsx>{` // O <style> sin jsx si no usas styled-jsx
          // ... Tus estilos CSS aquí ...
        `}</style>
        */}
        <thead className="tabla-react">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
              {headerGroup.headers.map((column) => (
                 <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.getHeaderProps().key}
                     className={`tabla-react ${column.isSorted ? (column.isSortedDesc ? 'is-sorted-desc' : 'is-sorted-asc') : 'is-sorted-none'}`}
                 >
                   {column.render("Header")}
                 </th>
               ))}
            </tr>
          ))}
        </thead>
        {/* *** 2. Eliminar espacios en blanco o saltos de línea aquí *** */}
        <tbody {...getTableBodyProps()} className="tabla-react">{page.map((row) => { // Inicia el map inmediatamente después de <tbody>
            prepareRow(row);
            return ( // El <tr> inicia inmediatamente después del return
              <tr {...row.getRowProps()} key={row.getRowProps().key}>
                {row.cells.map((cell) => (
                   <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                     {cell.render("Cell")}
                   </td>
                 ))}
              </tr>
            );
          })}{/* 2. Cierra el map inmediatamente antes de </tbody> */}</tbody>
      </table>

      {/* Controles de Paginación (usan componentes de PrimeReact y HTML) */}
      <div className="flex justify-between items-center mt-3 p-2">
        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-left"
            className="p-button-rounded p-button-text p-button-sm" // Clases de PrimeReact
            onClick={previousPage}
            disabled={!canPreviousPage}
            tooltip="Página anterior"
          />
          <span className="text-sm">
            Página <strong>{pageIndex + 1}</strong> de{" "}
            <strong>{pageCount}</strong>
          </span>
          <Button
            icon="pi pi-angle-right"
            className="p-button-rounded p-button-text p-button-sm" // Clases de PrimeReact
            onClick={nextPage}
            disabled={!canNextPage}
            tooltip="Página siguiente"
          />
        </div>

        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Filas por página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="p-inputtext p-component p-inputtext-sm" // Clases de PrimeReact InputText
          >
            {[5, 10, 20, 30, 50, 100].map((size) => (
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

// Prop Types
TablaEquipos.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      accessor: PropTypes.string, // accessor puede ser opcional si se usa un 'id' de columna y Cell
      Cell: PropTypes.func,
      disableSortBy: PropTypes.bool,
      // Añade aquí proptypes para otras propiedades de columna que uses (ej: id si no usas accessor)
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool, // *** 1. Validar la prop loading como booleano ***
  // Puedes añadir validación para otras props que pases y uses en el componente
};

// No exportamos por defecto