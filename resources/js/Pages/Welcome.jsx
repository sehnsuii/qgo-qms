import NavLink from '@/Components/NavLink';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Import the new step components and print utility
import CustomerTypeStep from './QueueForm/CustomerTypeStep';
import ServiceTypeStep from './QueueForm/ServiceTypeStep';
import StepIndicator from './QueueForm/StepIndicator';
import WelcomeStep from './QueueForm/WelcomeStep';
import { printQueueTicket } from './QueueForm/printUtils';

const Welcome = ({ auth, laravelVersion, phpVersion }) => {
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
          // Use the imported print function
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

  // Render the correct step component based on the current step
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
    <>
      <Head title='Customer Selection' />
      {/* Main layout structure remains */}
      <div className='flex min-h-screen flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50'>
        <img
          className='absolute inset-0 h-full w-full object-cover'
          src='https://upload.wikimedia.org/wikipedia/commons/a/ad/6346Poblacion_City_Hall_San_Pedro_Laguna_27.jpg'
          alt='San Pedro Laguna City Hall'
        />

        <header className='relative flex w-full items-center bg-white px-6 py-4 shadow-md'>
          <div className='flex w-1/3 items-center'>
            <img
              src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
              alt='SP Logo'
              className='mr-4 h-12'
            />
            <h1 className='text-xl font-semibold text-black'>City of San Pedro Laguna</h1>
          </div>
          <div className='flex flex-1 justify-center'>
            <img
              src='https://i.pinimg.com/736x/b0/1d/a1/b01da1459e9c98b05f0458aeecc6a87f.jpg'
              alt='QGo Logo'
              className='h-16'
            />
          </div>
          <nav className='flex w-1/3 items-center justify-end'>
            {auth.user ? (
              <NavLink
                href={route('dashboard')}
                className='text-black hover:text-gray-700'
                active={route().current('dashboard')}
              >
                Dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  href={route('login')}
                  className='mr-4 text-black hover:text-gray-700'
                  active={route().current('login')}
                >
                  Log in
                </NavLink>
                <NavLink
                  href={route('register')}
                  className='text-black hover:text-gray-700'
                  active={route().current('register')}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </header>

        <div className='relative flex w-full flex-1 items-center justify-center'>
          <div className='flex min-h-[510px] w-[800px] flex-col items-center justify-center rounded-3xl bg-white bg-opacity-90 p-10 shadow-lg'>
            {/* Use StepIndicator component */}
            {step > 1 && <StepIndicator currentStep={step} />}

            {/* Render the current step component */}
            {renderStep()}
          </div>
        </div>

        <footer className='relative mt-auto w-full bg-white py-4 text-center text-sm text-black shadow-md'>
          QGo {laravelVersion} (PHP v{phpVersion})
        </footer>
      </div>
    </>
  );
};

export default Welcome;
