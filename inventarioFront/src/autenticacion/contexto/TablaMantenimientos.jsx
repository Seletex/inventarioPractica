import { useTable, useSortBy, usePagination } from "react-table";
import { Button } from "primereact/button";
import PropTypes from "prop-types";

import { Tag } from "primereact/tag";

export const TablaMantenimientos = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageCount,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || [],
      initialState: { pageIndex: 0, pageSize: 10 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );
  const datosAMostrar = page || rows;
  return (
    <div className="w-full">
      {/* Tabla */}
      <table {...getTableProps()} className="w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="text-left p-3 border-b border-gray-200 bg-gray-50"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {datosAMostrar.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-50">
                {row.cells.map((cell) => {
                  // Renderizado especial para columnas de fecha
                  if (
                    cell.column.id === "fechaProgramada" ||
                    cell.column.id === "fechaRealizacion"
                  ) {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="p-3 border-b border-gray-200"
                      >
                        {cell.value ? (
                          <Tag
                            value={new Date(cell.value).toLocaleDateString()}
                            severity={
                              cell.column.id === "fechaRealizacion"
                                ? "success"
                                : (() => {
                                    const severity =
                                      new Date(cell.value) < new Date()
                                        ? "danger"
                                        : "info";
                                    return severity;
                                  })()
                            }
                          />
                        ) : (
                          <Tag value="Pendiente" severity="warning" />
                        )}
                      </td>
                    );
                  }

                  // Renderizado estándar para otras columnas
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="p-3 border-b border-gray-200"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 p-2 bg-gray-50 rounded">
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-double-left"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            tooltip="Primera página"
          />
          <Button
            icon="pi pi-angle-left"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            tooltip="Página anterior"
          />
          <span className="text-sm">
            Página <strong>{pageIndex + 1}</strong> de{" "}
            <strong>{pageOptions.length}</strong>
          </span>
          <Button
            icon="pi pi-angle-right"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            tooltip="Página siguiente"
          />
          <Button
            icon="pi pi-angle-double-right"
            className="p-button-rounded p-button-text p-button-sm"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            tooltip="Última página"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Filas por página:</span>
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
)};

TablaMantenimientos.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
};
TablaMantenimientos.defaultProps = {
  data: [],
};
export default TablaMantenimientos;
