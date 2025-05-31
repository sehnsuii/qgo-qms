import SecondaryButton from '@/Components/SecondaryButton'; // keep secondary button
import StepButtons from '@/Pages/QueueForm/StepButtons';
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
      <h2 className='text-3xl font-bold text-gray-800'>Select Service</h2>
      <p className='text-lg text-gray-600'>What type of service do you need?</p>

      <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2'>
        {loadingServices ? (
          <p className='col-span-full text-center text-gray-500'>Loading services...</p>
        ) : services.length > 0 ? (
          services.map((service, index) => {
            const IconComponent = getServiceIcon(service.name);
            return (
              <SecondaryButton
                key={service.id}
                onClick={() => onSelect('serviceId', service.id)}
                className={`flex h-40 flex-col items-center justify-center gap-3 rounded-lg p-8 text-lg font-bold shadow-md transition-all duration-300 ${
                  formData.serviceId === service.id ? 'border-transparent bg-gradient-to-br from-emerald-400 to-teal-500 text-white' : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
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

      <StepButtons
        onPrevStep={onPrevStep}
        onNextStep={onSubmit} // Use onSubmit for the next step action
        nextDisabled={!formData.serviceId || loadingServices || services.length === 0}
        nextLabel='Submit'
        isSubmitting={submitting}
      />
    </div>
  );
};

export default ServiceTypeStep;
