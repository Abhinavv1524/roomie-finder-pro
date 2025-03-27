
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const questions = [
  {
    id: 'age_preference',
    question: 'What age group do you prefer for your roommate?',
    options: [
      { value: '18-25', label: '18-25 years' },
      { value: '26-35', label: '26-35 years' },
      { value: '36-45', label: '36-45 years' },
      { value: 'any', label: 'No preference' },
    ],
  },
  {
    id: 'gender_preference',
    question: 'Do you have a gender preference for your roommate?',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'any', label: 'No preference' },
    ],
  },
  {
    id: 'occupation',
    question: 'What occupation type do you prefer?',
    options: [
      { value: 'student', label: 'Student' },
      { value: 'professional', label: 'Working Professional' },
      { value: 'remote', label: 'Remote Worker' },
      { value: 'any', label: 'No preference' },
    ],
  },
  {
    id: 'smoking',
    question: 'What is your preference regarding smoking?',
    options: [
      { value: 'non_smoker', label: 'Non-smoker only' },
      { value: 'outside', label: 'Smoking outside acceptable' },
      { value: 'any', label: 'No preference' },
    ],
  },
  {
    id: 'pets',
    question: 'What is your stance on pets?',
    options: [
      { value: 'no_pets', label: 'No pets allowed' },
      { value: 'small_pets', label: 'Small pets only' },
      { value: 'all_pets', label: 'All pets welcome' },
      { value: 'any', label: 'No preference' },
    ],
  }
];

const RoommateQuestionnaire = ({ onComplete }: { onComplete: (preferences: Record<string, string>) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast.error('Please select an option to continue');
      return;
    }

    // Save the current answer
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Complete the questionnaire
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      // Restore previous answer
      const questionId = questions[currentQuestion - 1].id;
      setSelectedOption(answers[questionId] || null);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <GlassCard className="w-full">
      <div className="mb-4">
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-medium mb-6">{currentQuestionData.question}</h2>

        <RadioGroup className="space-y-3" value={selectedOption || ""} onValueChange={handleOptionSelect}>
          {currentQuestionData.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer py-2">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </motion.div>

      <div className="flex justify-between mt-8">
        <AnimatedButton
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </AnimatedButton>

        <AnimatedButton
          type="button"
          onClick={handleNext}
          disabled={!selectedOption}
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Find Matches'}
        </AnimatedButton>
      </div>
    </GlassCard>
  );
};

export default RoommateQuestionnaire;
