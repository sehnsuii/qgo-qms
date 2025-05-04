import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Welcome = ({ auth, laravelVersion, phpVersion }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerType: null,
    serviceId: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

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

  const getSelectedServiceName = () => {
    if (!formData.serviceId || services.length === 0) {
      return 'N/A';
    }
    const selectedService = services.find((service) => service.id === formData.serviceId);
    return selectedService ? selectedService.name : 'Unknown Service';
  };

  const printQueueTicket = (queueNumber) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
            <html>
                <head>
                    <title>Queue Ticket</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                        .ticket { border: 2px dashed #000; padding: 20px; max-width: 300px; margin: 0 auto; }
                        .queue-number { font-size: 24px; font-weight: bold; margin: 10px 0; color: #2563eb; }
                        .info { margin: 5px 0; }
                        .header { margin-bottom: 15px; }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="header">
                            <img src="https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png" width="80" alt="Logo">
                            <h2>City of San Pedro Laguna</h2>
                        </div>
                        <div class="info">Queue Ticket</div>
                        <div class="queue-number">${queueNumber}</div>
                        <div class="info">Customer Type: ${formData.customerType}</div>
                        <div class="info">Service: ${getSelectedServiceName()}</div>
                        <div class="info">Date: ${new Date().toLocaleString()}</div>
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                window.close();
                            }, 200);
                        }
                    </script>
                </body>
            </html>
        `);
    printWindow.document.close();
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

      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Queue created:', data);

      Swal.fire({
        title: 'Queue Generated!',
        html: `Your queue number is: <b>Q-${data.queue_number}</b>`,
        icon: 'success',
        confirmButtonText: 'OK',
        willClose: () => {
          printQueueTicket(data.queue_number);
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

  return (
    <>
      <Head title='Customer Selection' />
      <div className='min-h-screen flex flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50'>
        <img
          className='absolute inset-0 w-full h-full object-cover'
          src='https://upload.wikimedia.org/wikipedia/commons/a/ad/6346Poblacion_City_Hall_San_Pedro_Laguna_27.jpg'
          alt='San Pedro Laguna City Hall'
        />

        <header className='relative w-full bg-white shadow-md py-4 flex items-center px-6'>
          <div className='flex items-center w-1/3'>
            <img
              src='https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png'
              alt='SP Logo'
              className='h-12 mr-4'
            />
            <h1 className='text-xl font-semibold text-black'>City of San Pedro Laguna</h1>
          </div>

          <div className='flex-1 flex justify-center'>
            <img
              src='https://i.pinimg.com/736x/b0/1d/a1/b01da1459e9c98b05f0458aeecc6a87f.jpg'
              alt='QGo Logo'
              className='h-16'
            />
          </div>

          <nav className='w-1/3 flex justify-end items-center'>
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

        <div className='relative flex flex-1 w-full items-center justify-center'>
          <div className='bg-white bg-opacity-90 p-10 rounded-3xl shadow-lg w-[800px] min-h-[510px] flex flex-col items-center justify-center'>
            {/* Progress Indicator */}
            <div className='w-full mb-8'>
              <div className='flex items-center'>
                {[1, 2, 3].map((stepNumber) => (
                  <React.Fragment key={stepNumber}>
                    <div className={`flex flex-col items-center ${step >= stepNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center 
                                                ${step >= stepNumber ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}
                      >
                        {stepNumber}
                      </div>
                    </div>
                    {stepNumber < 3 && <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Welcome Screen */}
            {step === 1 && (
              <div className='relative flex flex-1 w-full items-center justify-center'>
                <div className='bg-green-600 p-10 rounded-3xl shadow-lg w-[800px] h-[510px] flex flex-col items-center justify-center'>
                  <h2 className='text-7xl font-bold text-white mb-8 font-[Verdana]'>Welcome</h2>
                  <h2 className='text-2xl font-semibold text-white mb-8 '>to</h2>
                  <h2 className='text-4xl font-semibold text-white mb-8 '>City of San Pedro Laguna</h2>
                  <hr className='w-4/5 border-2 border-white my-4 mx-auto' />
                  <p className='text-xl font-small text-white mb-5 font-[Verdana]'>Please get your queue here</p>

                  <PrimaryButton
                    onClick={nextStep}
                    className='mt-5 px-14 py-5 text-lg'
                  >
                    START
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* Step 2: Customer Type Selection */}
            {step === 2 && (
              <div className='w-full text-center'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6'>Select Customer Type</h2>
                <p className='text-lg text-gray-600 mb-8'>Are you a priority or regular customer?</p>

                <div className='flex justify-center gap-8 mb-10'>
                  <SecondaryButton
                    onClick={() => handleSelect('customerType', 'Priority')}
                    className={`px-8 py-12 text-xl font-bold transition-all duration-200 ${
                      formData.customerType === 'Priority' ? 'bg-yellow-600 text-white transform scale-105 hover:bg-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Priority Customer
                  </SecondaryButton>

                  <SecondaryButton
                    onClick={() => handleSelect('customerType', 'Regular')}
                    className={`px-8 py-12 text-xl font-bold transition-all duration-200 ${
                      formData.customerType === 'Regular' ? 'bg-blue-600 text-white transform scale-105 hover:bg-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Regular Customer
                  </SecondaryButton>
                </div>
                <div className='flex justify-center gap-6'>
                  <SecondaryButton
                    onClick={prevStep}
                    className='px-10 py-4 text-lg font-bold'
                  >
                    Back
                  </SecondaryButton>

                  <PrimaryButton
                    onClick={nextStep}
                    disabled={!formData.customerType}
                    className={`ml-4 px-10 py-4 text-lg font-bold ${!formData.customerType ? 'cursor-not-allowed' : ''}`}
                  >
                    Continue
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* Step 3: Appointment Type Selection */}
            {step === 3 && (
              <div className='w-full text-center'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6'>Select Service</h2>
                <p className='text-lg text-gray-600 mb-8'>What type of service do you need?</p>

                <div className='grid grid-cols-2 gap-6 mb-10'>
                  {loadingServices ? (
                    <p>Loading services...</p>
                  ) : services.length > 0 ? (
                    services.map((service) => (
                      <SecondaryButton
                        key={service.id}
                        onClick={() => handleSelect('serviceId', service.id)}
                        className={`p-6 text-lg font-bold transition-all duration-200 ${
                          formData.serviceId === service.id ? 'bg-green-600 text-white transform scale-105 hover:bg-green-700' : 'bg-white text-gray-700 hover:bg-gray-100'
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
                    onClick={prevStep}
                    className='px-10 py-4 text-lg font-bold'
                  >
                    Back
                  </SecondaryButton>

                  <PrimaryButton
                    onClick={handleSubmit}
                    disabled={!formData.serviceId || submitting || loadingServices || services.length === 0}
                    className={`ml-4 px-10 py-4 text-lg font-bold ${!formData.serviceId || services.length === 0 ? 'cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className='relative w-full bg-white shadow-md py-4 text-center text-sm text-black mt-auto'>
          QGo {laravelVersion} (PHP v{phpVersion})
        </footer>
      </div>
    </>
  );
};

export default Welcome;
