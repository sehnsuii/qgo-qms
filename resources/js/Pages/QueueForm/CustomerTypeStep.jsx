import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const CustomerTypeStep = ({ formData, onSelect, onNextStep, onPrevStep }) => {
  return (
    <div className='w-full text-center'>
      <h2 className='mb-6 text-3xl font-bold text-gray-800'>Select Customer Type</h2>
      <p className='mb-8 text-lg text-gray-600'>Are you a priority or regular customer?</p>

      <div className='mb-10 flex justify-center gap-8'>
        <SecondaryButton
          onClick={() => onSelect('customerType', 'Priority')}
          className={`px-8 py-12 text-xl font-bold transition-all duration-200 ${
            formData.customerType === 'Priority' ? 'scale-105 transform bg-yellow-600 text-white hover:bg-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Priority Customer
        </SecondaryButton>

        <SecondaryButton
          onClick={() => onSelect('customerType', 'Regular')}
          className={`px-8 py-12 text-xl font-bold transition-all duration-200 ${
            formData.customerType === 'Regular' ? 'scale-105 transform bg-blue-600 text-white hover:bg-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Regular Customer
        </SecondaryButton>
      </div>
      <div className='flex justify-center gap-6'>
        <SecondaryButton
          onClick={onPrevStep}
          className='px-10 py-4 text-lg font-bold'
        >
          Back
        </SecondaryButton>

        <PrimaryButton
          onClick={onNextStep}
          disabled={!formData.customerType}
          className={`ml-4 px-10 py-4 text-lg font-bold ${!formData.customerType ? 'cursor-not-allowed' : ''}`}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CustomerTypeStep;
