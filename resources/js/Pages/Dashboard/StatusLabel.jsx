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

export default function StatusLabel({ status }) {
  return <span className={getStatusStyles(status)}>{status}</span>;
}
