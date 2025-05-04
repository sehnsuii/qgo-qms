import StepButtons from '@/Pages/QueueForm/StepButtons';
import { Head } from '@inertiajs/react';

const WelcomeStep = ({ onNextStep }) => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center text-center'>
      <Head title='Welcome!' />
      <h2 className='mb-8 font-[Verdana] text-7xl font-bold text-gray-800'>Welcome</h2>
      <h2 className='mb-8 text-2xl font-semibold text-gray-700'>to</h2>
      <h2 className='mb-8 text-4xl font-semibold text-gray-800'>City of San Pedro Laguna</h2>
      <hr className='mx-auto my-4 w-4/5 border-2 border-gray-300' />
      <p className='font-small mb-5 font-[Verdana] text-xl text-gray-600'>Please get your queue here</p>
      <StepButtons
        onNextStep={onNextStep}
        nextLabel='START'
        showPrev={false}
      />
    </div>
  );
};

export default WelcomeStep;
