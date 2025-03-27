
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { compatibilityQuestions } from '@/lib/data';
import { toast } from 'sonner';

const CompatibilityQuestionnaire = () => {
  const navigate = useNavigate();
  const { updateUserProfile, setProfileCreationOpen } = useAppStore();
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
    const questionId = compatibilityQuestions[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));

    // Move to next question or finish
    if (currentQuestion < compatibilityQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Complete the questionnaire
      finishQuestionnaire();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      // Restore previous answer
      const questionId = compatibilityQuestions[currentQuestion - 1].id;
      setSelectedOption(answers[questionId] || null);
    }
  };

  const finishQuestionnaire = () => {
    // Process answers into preferences format
    const preferences: Record<string, string> = {};
    Object.keys(answers).forEach((key) => {
      preferences[key] = answers[key];
    });

    // Update user profile with preferences
    updateUserProfile({
      preferences,
      isNewUser: false,
      isProfileComplete: true,
    });

    // Close the modal and navigate to dashboard
    setProfileCreationOpen(false);
    navigate('/dashboard');
    
    toast.success('Profile created successfully!');
  };

  const currentQuestionData = compatibilityQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / compatibilityQuestions.length) * 100;

  return (
    <GlassCard className="w-full">
      <div className="mb-4">
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: `${(currentQuestion / compatibilityQuestions.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} of {compatibilityQuestions.length}
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
          {currentQuestion < compatibilityQuestions.length - 1 ? 'Next' : 'Finish'}
        </AnimatedButton>
      </div>
    </GlassCard>
  );
};

export default CompatibilityQuestionnaire;
