const CounterListItem = ({ counter }) => {
  const servingQueue = counter.queue;

  let counterStateColor, borderColor, bgColor, gradientClass, statusText;

  if (!counter.user_id) {
    statusText = 'Offline';
    counterStateColor = 'text-white';
    borderColor = 'border-gray-300';
    bgColor = 'bg-gray-50';
    gradientClass = 'bg-gradient-to-r from-gray-500 to-gray-600';
  } else if (counter.status === 'Busy' && servingQueue) {
    statusText = 'Now Serving';
    counterStateColor = 'text-white';
    borderColor = 'border-red-300';
    bgColor = 'bg-red-50';
    gradientClass = 'bg-gradient-to-r from-red-600 to-red-700';
  } else if (counter.status === 'Ready') {
    statusText = 'Ready';
    counterStateColor = 'text-white';
    borderColor = 'border-green-300';
    bgColor = 'bg-green-50';
    gradientClass = 'bg-gradient-to-r from-green-500 to-green-600';
  } else {
    statusText = 'Not Ready';
    counterStateColor = 'text-white';
    borderColor = 'border-amber-300';
    bgColor = 'bg-amber-50';
    gradientClass = 'bg-gradient-to-r from-amber-500 to-amber-600';
  }

  const isPriority = servingQueue?.customer_type === 'Priority';
  const queueNumberClass = isPriority
    ? 'w-full m-4 animate-pulse rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-6 text-center text-7xl font-bold text-white'
    : 'w-full m-4 animate-pulse rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-2 py-6 text-center text-7xl font-bold text-white';

  return (
    <div className={`flex flex-col rounded-lg border-2 ${borderColor} ${bgColor} p-6 shadow-lg`}>
      <div className='text-center'>
        <div className={`mb-2 inline-block rounded-full px-6 py-1 text-2xl font-bold ${counterStateColor} ${gradientClass}`}>Counter {counter.id}</div>
      </div>
      <div className='flex flex-grow flex-col items-center justify-center gap-2'>
        {statusText === 'Offline' ? (
          <div className='text-center text-2xl font-medium text-gray-500'>{statusText}</div>
        ) : statusText === 'Now Serving' && servingQueue ? (
          <>
            <div className='text-center text-2xl font-medium text-red-800'>{statusText}</div>
            <div className={queueNumberClass}>Q-{servingQueue.queue_number}</div>
            <div className={`text-center text-2xl ${isPriority ? 'font-bold text-yellow-600' : 'font-medium text-blue-600'}`}>({servingQueue.customer_type})</div>
          </>
        ) : statusText === 'Ready' ? (
          <div className='text-center text-2xl font-medium text-green-700'>{statusText}</div>
        ) : statusText === 'Not Ready' ? (
          <div className='text-center text-2xl font-medium text-amber-600'>{statusText}</div>
        ) : (
          <div className='text-center text-2xl font-medium text-gray-400'>-</div>
        )}
      </div>
    </div>
  );
};

export default CounterListItem;
