
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const questions = [
  {
    id: 'location',
    question: 'In which area are you looking for a room?',
    type: 'text',
    placeholder: 'Enter neighborhood, area, or city'
  },
  {
    id: 'budget',
    question: 'What is your monthly budget?',
    type: 'radio',
    options: [
      { value: '500-800', label: '$500-$800' },
      { value: '800-1200', label: '$800-$1,200' },
      { value: '1200-1500', label: '$1,200-$1,500' },
      { value: '1500-2000', label: '$1,500-$2,000' },
      { value: '2000+', label: 'Above $2,000' },
    ],
  },
  {
    id: 'move_date',
    question: 'When are you planning to move in?',
    type: 'radio',
    options: [
      { value: 'immediately', label: 'Immediately' },
      { value: '1-month', label: 'Within 1 month' },
      { value: '3-months', label: 'Within 3 months' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
  {
    id: 'amenities',
    question: 'Which amenities are important to you?',
    type: 'checkbox',
    options: [
      { value: 'wifi', label: 'WiFi Included' },
      { value: 'laundry', label: 'In-unit Laundry' },
      { value: 'parking', label: 'Parking Space' },
      { value: 'gym', label: 'Gym Access' },
      { value: 'pet_friendly', label: 'Pet-friendly' },
      { value: 'furnished', label: 'Furnished' },
    ],
  },
  {
    id: 'lease_duration',
    question: 'Preferred lease duration?',
    type: 'radio',
    options: [
      { value: 'month-to-month', label: 'Month-to-month' },
      { value: '6-months', label: '6 months' },
      { value: '12-months', label: '12 months' },
      { value: 'flexible', label: 'Flexible' },
    ],
  }
];

const RoomQuestionnaire = ({ onComplete }: { onComplete: (preferences: Record<string, any>) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedCheckboxes(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const canProceed = () => {
    const currentQ = questions[currentQuestion];
    if (currentQ.type === 'text') {
      return textValue.trim().length > 0;
    } else if (currentQ.type === 'radio') {
      return selectedOption !== null;
    } else if (currentQ.type === 'checkbox') {
      return selectedCheckboxes.length > 0;
    }
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please make a selection to continue');
      return;
    }

    // Save the current answer
    const questionId = questions[currentQuestion].id;
    let answer;
    
    if (questions[currentQuestion].type === 'text') {
      answer = textValue;
    } else if (questions[currentQuestion].type === 'radio') {
      answer = selectedOption;
    } else if (questions[currentQuestion].type === 'checkbox') {
      answer = selectedCheckboxes;
    }
    
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      
      // Reset current question input
      setSelectedOption(null);
      setTextValue('');
      setSelectedCheckboxes([]);
      
      // Set values if coming back to this question
      const nextQuestion = questions[currentQuestion + 1];
      if (newAnswers[nextQuestion.id]) {
        if (nextQuestion.type === 'text') {
          setTextValue(newAnswers[nextQuestion.id]);
        } else if (nextQuestion.type === 'radio') {
          setSelectedOption(newAnswers[nextQuestion.id]);
        } else if (nextQuestion.type === 'checkbox') {
          setSelectedCheckboxes(newAnswers[nextQuestion.id] || []);
        }
      }
    } else {
      // Complete the questionnaire
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      
      // Reset current question input
      setSelectedOption(null);
      setTextValue('');
      setSelectedCheckboxes([]);
      
      // Restore previous answer
      const prevQuestion = questions[currentQuestion - 1];
      const prevAnswer = answers[prevQuestion.id];
      
      if (prevQuestion.type === 'text') {
        setTextValue(prevAnswer || '');
      } else if (prevQuestion.type === 'radio') {
        setSelectedOption(prevAnswer || null);
      } else if (prevQuestion.type === 'checkbox') {
        setSelectedCheckboxes(prevAnswer || []);
      }
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

        {currentQuestionData.type === 'text' && (
          <Input
            value={textValue}
            onChange={handleTextChange}
            placeholder={currentQuestionData.placeholder}
            className="mb-4"
          />
        )}

        {currentQuestionData.type === 'radio' && (
          <RadioGroup className="space-y-3" value={selectedOption || ""} onValueChange={handleOptionSelect}>
            {currentQuestionData.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer py-2">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {currentQuestionData.type === 'checkbox' && (
          <div className="space-y-3">
            {currentQuestionData.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.value} 
                  checked={selectedCheckboxes.includes(option.value)}
                  onCheckedChange={() => handleCheckboxChange(option.value)}
                />
                <Label htmlFor={option.value} className="cursor-pointer py-2">{option.label}</Label>
              </div>
            ))}
          </div>
        )}
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
          disabled={!canProceed()}
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Find Rooms'}
        </AnimatedButton>
      </div>
    </GlassCard>
  );
};

export default RoomQuestionnaire;
