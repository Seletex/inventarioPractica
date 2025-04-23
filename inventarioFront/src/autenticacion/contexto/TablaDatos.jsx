import { useTable, useSortBy } from "react-table";
import React from "react";

import { Button } from "primereact/button"; // Importa Button
import "primereact/resources/themes/saga-blue/theme.css"; // Tema opcional
import "primereact/resources/primereact.min.css"; // Estilos base
import "primeicons/primeicons.css"; // Iconos

export const TablaEquipos = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page, // Usa page en lugar de rows para mostrar solo la página actual
    canPreviousPage,
    canNextPage,
    pageOptions,
    // pageCount,
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
    useSortBy
    //  usePagination
  );
  const datosAMostrar = page || rows;

  return (
    <div className="w-full">
      <table
        {...getTableProps()}
        className="w-full border-separate"
        style={{ borderSpacing: 0 }}
      >
        <style>{`
        th, td {
          border-right: 1px solid #e5e7eb;
          padding: 0.5rem;
        }
        th:last-child, td:last-child {
          border-right: none;
        }
      `}</style>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...headerGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: headerKey, ...headerProps } =
                    column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th key={headerKey} {...headerProps}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {datosAMostrar.map((row) => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <tr key={rowKey} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={cellKey} {...cellProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-3 p-2">
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-left"
            className="p-button-rounded p-button-text p-button-sm items-center text-align-center"
            onClick={previousPage}
            disabled={!canPreviousPage}
            tooltip="Página anterior"
          />
          <span className="text-sm">
            Página <strong>{pageIndex + 1}</strong> de{" "}
            <strong>{pageOptions}</strong>
          </span>
          <Button
            icon="pi pi-angle-right"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={nextPage}
            disabled={!canNextPage}
            tooltip="Página siguiente"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Filas:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="p-inputtext p-component p-inputtext-sm"
          >
            {[5, 10, 20, 30, 50].map((size) => (
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
