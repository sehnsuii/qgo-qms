const WaitingListItem = ({ queue, isFirst }) => {
  const isPriority = queue.customer_type === 'Priority';
  const gradientClass = isPriority ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' : 'bg-gradient-to-r from-blue-100 to-blue-200';
  const borderClass = isFirst ? (isPriority ? 'border-2 border-yellow-400' : 'border border-blue-400') : '';

  return (
    <div className={`rounded-lg p-3 text-center shadow-xl ${gradientClass} ${borderClass}`}>
      <div className='flex flex-row items-center justify-between gap-8 p-4'>
        <div className='whitespace-nowrap text-3xl font-bold text-gray-800'>Q-{queue.queue_number}</div>

        <div className='hidden flex-col truncate whitespace-nowrap md:flex'>
          <div className='truncate text-2xl text-gray-600'>{queue.service?.name}</div>
          <div className='truncate text-gray-500'>{queue.customer_type}</div>
        </div>

        <div className='truncate text-gray-500 sm:block'>
          {new Date(queue.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default WaitingListItem;
