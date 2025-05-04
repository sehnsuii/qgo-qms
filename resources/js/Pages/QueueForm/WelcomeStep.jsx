import PrimaryButton from '@/Components/PrimaryButton';
import { Head } from '@inertiajs/react';

const WelcomeStep = ({ onNextStep }) => {
  return (
    <div className='relative flex w-full flex-1 items-center justify-center'>
      <Head title='Welcome!' />
      <div className='flex h-[510px] w-[800px] flex-col items-center justify-center rounded-3xl bg-green-600 p-10 shadow-lg'>
        <h2 className='mb-8 font-[Verdana] text-7xl font-bold text-white'>Welcome</h2>
        <h2 className='mb-8 text-2xl font-semibold text-white'>to</h2>
        <h2 className='mb-8 text-4xl font-semibold text-white'>City of San Pedro Laguna</h2>
        <hr className='mx-auto my-4 w-4/5 border-2 border-white' />
        <p className='font-small mb-5 font-[Verdana] text-xl text-white'>Please get your queue here</p>

        <PrimaryButton
          onClick={onNextStep}
          className='mt-5 px-14 py-5 text-lg'
        >
          START
        </PrimaryButton>
      </div>
    </div>
  );
};

export default WelcomeStep;
