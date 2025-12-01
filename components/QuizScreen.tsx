import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, Circle } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  totalQuestions: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentQuestionIndex,
  onAnswer,
  onNext,
  totalQuestions,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
      setSelectedOption(null); // Reset for next
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Soal {currentQuestionIndex + 1} dari {totalQuestions}</span>
          {/* Category hidden as requested */}
        </div>
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-slate-100">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-snug">
          {question.text}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`mr-4 flex-shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                  {isSelected ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <span className="font-medium text-lg">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleConfirmAnswer}
          disabled={selectedOption === null}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${
            selectedOption === null
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg'
          }`}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Selesai' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;