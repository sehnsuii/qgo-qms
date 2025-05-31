import { useMemo } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { usePagination, useSortBy, useTable } from 'react-table';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Ready':
      return 'bg-green-100 text-green-800';
    case 'Busy':
      return 'bg-yellow-100 text-yellow-800';
    case 'Not Ready':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CounterTable({ data = placeholderCounters }) {
  const columns = useMemo(
    () => [
      { Header: 'Counter No.', accessor: 'id' },
      { Header: 'Assigned User', accessor: 'user_name' },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => <span className={`rounded px-2 py-1 text-xs font-semibold ${getStatusStyles(value)}`}>{value}</span>,
      },
      { Header: 'Currently Serving', accessor: 'queue_no' },
    ],
    [],
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 6 },
    },
    useSortBy,
    usePagination,
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = tableInstance;

  return (
    <div className='mb-6 overflow-x-auto rounded-lg bg-white p-6 shadow-sm'>
      <h3 className='mb-4 text-lg font-semibold text-gray-700'>Counters</h3>
      <table
        {...getTableProps()}
        className='min-w-full divide-y divide-gray-200'
      >
        <thead className='bg-gray-50'>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
                >
                  <div className='flex items-center justify-between'>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaSortDown className='ml-1 inline-block' />
                        ) : (
                          <FaSortUp className='ml-1 inline-block' />
                        )
                      ) : (
                        column.canSort && <FaSort className='ml-1 inline-block opacity-30' />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className='divide-y divide-gray-200 bg-white'
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                {...row.getRowProps()}
                className='hover:bg-gray-50'
              >
                {row.cells.map((cell) => (
                  <td
                    key={`${row.id}-${cell.column.id}`}
                    {...cell.getCellProps()}
                    className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'
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
  );
}
