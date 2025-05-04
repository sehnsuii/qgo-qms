import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';
import { FaBookOpen, FaBriefcaseMedical, FaClock, FaCross, FaFolderOpen, FaQuestionCircle } from 'react-icons/fa';

const ServiceTypeStep = ({ formData, services, loadingServices, submitting, onSelect, onSubmit, onPrevStep }) => {
  const getServiceIcon = (serviceName) => {
    const nameLower = serviceName.toLowerCase();
    if (nameLower.includes('education')) {
      return FaBookOpen;
    } else if (nameLower.includes('burial')) {
      return FaCross;
    } else if (nameLower.includes('medical')) {
      return FaBriefcaseMedical;
    } else if (nameLower.includes('receiving')) {
      return FaFolderOpen;
    } else if (nameLower.includes('schedule')) {
      return FaClock;
    }
    return FaQuestionCircle;
  };

  return (
    <div className='w-full text-center'>
      <Head title='Service Type' />
      <h2 className='mb-6 text-3xl font-bold text-gray-800'>Select Service</h2>
      <p className='mb-8 text-lg text-gray-600'>What type of service do you need?</p>

      <div className='mb-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
        {loadingServices ? (
          <p className='col-span-full text-center text-gray-500'>Loading services...</p>
        ) : services.length > 0 ? (
          services.map((service, index) => {
            const IconComponent = getServiceIcon(service.name);
            return (
              <SecondaryButton
                key={service.id}
                onClick={() => onSelect('serviceId', service.id)}
                className={`h-40 flex flex-col items-center justify-center gap-3 rounded-lg p-8 text-lg font-bold shadow-md transition-all duration-300 ${
                  formData.serviceId === service.id ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-transparent' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                } ${services.length % 2 !== 0 && index === services.length - 1 ? 'md:col-span-2' : ''}`}
              >
                <IconComponent className='text-5xl' />
                <span>{service.name}</span>
              </SecondaryButton>
            );
          })
        ) : (
          <p className='col-span-full text-center text-gray-500'>No services available at this time.</p>
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
