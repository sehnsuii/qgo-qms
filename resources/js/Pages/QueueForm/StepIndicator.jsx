import React from 'react';

const StepIndicator = ({ currentStep }) => {
  return (
    <div className='mb-8 w-full'>
      <div className='flex items-center'>
        {[1, 2, 3].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`flex flex-col items-center ${currentStep >= stepNumber ? 'text-green-600' : 'text-gray-400'}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep >= stepNumber ? 'border-2 border-green-600 bg-green-100' : 'border-2 border-gray-300 bg-gray-100'}`}
              >
                {stepNumber}
              </div>
            </div>
            {stepNumber < 3 && <div className={`mx-2 h-1 flex-1 ${currentStep > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
