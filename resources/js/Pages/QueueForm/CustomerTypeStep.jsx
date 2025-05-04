import SecondaryButton from '@/Components/SecondaryButton';
import StepButtons from '@/Pages/QueueForm/StepButtons';
import { Head } from '@inertiajs/react';
import { FaUsers, FaWheelchair } from 'react-icons/fa';
import { FaPersonCane } from 'react-icons/fa6';
import { MdOutlinePregnantWoman } from 'react-icons/md';

const CustomerTypeStep = ({ formData, onSelect, onNextStep, onPrevStep }) => {
  return (
    <div className='w-full text-center'>
      <Head title='Customer Type' />
      <h2 className='text-3xl font-bold text-gray-800'>Select Customer Type</h2>
      <p className='text-lg text-gray-600'>Are you a priority or regular customer?</p>

      <div className='mt-10 flex justify-center gap-8'>
        <SecondaryButton
          onClick={() => onSelect('customerType', 'Priority')}
          className={`flex h-48 w-96 flex-col items-center justify-center gap-4 rounded-lg px-12 py-10 text-xl font-bold shadow-md transition-all duration-300 ${
            formData.customerType === 'Priority' ? 'border-transparent bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
          }`}
        >
          <div className='flex gap-3 text-7xl'>
            <FaWheelchair />
            <FaPersonCane />
            <MdOutlinePregnantWoman />
          </div>
          <span>Priority</span>
        </SecondaryButton>

        <SecondaryButton
          onClick={() => onSelect('customerType', 'Regular')}
          className={`flex h-48 w-96 flex-col items-center justify-center gap-4 rounded-lg px-12 py-10 text-xl font-bold shadow-md transition-all duration-300 ${
            formData.customerType === 'Regular' ? 'border-transparent bg-gradient-to-br from-sky-400 to-cyan-500 text-white' : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
          }`}
        >
          <div className='text-7xl'>
            <FaUsers />
          </div>
          <span>Regular</span>
        </SecondaryButton>
      </div>
      <StepButtons
        onPrevStep={onPrevStep}
        onNextStep={onNextStep}
        nextDisabled={!formData.customerType}
      />
    </div>
  );
};

export default CustomerTypeStep;
