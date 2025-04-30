import React, { useState } from 'react';

const FormWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerType: '', // 'priority' or 'regular'
    name: '',
    email: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 relative">
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`flex flex-col items-center ${step >= stepNumber ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= stepNumber ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                {stepNumber}
              </div>
              <span className="text-xs mt-1">
                {stepNumber === 1 ? 'Type' : stepNumber === 2 ? 'Details' : 'Review'}
              </span>
            </div>
            {stepNumber < 3 && (
              <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Customer Type */}
        {step === 1 && (
          <CustomerTypeStep 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep} 
          />
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <DetailsStep 
            formData={formData} 
            handleChange={handleChange} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <ReviewStep 
            formData={formData} 
            prevStep={prevStep} 
            handleSubmit={handleSubmit} 
          />
        )}
      </form>
    </div>
  );
};

// Step 1 Component
const CustomerTypeStep = ({ formData, handleChange, nextStep }) => {
  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.customerType) {
      alert('Please select a customer type');
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customer Type</h2>
      <p className="text-gray-600">Are you a priority or regular customer?</p>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-3 p-4 border rounded-lg hover:border-green-500 cursor-pointer">
          <input
            type="radio"
            name="customerType"
            value="priority"
            checked={formData.customerType === 'priority'}
            onChange={handleChange}
            className="h-5 w-5 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-700 font-medium">Priority Customer</span>
        </label>
        
        <label className="flex items-center space-x-3 p-4 border rounded-lg hover:border-green-500 cursor-pointer">
          <input
            type="radio"
            name="customerType"
            value="regular"
            checked={formData.customerType === 'regular'}
            onChange={handleChange}
            className="h-5 w-5 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-700 font-medium">Regular Customer</span>
        </label>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleNext}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Step 2 Component
const DetailsStep = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Step 3 Component
const ReviewStep = ({ formData, prevStep, handleSubmit }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Information</h2>
      
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-900">Customer Type</h3>
          <p className="mt-1 text-gray-700 capitalize">{formData.customerType} Customer</p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 text-gray-700"><span className="font-medium">Name:</span> {formData.name}</p>
          <p className="mt-1 text-gray-700"><span className="font-medium">Email:</span> {formData.email}</p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={prevStep}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button 
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormWizard;