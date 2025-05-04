import StepButtons from '@/Pages/QueueForm/StepButtons';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

const WelcomeStep = ({ onNextStep }) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script&family=Montserrat:wght@300&family=Open+Sans&family=Playfair+Display:wght@700&family=Roboto+Slab:wght@600&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 text-center'>
      <Head title='Welcome!' />
      <h2 className='font-["Dancing_Script"] text-7xl font-bold text-green-800 drop-shadow-sm'>Welcome</h2>
      <h2 className='font-["Open_Sans"] text-2xl font-light tracking-wider text-green-800'>TO</h2>
      <h2 className='font-["Montserrat"] text-4xl font-semibold text-green-800'>City of San Pedro Laguna</h2>
      <div className='my-4 flex w-4/5 items-center gap-4'>
        <hr className='border-1 flex-grow border-gray-400' />
        <span className='font-["Dancing_Script"] text-3xl text-gray-500'>Queue System</span>
        <hr className='border-1 flex-grow border-gray-400' />
      </div>
      <p className='font-["Montserrat"] text-2xl font-semibold text-gray-800'>Please get your queue here.</p>
      <StepButtons
        onNextStep={onNextStep}
        nextLabel='START'
        showPrev={false}
      />
    </div>
  );
};

export default WelcomeStep;
