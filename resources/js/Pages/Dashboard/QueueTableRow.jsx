import { FaCheck, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import StatusLabel from './StatusLabel';

const getCustomerTypeStyles = (customerType) => {
  let customerTypeClass = '';
  switch (customerType) {
    case 'Priority':
      customerTypeClass = 'text-yellow-500 font-bold';
      break;
    case 'Regular':
      customerTypeClass = 'text-blue-500';
      break;
    default:
      customerTypeClass = 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900';
      break;
  }
  return `${customerTypeClass}`;
};

export default function QueueTableRow({ row, prepareRow, handleStatusUpdate }) {
  prepareRow(row);
  const { id, status, customer_type, timestamp } = row.original;
  const isWaiting = status === 'Waiting';
  const isServing = status === 'Now Serving';
  const isCompleted = status === 'Completed';
  const isCancelled = status === 'Cancelled';

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <tr
      {...row.getRowProps()}
      className={`hover:bg-gray-50 ${getCustomerTypeStyles(customer_type)}`}
    >
      {row.cells.map((cell) => {
        const cellProps = cell.getCellProps();
        let cellContent = cell.render('Cell');
        const baseClass = 'rounded p-1 disabled:cursor-not-allowed disabled:opacity-50 ';

        if (cell.column.id === 'customer_type') {
          cellContent = <span className={getCustomerTypeStyles(customer_type)}>{customer_type}</span>;
        } else if (cell.column.id === 'status') {
          cellContent = <StatusLabel status={status} />;
        } else if (cell.column.id === 'timestamp') {
          cellContent = formatTime(timestamp);
        } else if (cell.column.id === 'actions') {
          cellContent = (
            <div className='flex space-x-1'>
              <button
                onClick={() => handleStatusUpdate(id, 'Waiting')}
                disabled={isWaiting || isCompleted || isCancelled}
                className={`${baseClass}text-gray-600 hover:bg-gray-200 ${isWaiting ? 'bg-yellow-200' : ''}`}
                title='Set to Waiting'
              >
                <FaPause />
              </button>
              <button
                onClick={() => handleStatusUpdate(id, 'Now Serving')}
                disabled={isServing || isCompleted || isCancelled}
                className={`${baseClass} text-blue-600 hover:bg-blue-100 ${isServing ? 'bg-blue-200' : ''}`}
                title='Set to Now Serving'
              >
                <FaPlay />
              </button>
              <button
                onClick={() => handleStatusUpdate(id, 'Completed')}
                disabled={isWaiting || isCompleted || isCancelled}
                className={`${baseClass} text-green-600 hover:bg-green-100 ${isCompleted ? 'bg-green-200' : ''}`}
                title='Set to Completed'
              >
                <FaCheck />
              </button>
              <button
                onClick={() => handleStatusUpdate(id, 'Cancelled')}
                disabled={isWaiting || isCompleted || isCancelled}
                className={`${baseClass} text-red-600 hover:bg-red-100 ${isCancelled ? 'bg-red-200' : ''}`}
                title='Set to Cancelled'
              >
                <FaTimes />
              </button>
            </div>
          );
        }

        return (
          <td
            key={`${row.id}-${cell.column.id}`}
            {...cellProps}
            className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'
          >
            {cellContent}
          </td>
        );
      })}
    </tr>
  );
}
