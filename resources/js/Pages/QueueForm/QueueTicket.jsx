import React from 'react';

const QueueTicket = React.forwardRef(({ queueNumber, customerType, serviceName }, ref) => {
  const printDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const customerTypeClasses = () => {
    if (customerType === 'Priority') {
      return `text-yellow-600`;
    } else if (customerType === 'Regular') {
      return `text-blue-600`;
    }
  };

  return (
    <div
      ref={ref}
      className='print:flex print:min-h-screen print:items-center print:justify-center'
    >
      <div className='mx-auto max-w-sm rounded-lg border-2 border-dashed border-gray-500 p-12 text-center font-sans'>
        <div className='mb-4 text-sm'>{printDate}</div>
        <div className='align-center'>
          <img
            src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
            alt='Logo'
            className='mx-auto mb-4 h-32 w-auto'
          />
          <h1 className='text-2xl font-bold'>City of San Pedro Laguna</h1>
        </div>
        <div className='text-xl'>Queue Ticket</div>
        <div className='my-6 text-6xl font-bold text-green-600'>Q-{queueNumber}</div>
        <div className='text-2xl'>{serviceName}</div>
        <div className={`text-xl font-bold ${customerTypeClasses()}`}>{customerType}</div>
      </div>
    </div>
  );
});

QueueTicket.displayName = 'QueueTicket';

export default QueueTicket;
