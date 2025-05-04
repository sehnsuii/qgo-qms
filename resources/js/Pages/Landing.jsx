import LandingLayout from '@/Layouts/LandingLayout';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Import the new step components and print utility
import CustomerTypeStep from './QueueForm/CustomerTypeStep';
import ServiceTypeStep from './QueueForm/ServiceTypeStep';
import StepIndicator from './QueueForm/StepIndicator';
import WelcomeStep from './QueueForm/WelcomeStep';
import { printQueueTicket } from './QueueForm/printUtils';

const Welcome = ({ laravelVersion, phpVersion }) => {
  // State remains in the parent component
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerType: null,
    serviceId: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Step navigation functions
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Form data handler
  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        Swal.fire({
          title: 'Error',
          text: 'Could not load services. Please try refreshing the page.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Helper to get service name for printing
  const getSelectedServiceName = () => {
    if (!formData.serviceId || services.length === 0) {
      return 'N/A';
    }
    const selectedService = services.find((service) => service.id === formData.serviceId);
    return selectedService ? selectedService.name : 'Unknown Service';
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerType || !formData.serviceId) {
      alert('Please complete all selections');
      return;
    }

    const payload = {
      customer_type: formData.customerType,
      service_id: formData.serviceId,
    };

    try {
      setSubmitting(true);
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (!csrfToken) throw new Error('CSRF token not found');

      const response = await fetch('/api/queues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Queue created:', data);

      Swal.fire({
        title: 'Queue Generated!',
        html: `Your queue number is: <b>Q-${data.queue_number}</b>`,
        icon: 'success',
        confirmButtonText: 'OK',
        willClose: () => {
          printQueueTicket(data.queue_number, formData.customerType, getSelectedServiceName());
        },
      });

      setFormData({ customerType: null, serviceId: null });
      setStep(1);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep onNextStep={nextStep} />;
      case 2:
        return (
          <CustomerTypeStep
            formData={formData}
            onSelect={handleSelect}
            onNextStep={nextStep}
            onPrevStep={prevStep}
          />
        );
      case 3:
        return (
          <ServiceTypeStep
            formData={formData}
            services={services}
            loadingServices={loadingServices}
            submitting={submitting}
            onSelect={handleSelect}
            onSubmit={handleSubmit}
            onPrevStep={prevStep}
          />
        );
      default:
        return <WelcomeStep onNextStep={nextStep} />; // Default to step 1
    }
  };

  return (
    <LandingLayout
      laravelVersion={laravelVersion}
      phpVersion={phpVersion}
    >
      <div className='flex min-h-[510px] w-[800px] flex-col items-center justify-center rounded-3xl bg-white bg-opacity-90 p-10 shadow-lg'>
        {<StepIndicator currentStep={step} />}
        {renderStep()}
      </div>
    </LandingLayout>
  );
};

export default Welcome;
