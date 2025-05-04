import { Head } from '@inertiajs/react';

const QueueDisplayHeader = ({ currentTime }) => {
  return (
    <div className='rounded-xl bg-gradient-to-r from-green-800 to-green-600 p-6 text-white shadow-xl'>
      <div className='flex items-center justify-between'>
        <div>
          <img
            src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
            alt='City Logo'
            className='mr-4 inline-block h-16'
          />
          <h1 className='font-montserrat inline-block align-middle text-4xl font-bold'>City of San Pedro Laguna</h1>
        </div>
        <div className='text-right'>
          <div className='font-roboto text-3xl'>{currentTime.toLocaleTimeString()}</div>
          <div className='font-roboto text-xl'>
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const QueueDisplayFooter = () => {
  return (
    <div className='font-roboto mt-auto pt-6 text-center text-sm text-green-700'>
      <p>Please wait for your number to be called. Thank you for your patience.</p>
      <p className='mt-2'>© {new Date().getFullYear()} City of San Pedro Laguna - Queue Management System</p>
    </div>
  );
};

const QueueDisplayLayout = ({ children, currentTime }) => {
  return (
    <>
      <Head title='Queue Display'>
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap'
          rel='stylesheet'
        />
      </Head>
      <div className='font-roboto flex min-h-screen flex-col bg-green-50 p-4'>
        <QueueDisplayHeader currentTime={currentTime} />
        <main className='mt-4 flex flex-grow flex-col'>{children}</main>
        <QueueDisplayFooter />
      </div>
    </>
  );
};

export default QueueDisplayLayout;
