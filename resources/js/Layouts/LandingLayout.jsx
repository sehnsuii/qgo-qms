import ApplicationLogo from '@/Components/ApplicationLogo';

const LandingLayout = ({ laravelVersion, phpVersion, children }) => {
  return (
    <div className='relative flex min-h-screen flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50'>
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <img
          className='h-full min-h-full w-full min-w-full object-cover object-center'
          src='https://upload.wikimedia.org/wikipedia/commons/a/ad/6346Poblacion_City_Hall_San_Pedro_Laguna_27.jpg'
          alt='San Pedro Laguna City Hall'
        />
      </div>

      <header className='relative z-10 flex w-full items-center justify-between bg-white px-6 py-4 shadow-md'>
        <div className='flex w-1/3 items-center'>
          <img
            src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
            alt='SP Logo'
            className='mr-4 h-12'
          />
          <h1 className='text-xl font-semibold text-black'>City of San Pedro Laguna</h1>
        </div>
        <div className='flex justify-center'>
          <ApplicationLogo className='block h-16 w-auto md:object-cover' />
        </div>
      </header>

      <div className='relative z-10 flex w-full flex-1 items-center justify-center'>{children}</div>

      <footer className='relative z-10 bg-green-100 py-4 text-center text-sm text-green-800'>
        <p>
          © {new Date().getFullYear()} City of San Pedro Laguna - QGO Queue Management System
        </p>
      </footer>
    </div>
  );
};

export default LandingLayout;