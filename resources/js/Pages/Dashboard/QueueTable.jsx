import { useCallback, useMemo, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { usePagination, useSortBy, useTable } from 'react-table';
import QueueTablePagination from './QueueTablePagination';
import QueueTableRow from './QueueTableRow';

const defaultData = [];

const updateQueueStatus = async (id, status) => {
  console.log(`Updating queue ${id} to status: ${status}`);
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, you'd likely refetch data or update local state based on API response
  return true;
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
      { Header: 'Queue No.', accessor: 'queue_no' },
      { Header: 'Customer Type', accessor: 'customer_type' },
      { Header: 'Service Type', accessor: 'service_type' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Time', accessor: 'timestamp' },
      { Header: 'Actions', accessor: 'actions', disableSortBy: true },
    ],
    [],
  );

  const tableInstance = useTable(
    {
      columns,
      data: queueData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination,
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
  } = tableInstance;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='overflow-x-auto rounded-lg bg-white p-6 shadow-sm'>
      <h3 className='mb-4 text-lg font-semibold text-gray-700'>Today's Queues - {formattedDate}</h3>
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
          {page.map((row) => (
            <QueueTableRow
              key={row.id}
              row={row}
              prepareRow={prepareRow}
              handleStatusUpdate={handleStatusUpdate}
            />
          ))}
        </tbody>
      </table>

      <QueueTablePagination
        gotoPage={gotoPage}
        previousPage={previousPage}
        nextPage={nextPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
}
