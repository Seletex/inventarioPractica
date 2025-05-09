// Archivo: src/autenticacion/contexto/TablaDatos.jsx

import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export const TablaEquipos = ({ columns, data, loading = false }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
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
    usePagination,
    useRowSelect
  );

  const datosAMostrar = page;

  return (
    <div className="w-full overflow-x-auto">
      <table {...getTableProps()} className="w-full border-collapse">
        <style>{`
          th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; vertical-align: middle; }
          thead th { background-color: #f9fafb; font-weight: 600; position: sticky; top: 0; z-index: 1; }
          tbody tr:hover { background-color: #f0f9ff; }
          th[style*="cursor: pointer"] { cursor: pointer; }
        `}</style>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: headerKey, ...restHeaderProps } =
                    column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th
                      key={headerKey}
                      {...restHeaderProps}
                      style={
                        column.canSort
                          ? { cursor: "pointer", width: column.width }
                          : { width: column.width }
                      }
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-6 text-gray-500"
              >
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <span className="ml-2">Cargando...</span>
              </td>
            </tr>
          )}

          {!loading && datosAMostrar.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-6 text-gray-500 italic"
              >
                No se encontraron datos para mostrar.
              </td>
            </tr>
          )}

          {!loading &&
            datosAMostrar.map((row) => {
              prepareRow(row);

              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...restCellProps } =
                      cell.getCellProps();
                    return (
                      <td key={cellKey} {...restCellProps}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>

      {!loading && data && data.length > 0 && pageOptions.length > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-2 gap-4 border-t pt-3">
          {/* Navegación */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              icon="pi pi-angle-double-left"
              className="p-button-rounded p-button-text p-button-sm"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              tooltip="Primera página"
              aria-label="Primera página"
            />
            <Button
              icon="pi pi-angle-left"
              className="p-button-rounded p-button-text p-button-sm"
              onClick={previousPage}
              disabled={!canPreviousPage}
              tooltip="Página anterior"
              aria-label="Página anterior"
            />
            <span className="text-sm whitespace-nowrap px-2">
              Página{" "}
              <strong>
                {pageIndex + 1} de {pageOptions.length}
              </strong>
            </span>
            <Button
              icon="pi pi-angle-right"
              className="p-button-rounded p-button-text p-button-sm"
              onClick={nextPage}
              disabled={!canNextPage}
              tooltip="Página siguiente"
              aria-label="Página siguiente"
            />
            <Button
              icon="pi pi-angle-double-right"
              className="p-button-rounded p-button-text p-button-sm"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              tooltip="Última página"
              aria-label="Última página"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Filas:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="p-inputtext p-component p-inputtext-sm rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filas por página"
            >
              {[5, 10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
