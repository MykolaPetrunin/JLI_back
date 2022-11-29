import IWordSteps from '../interfaces/setpTypes';
import IUserSettings from '../interfaces/iUserSettings';
import wordSteps from '../config/wordSteps';

const getNextStep = (currentStep: IWordSteps, settings: IUserSettings): IWordSteps => {
  const nextStep = wordSteps[wordSteps.indexOf(currentStep) + 1];

  switch (nextStep) {
    case 'wordsWordTranslation':
      return settings.isWordTranslation ? nextStep : getNextStep(nextStep, settings);
    case 'wordsTranslationWord':
      return settings.isTranslationWord ? nextStep : getNextStep(nextStep, settings);
    case 'wordsSpell':
      return settings.isTyped ? nextStep : getNextStep(nextStep, settings);
    case 'wordsRepeat':
      return settings.repeatCount > 0 ? nextStep : getNextStep(nextStep, settings);
    case 'wordsRepeatWeek':
      return settings.repeatCount > 1 ? nextStep : getNextStep(nextStep, settings);
    case 'wordsRepeatMonth':
      return settings.repeatCount > 2 ? nextStep : getNextStep(nextStep, settings);
    case 'wordsRepeat3Month':
      return settings.repeatCount > 3 ? nextStep : getNextStep(nextStep, settings);
    case 'wordsRepeat6Month':
      return settings.repeatCount > 5 ? nextStep : getNextStep(nextStep, settings);
    default:
      return 'words';
  }
};

export default getNextStep;
