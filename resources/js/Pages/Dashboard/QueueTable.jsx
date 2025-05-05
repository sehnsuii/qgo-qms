import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { usePagination, useSortBy, useTable } from 'react-table';
import QueueTablePagination from './QueueTablePagination';
import QueueTableRow from './QueueTableRow';

const defaultData = [];

const getCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.getAttribute('content') : null;
};

const updateQueueStatus = async (id, status) => {
  console.log(`Updating queue ${id} to status: ${status}`);
  let endpoint = '';
  switch (status) {
    case 'Waiting':
      endpoint = `/api/queues/${id}/wait`;
      break;
    case 'Now Serving':
      endpoint = `/api/queues/${id}/serve`;
      break;
    case 'Completed':
      endpoint = `/api/queues/${id}/complete`;
      break;
    case 'Cancelled':
      endpoint = `/api/queues/${id}/cancel`;
      break;
    default:
      console.error('Invalid status:', status);
      return false;
  }

  try {
    const csrfToken = getCsrfToken();
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json',
      },
      // body: JSON.stringify({ status }) // Body might not be needed if endpoint implies status
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to update status for queue ${id}:`, response.status, errorData.message || 'Unknown error');
      return false;
    }

    console.log(`Queue ${id} status updated to ${status} successfully.`);
    return true;
  } catch (error) {
    console.error(`Error updating status for queue ${id}:`, error);
    return false;
  }
};

export default function QueueTable() {
  const [queueData, setQueueData] = useState(defaultData);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch('/api/queues/dates');
        if (!response.ok) {
          throw new Error('Failed to fetch dates');
        }
        const dates = await response.json();
        const todayStr = dayjs().format('YYYY-MM-DD');
        const updatedDates = [...new Set([todayStr, ...dates])].sort((a, b) => b.localeCompare(a));
        setAvailableDates(updatedDates);
      } catch (err) {
        console.error('Error fetching dates:', err);
        setAvailableDates([dayjs().format('YYYY-MM-DD')]);
      }
    };
    fetchDates();
  }, []);

  useEffect(() => {
    let intervalId = null;

    const fetchQueueData = async () => {
      if (!selectedDate) return;

      setError(null);
      try {
        const response = await fetch(`/api/queues?date=${selectedDate}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch queue data for ${selectedDate}`);
        }
        const result = await response.json();
        const mappedData = result.data.map((q) => ({
          id: q.id,
          queue_no: `Q-${String(q.queue_number)}`,
          customer_type: q.customer_type,
          service_type: q.service ? q.service.name : 'N/A',
          status: q.status,
          timestamp: q.created_at,
        }));
        setQueueData(mappedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching queue data:', err);
        setQueueData(defaultData);
      }
    };

    fetchQueueData();

    intervalId = setInterval(fetchQueueData, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedDate]);

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

  return (
    <div className='overflow-x-auto rounded-lg bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-700'>Queues</h3>
        <div className='flex items-center'>
          <label
            htmlFor='date-select'
            className='mr-2 text-sm font-medium text-gray-700'
          >
            Date:
          </label>
          <select
            id='date-select'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className='rounded border-gray-300 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            disabled={availableDates.length === 0}
          >
            {availableDates.map((date) => (
              <option
                key={date}
                value={date}
                className={date === dayjs().format('YYYY-MM-DD') ? 'font-bold' : ''}
              >
                {dayjs(date).format('MMM D, YYYY')}
                {date === dayjs().format('YYYY-MM-DD') ? ' (Today)' : ''}
              </option>
            ))}
            {availableDates.length === 0 && <option disabled>Loading dates...</option>}
          </select>
        </div>
      </div>

      {error && <p className='py-4 text-center text-red-500'>Error loading queues: {error}</p>}

      <>
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
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <QueueTableRow
                    key={row.original.id}
                    row={row}
                    prepareRow={prepareRow}
                    handleStatusUpdate={handleStatusUpdate}
                  />
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-6 py-4 text-center text-sm text-gray-500'
                >
                  No queues found for {dayjs(selectedDate).format('MMM D, YYYY')}.
                </td>
              </tr>
            )}
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
      </>
    </div>
  );
}
