import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const StepButtons = ({ onPrevStep, onNextStep, prevDisabled = false, nextDisabled = false, nextLabel = 'Continue', showPrev = true, showNext = true, isSubmitting = false }) => {
  return (
    <div className='mt-10 flex justify-center gap-6'>
      {showPrev && (
        <SecondaryButton
          onClick={onPrevStep}
          disabled={prevDisabled || isSubmitting}
          className='h-12 w-48 justify-center text-lg font-bold'
        >
          Back
        </SecondaryButton>
      )}
      {showNext && (
        <PrimaryButton
          onClick={onNextStep}
          disabled={nextDisabled || isSubmitting}
          className={`h-12 w-48 justify-center text-lg font-bold ${nextDisabled || isSubmitting ? 'cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing...' : nextLabel}
        </PrimaryButton>
      )}
    </div>
  );
};

export default StepButtons;
