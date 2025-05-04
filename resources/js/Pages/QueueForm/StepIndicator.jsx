import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const steps = [1, 2, 3];

  return (
    <div className='mb-8 w-full'>
      <div className='flex items-center'>
        {steps.map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = currentStep > step;

          return (
            <React.Fragment key={step}>
              <div className={`flex flex-col items-center ${isCompleted ? 'text-emerald-600' : isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div
                  className={`text-1xl flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold ${
                    isCompleted ? 'border-emerald-600 bg-emerald-100' : isActive ? 'border-emerald-600 bg-emerald-100' : 'border-gray-300 bg-gray-100'
                  }`}
                >
                  {step}
                </div>
              </div>
              {index < steps.length - 1 && <div className={`mx-2 h-0.5 flex-1 border-t-2 ${isCompleted ? 'border-dashed border-emerald-600' : 'border-dashed border-gray-300'}`}></div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
