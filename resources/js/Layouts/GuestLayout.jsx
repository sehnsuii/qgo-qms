import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
  return (
    <div className='flex min-h-screen flex-col items-center bg-white pt-6 sm:justify-center sm:pt-0'>
      <div>
        <ApplicationLogo className='h-48 w-auto' />
      </div>

      <div className='mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg'>{children}</div>
    </div>
  );
}
