import React from 'react';

const QueueTicket = React.forwardRef(({ queueNumber, customerType, serviceName }, ref) => {
  const printDate = new Date().toLocaleString();

  return (
    <div
      ref={ref}
      className='hidden p-5 print:block'
    >
      <div className='mx-auto max-w-xs border-2 border-dashed border-black p-5 text-center font-sans'>
        <div className='mb-4'>
          <img
            src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
            width='80'
            alt='Logo'
            className='mx-auto'
          />
          <h2 className='mt-2 text-xl font-semibold'>City of San Pedro Laguna</h2>
        </div>
        <div className='my-1'>Queue Ticket</div>
        <div className='my-2 text-2xl font-bold text-blue-600'>Q-{queueNumber}</div>
        <div className='my-1 text-sm'>Customer Type: {customerType}</div>
        <div className='my-1 text-sm'>Service: {serviceName}</div>
        <div className='my-1 text-sm'>Date: {printDate}</div>
      </div>
    </div>
  );
});

QueueTicket.displayName = 'QueueTicket';

export default QueueTicket;
