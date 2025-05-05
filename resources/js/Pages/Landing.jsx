import LandingLayout from '@/Layouts/LandingLayout';
import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useReactToPrint } from 'react-to-print';

import CustomerTypeStep from './QueueForm/CustomerTypeStep';
import ServiceTypeStep from './QueueForm/ServiceTypeStep';
import StepIndicator from './QueueForm/StepIndicator';
import WelcomeStep from './QueueForm/WelcomeStep';
import QueueTicket from './QueueForm/QueueTicket';

const Welcome = ({ laravelVersion, phpVersion }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerType: null,
    serviceId: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [lastGeneratedTicket, setLastGeneratedTicket] = useState(null);

  const ticketRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `QueueTicket-Q-${lastGeneratedTicket?.queue_number || ''}`,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  useEffect(() => {
    if (lastGeneratedTicket && ticketRef.current) {
      handlePrint();
    }
  }, [lastGeneratedTicket, handlePrint]);

  const getSelectedServiceName = (serviceId) => {
    if (!serviceId || services.length === 0) {
      return 'N/A';
    }
    const selectedService = services.find((service) => service.id === serviceId);
    return selectedService ? selectedService.name : 'Unknown Service';
  };

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

      const ticketData = {
        queue_number: data.queue_number,
        customerType: formData.customerType,
        serviceName: getSelectedServiceName(formData.serviceId),
      };
      Swal.fire({
        title: 'Queue Generated!',
        html: `Your queue number is: <b>Q-${data.queue_number}</b>`,
        icon: 'success',
        confirmButtonText: 'OK',
        showCancelButton: false,
        willClose: () => {
          setLastGeneratedTicket(ticketData);
          setFormData({ customerType: null, serviceId: null });
          setStep(1);
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
      setLastGeneratedTicket(null);
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
        return <WelcomeStep onNextStep={nextStep} />;
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
      {lastGeneratedTicket && (
        <QueueTicket
          ref={ticketRef}
          queueNumber={lastGeneratedTicket.queue_number}
          customerType={lastGeneratedTicket.customerType}
          serviceName={lastGeneratedTicket.serviceName}
        />
      )}
    </LandingLayout>
  );
};

export default Welcome;
