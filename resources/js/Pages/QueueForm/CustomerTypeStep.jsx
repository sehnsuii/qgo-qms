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
      <h2 className='mb-6 text-3xl font-bold text-gray-800'>Select Customer Type</h2>
      <p className='mb-8 text-lg text-gray-600'>Are you a priority or regular customer?</p>

      <div className='mb-10 flex justify-center gap-8'>
        <SecondaryButton
          onClick={() => onSelect('customerType', 'Priority')}
          className={`w-96 h-48 px-12 py-10 text-xl font-bold transition-all duration-300 rounded-lg shadow-md flex flex-col items-center justify-center gap-4 ${
            formData.customerType === 'Priority' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-transparent' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
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
          className={`w-96 h-48 px-12 py-10 text-xl font-bold transition-all duration-300 rounded-lg shadow-md flex flex-col items-center justify-center gap-4 ${
            formData.customerType === 'Regular' ? 'bg-gradient-to-br from-sky-400 to-cyan-500 text-white border-transparent' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
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
