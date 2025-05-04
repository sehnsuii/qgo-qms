const LandingLayout = ({ laravelVersion, phpVersion, children }) => {
  return (
    <div className='flex min-h-screen flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50'>
      <img
        className='absolute inset-0 h-full w-full object-cover'
        src='https://upload.wikimedia.org/wikipedia/commons/a/ad/6346Poblacion_City_Hall_San_Pedro_Laguna_27.jpg'
        alt='San Pedro Laguna City Hall'
      />

      <header className='relative flex w-full items-center justify-between bg-white px-6 py-4 shadow-md'>
        <div className='flex w-1/3 items-center'>
          <img
            src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
            alt='SP Logo'
            className='mr-4 h-12'
          />
          <h1 className='text-xl font-semibold text-black'>City of San Pedro Laguna</h1>
        </div>
        <div className='flex justify-center'>
          <img
            src='https://i.pinimg.com/736x/b0/1d/a1/b01da1459e9c98b05f0458aeecc6a87f.jpg'
            alt='QGo Logo'
            className='h-16'
          />
        </div>
      </header>

      <div className='relative flex w-full flex-1 items-center justify-center'>{children}</div>

      <footer className='relative mt-auto w-full bg-white py-4 text-center text-sm text-black shadow-md'>
        QGo {laravelVersion} (PHP v{phpVersion})
      </footer>
    </div>
  );
};

export default LandingLayout;
