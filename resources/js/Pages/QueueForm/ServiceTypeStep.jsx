import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';

const ServiceTypeStep = ({ formData, services, loadingServices, submitting, onSelect, onSubmit, onPrevStep }) => {
  return (
    <div className='w-full text-center'>
      <Head title='Service Type' />
      <h2 className='mb-6 text-3xl font-bold text-gray-800'>Select Service</h2>
      <p className='mb-8 text-lg text-gray-600'>What type of service do you need?</p>

      <div className='mb-10 grid grid-cols-2 gap-6'>
        {loadingServices ? (
          <p>Loading services...</p>
        ) : services.length > 0 ? (
          services.map((service) => (
            <SecondaryButton
              key={service.id}
              onClick={() => onSelect('serviceId', service.id)}
              className={`p-6 text-lg font-bold transition-all duration-200 ${
                formData.serviceId === service.id ? 'scale-105 transform bg-green-600 text-white hover:bg-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {service.name}
            </SecondaryButton>
          ))
        ) : (
          <p>No services available at this time.</p>
        )}
      </div>

      <div className='flex justify-center gap-6'>
        <SecondaryButton
          onClick={onPrevStep}
          className='px-10 py-4 text-lg font-bold'
        >
          Back
        </SecondaryButton>

        <PrimaryButton
          onClick={onSubmit}
          disabled={!formData.serviceId || submitting || loadingServices || services.length === 0}
          className={`ml-4 px-10 py-4 text-lg font-bold ${!formData.serviceId || services.length === 0 ? 'cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ServiceTypeStep;
