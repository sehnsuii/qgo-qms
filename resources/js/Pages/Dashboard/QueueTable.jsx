import SecondaryButton from '@/Components/SecondaryButton';
import { useCallback, useMemo, useState } from 'react';
import { FaCheck, FaPause, FaPlay, FaSort, FaSortDown, FaSortUp, FaTimes } from 'react-icons/fa';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';

// Placeholder data - replace with actual props later
const defaultData = [];

// Placeholder function - replace with actual API call
const updateQueueStatus = async (id, status) => {
  console.log(`Updating queue ${id} to status: ${status}`);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, you'd likely refetch data or update local state based on API response
  return true;
};

// Define a default column filter UI
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
      className='mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
    />
  );
}

const getCustomerTypeStyles = (customerType) => {
  let customerTypeClass = '';
  switch (customerType) {
    case 'Priority':
      customerTypeClass = 'text-yellow-900';
      break;
    case 'Regular':
      customerTypeClass = 'text-blue-900';
      break;
    default:
      customerTypeClass = 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900';
      break;
  }
  return `px-4 py-1 rounded-full text-xs font-semibold inline-flex leading-5 ${customerTypeClass}`;
};

// Define status colors and styles
const getStatusStyles = (status) => {
  let statusClass = '';

  switch (status) {
    case 'Completed':
      statusClass = 'g-green-100 text-green-800 bg-gradient-to-r from-green-100 to-green-300';
      break;
    case 'Cancelled':
      statusClass = 'bg-gray-100 text-red-800 bg-gradient-to-r from-red-100 to-red-300';
      break;
    default:
      statusClass = 'bg-blue-100 text-blue-800';
  }

  if (status === 'Waiting') {
    statusClass = 'bg-gradient-to-r from-yellow-100 to-yellow-300';
  } else if (status === 'Now Serving') {
    statusClass = 'bg-gradient-to-r from-blue-100 to-blue-300';
  }

  return `px-4 py-1 rounded-full text-xs font-semibold inline-flex leading-5 ${statusClass}`;
};

export default function QueueTable({ data = defaultData }) {
  const [queueData, setQueueData] = useState(data);

  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    const success = await updateQueueStatus(id, newStatus);
    if (success) {
      setQueueData((prevData) => prevData.map((row) => (row.id === id ? { ...row, status: newStatus } : row)));
    }
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id', Filter: DefaultColumnFilter },
      { Header: 'Queue No.', accessor: 'queue_no', Filter: DefaultColumnFilter },
      {
        Header: 'Customer Type',
        accessor: 'customer_type',
        Filter: DefaultColumnFilter,
        Cell: ({ value }) => <span className={`${getCustomerTypeStyles(value)}`}>{value}</span>,
      },
      { Header: 'Service Type', accessor: 'service_type', Filter: DefaultColumnFilter },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: DefaultColumnFilter,
        Cell: ({ row }) => <span className={getStatusStyles(row.original.status, row.original.customer_type)}>{row.original.status}</span>,
      },
      {
        Header: 'Timestamp',
        accessor: 'timestamp',
        Filter: DefaultColumnFilter,
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ row }) => {
          const { id, status } = row.original;
          const isWaiting = status === 'Waiting';
          const isServing = status === 'Now Serving';
          const isCompleted = status === 'Completed';
          const isCancelled = status === 'Cancelled';

          return (
            <div className='flex space-x-1'>
              <button
                onClick={() => handleStatusUpdate(id, 'Waiting')}
                disabled={isWaiting || isCompleted || isCancelled}
                className={`rounded p-1 text-gray-600 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ${status === 'Waiting' ? 'bg-yellow-200' : ''}`}
                title='Set to Waiting'
              >
                <FaPause />
              </button>
              <button
                onClick={() => handleStatusUpdate(id, 'Now Serving')}
                disabled={isServing || isCancelled}
                className={`rounded p-1 text-blue-600 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 ${isServing ? 'bg-blue-200' : ''}`}
                title='Set to Now Serving'
              >
                <FaPlay />
              </button>
              <button
                onClick={() => handleStatusUpdate(id, 'Completed')}
                disabled={isWaiting || isCompleted || isCancelled}
                className={`rounded p-1 text-green-600 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 ${isCompleted ? 'bg-green-200' : ''}`}
                title='Set to Completed'
              >
                <FaCheck />
              </button>
              <button
                onClick={() => handleStatusUpdate(id, 'Cancelled')}
                disabled={isWaiting || isCompleted || isCancelled}
                className={`rounded p-1 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 ${isCancelled ? 'bg-red-200' : ''}`}
                title='Set to Cancelled'
              >
                <FaTimes />
              </button>
            </div>
          );
        },
      },
    ],
    [handleStatusUpdate], // Add handleStatusUpdate as dependency
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  );

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
      data: queueData,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  return (
    <div className='overflow-x-auto rounded-lg bg-white p-6 shadow-sm'>
      <h3 className='mb-4 text-lg font-semibold text-gray-700'>Today's Queues</h3>
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
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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
                {row.cells.map((cell) => {
                  return (
                    <td
                      key={`${row.id}-${cell.column.id}`}
                      {...cell.getCellProps()}
                      className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className='mt-4 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <SecondaryButton
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </SecondaryButton>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className='rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        >
          {[10, 20, 30, 40, 50].map((pageSizeOption) => (
            <option
              key={pageSizeOption}
              value={pageSizeOption}
            >
              Show {pageSizeOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
