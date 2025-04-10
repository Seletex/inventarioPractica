import { useTable, useSortBy } from 'react-table';

export const TablaEquipos = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    { columns, data },
    useSortBy
  );

  return (
    <table {...getTableProps()} className="w-full">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr 
            key={headerGroup.getHeaderGroupProps().key} // Key directa
            {...headerGroup.getHeaderGroupProps()} 
          >
            {headerGroup.headers.map(column => (
              <th
                key={column.getHeaderProps().key} // Key directa
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr
              key={row.getRowProps().key} // Key directa
              {...row.getRowProps()}
            >
              {row.cells.map(cell => (
                <td
                  key={cell.getCellProps().key} // Key directa
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};