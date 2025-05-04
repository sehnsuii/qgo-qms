import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

const Welcome = ({ auth, laravelVersion, phpVersion }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        customerType: null, // 'priority' or 'regular'
        serviceId: null, // Will store the selected service ID
    });

    const [submitting, setSubmitting] = useState(false);
    const [services, setServices] = useState([]); // Changed from appointmentTypes
    const [loadingServices, setLoadingServices] = useState(true); // Changed from loadingTypes

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSelect = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    useEffect(() => {
        // Fetch services when the component mounts
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
                    confirmButtonText: 'OK'
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
        const selectedService = services.find(service => service.id === formData.serviceId);
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

        // Validate form data
        if (!formData.customerType || !formData.serviceId) {
            alert('Please complete all selections');
            return;
        }

        // Prepare payload
        const payload = {
            customer_type: formData.customerType, // Should be 'Priority' or 'Regular'
            service_id: formData.serviceId // Should be the selected service ID
        };

        try {
            // Show loading state (you might want to add this to your component state)
            setSubmitting(true);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch('/api/queues', { // Updated endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Handle successful response
            console.log('Queue created:', data);

            // Show success alert with queue number
            Swal.fire({
                title: 'Queue Generated!',
                html: `Your queue number is: <b>${data.queue_number}</b>`, // Updated field name
                icon: 'success',
                confirmButtonText: 'OK',
                willClose: () => {
                    printQueueTicket(data.queue_number); // Updated field name
                }
            });

            // Optionally reset form or redirect
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
            <Head title="Customer Selection" />
            <div className="min-h-screen flex flex-col bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ad/6346Poblacion_City_Hall_San_Pedro_Laguna_27.jpg"
                    alt="San Pedro Laguna City Hall"
                />

                <header className="relative w-full bg-white shadow-md py-4 flex items-center px-6">
                    <div className="flex items-center w-1/3">
                        <img
                            src="https://cityofsanpedrolaguna.gov.ph/wp-content/uploads/2023/02/logo-sanpedro.png"
                            alt="SP Logo"
                            className="h-12 mr-4"
                        />
                        <h1 className="text-xl font-semibold text-black">City of San Pedro Laguna</h1>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src="https://i.pinimg.com/736x/b0/1d/a1/b01da1459e9c98b05f0458aeecc6a87f.jpg"
                            alt="QGo Logo"
                            className="h-16"
                        />
                    </div>

                    <nav className="w-1/3 flex justify-end">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-black hover:text-gray-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="mr-4 text-black hover:text-gray-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-black hover:text-gray-700"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="relative flex flex-1 w-full items-center justify-center">
                    <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-lg w-[800px] min-h-[510px] flex flex-col items-center justify-center">
                        {/* Progress Indicator */}
                        <div className="w-full mb-8">
                            <div className="flex items-center">
                                {[1, 2, 3].map((stepNumber) => ( // Adjusted step count
                                    <React.Fragment key={stepNumber}>
                                        <div className={`flex flex-col items-center ${step >= stepNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                                ${step >= stepNumber ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                                                {stepNumber}
                                            </div>
                                        </div>
                                        {stepNumber < 3 && ( // Adjusted step count
                                            <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="relative flex flex-1 w-full items-center justify-center">
                                <div className="bg-green-600 p-10 rounded-3xl shadow-lg w-[800px] h-[510px] flex flex-col items-center justify-center">
                                    <h2 className="text-7xl font-bold text-white mb-8 font-[Verdana]">Welcome</h2>
                                    <h2 className="text-2xl font-semibold text-white mb-8 ">to</h2>
                                    <h2 className="text-4xl font-semibold text-white mb-8 ">City of San Pedro Laguna</h2>
                                    <hr className="w-4/5 border-2 border-white my-4 mx-auto" />
                                    <p className="text-xl font-small text-white mb-5 font-[Verdana]">Please get your queue here</p>

                                    <button
                                        onClick={nextStep}
                                        className="mt-5 px-14 py-5 bg-white text-green-600 text-lg font-bold rounded-lg shadow-md hover:bg-gray-200"
                                    >
                                        START
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Step 1: Customer Type Selection */}
                        {step === 2 && (
                            <div className="w-full text-center">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Customer Type</h2>
                                <p className="text-lg text-gray-600 mb-8">Are you a priority or regular customer?</p>

                                <div className="flex justify-center gap-8 mb-10">
                                    <button
                                        onClick={() => handleSelect('customerType', 'Priority')} // Capitalized
                                        className={`px-8 py-12 rounded-xl shadow-md text-xl font-bold transition-all duration-200
                                            ${formData.customerType === 'Priority' // Capitalized
                                                ? 'bg-green-600 text-white transform scale-105'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Priority Customer
                                    </button>

                                    <button
                                        onClick={() => handleSelect('customerType', 'Regular')} // Capitalized
                                        className={`px-8 py-12 rounded-xl shadow-md text-xl font-bold transition-all duration-200
                                            ${formData.customerType === 'Regular' // Capitalized
                                                ? 'bg-green-600 text-white transform scale-105'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Regular Customer
                                    </button>
                                </div>

                                <button
                                    onClick={prevStep}
                                    className="px-10 py-4 bg-gray-200 text-gray-800 rounded-lg text-lg font-bold shadow-md hover:bg-gray-300"
                                >
                                    Back
                                </button>

                                <button
                                    onClick={nextStep}
                                    disabled={!formData.customerType}
                                    className={`mt-6 px-10 py-4 rounded-lg text-lg font-bold shadow-md transition-colors
                                        ${formData.customerType
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* Step 3: Appointment Type Selection */}
                        {step === 3 && (
                            <div className="w-full text-center">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Service</h2>
                                <p className="text-lg text-gray-600 mb-8">What type of service do you need?</p>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    {loadingServices ? (
                                        <p>Loading services...</p>
                                    ) : services.length > 0 ? (
                                        services.map((service) => (
                                            <button
                                                key={service.id} // Use service ID as key
                                                onClick={() => handleSelect('serviceId', service.id)} // Store service ID
                                                className={`p-6 rounded-xl shadow-md text-lg font-bold transition-all duration-200
                                                    ${formData.serviceId === service.id // Compare with service ID
                                                        ? 'bg-green-600 text-white transform scale-105'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                {service.name} {/* Display service name */}
                                            </button>
                                        ))
                                    ) : (
                                        <p>No services available at this time.</p>
                                    )}
                                </div>

                                <div className="flex justify-center gap-6">
                                    <button
                                        onClick={prevStep}
                                        className="px-10 py-4 bg-gray-200 text-gray-800 rounded-lg text-lg font-bold shadow-md hover:bg-gray-300"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.serviceId || submitting || loadingServices || services.length === 0}
                                        className={`px-10 py-4 rounded-lg text-lg font-bold shadow-md transition-colors
                                            ${formData.serviceId
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="relative w-full bg-white shadow-md py-4 text-center text-sm text-black mt-auto">
                    QGo {laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
};

export default Welcome;