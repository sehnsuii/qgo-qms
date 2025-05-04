import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const StepButtons = ({ onPrevStep, onNextStep, prevDisabled = false, nextDisabled = false, nextLabel = 'Continue', showPrev = true, showNext = true, isSubmitting = false }) => {
  return (
    <div className='flex justify-center gap-6 mt-10'>
      {showPrev && (
        <SecondaryButton
          onClick={onPrevStep}
          disabled={prevDisabled || isSubmitting}
          className='w-48 h-12 text-lg font-bold justify-center'
        >
          Back
        </SecondaryButton>
      )}
      {showNext && (
        <PrimaryButton
          onClick={onNextStep}
          disabled={nextDisabled || isSubmitting}
          className={`w-48 h-12 text-lg font-bold justify-center ${nextDisabled || isSubmitting ? 'cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing...' : nextLabel}
        </PrimaryButton>
      )}
    </div>
  );
};

export default StepButtons;
