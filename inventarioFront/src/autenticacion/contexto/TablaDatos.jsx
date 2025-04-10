import { useState, useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export const TablaEquipos = ({ columns: userColumns, data: userData ,onEdit,onDelete}) => {
  // Configuración de columnas con acciones
  const columns = useMemo(() => [
    ...userColumns,
    {
      Header: 'Acciones',
      accessor: 'acciones',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            icon="pi pi-pencil" 
            className="p-button-sm p-button-rounded p-button-text"
            tooltip="Editar equipo"
            onClick={() => onEdit(row.original)}
          />
          <Button 
            icon="pi pi-trash" 
            className="p-button-sm p-button-rounded p-button-text p-button-danger"
            tooltip="Eliminar equipo"
            onClick={() => onDelete(row.original.id)}
          />
        </div>
      ),
    }
  ], [userColumns,onEdit,onDelete]);

  // Estados y hooks de react-table
  const [filterInput, setFilterInput] = useState('');
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data: userData,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    useGlobalFilter,
    usePagination
  );

  // Manejadores
  const handleFilterChange = e => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setFilterInput(value);
  };

  

  return (
    <div className="card p-fluid">
      {/* Header con título y buscador */}
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de equipos</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterInput}
            onChange={handleFilterChange}
            placeholder="Buscar equipo..."
          />
        </span>
      </div>

      {/* Tabla principal */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className="p-3 text-left font-medium text-gray-600"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="p-3 border-b border-gray-200"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-double-left"
            className="p-button-rounded p-button-text"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />
          <Button
            icon="pi pi-angle-left"
            className="p-button-rounded p-button-text"
            onClick={previousPage}
            disabled={!canPreviousPage}
          />
          <span className="mx-2">
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>
          </span>
          <Button
            icon="pi pi-angle-right"
            className="p-button-rounded p-button-text"
            onClick={nextPage}
            disabled={!canNextPage}
          />
          <Button
            icon="pi pi-angle-double-right"
            className="p-button-rounded p-button-text"
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
          />
        </div>

        <div className="flex items-center gap-2">
          <span>Mostrar:</span>
          <Dropdown
            value={pageSize}
            options={[5, 10, 20, 50]}
            onChange={(e) => setPageSize(Number(e.value))}
            style={{ width: '70px' }}
          />
          <span>registros</span>
        </div>
      </div>
    </div>
  );
};