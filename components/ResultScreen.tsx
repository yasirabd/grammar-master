import React, { useState } from 'react';
import { Question } from '../types';
import { Check, X, ChevronDown, ChevronUp, RefreshCw, Award } from 'lucide-react';

interface ResultScreenProps {
  questions: Question[];
  userAnswers: number[];
  score: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  userAnswers,
  score,
  onRestart,
}) => {
  const percentage = Math.round((score / questions.length) * 100);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (p: number) => {
    if (p >= 80) return 'text-green-600 bg-green-50';
    if (p >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-12">
      {/* Score Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center border border-slate-100">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-4">
          <Award className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Selesai!</h2>
        <div className="flex flex-col items-center justify-center my-6">
          <div className={`text-6xl font-black ${getScoreColor(percentage).split(' ')[0]} mb-2`}>
            {percentage}%
          </div>
          <p className="text-slate-500">
            Kamu menjawab benar {score} dari {questions.length} soal
          </p>
        </div>
        <button
          onClick={onRestart}
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Main Lagi
        </button>
      </div>

      {/* Review Section */}
      <h3 className="text-xl font-bold text-slate-800 mb-6 px-2">Pembahasan & Jawaban</h3>
      
      <div className="space-y-4">
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.correctIndex;
          const isExpanded = expandedId === q.id;

          return (
            <div 
              key={q.id} 
              className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-indigo-200 shadow-md' : 'border-transparent shadow-sm hover:border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleExpand(q.id)}
                className="w-full flex items-start p-5 text-left bg-white"
              >
                <div className={`flex-shrink-0 mt-1 mr-4 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-lg mb-1">{q.text}</h4>
                  <p className="text-sm text-slate-500 font-medium">Topic: {q.topic}</p>
                </div>

                <div className="ml-4 mt-2 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-6 bg-slate-50 border-t border-slate-100">
                  <div className="mt-4 grid gap-3">
                    {/* User Answer (if wrong) */}
                    {!isCorrect && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Jawaban Kamu</span>
                        <p className="text-red-800 font-medium mt-1">{q.options[userAnswer]}</p>
                      </div>
                    )}
                    
                    {/* Correct Answer */}
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Jawaban Benar</span>
                      <p className="text-green-800 font-bold mt-1">{q.options[q.correctIndex]}</p>
                    </div>

                    {/* Explanation */}
                    <div className="mt-2 p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center mb-2">
                        <span className="text-indigo-600 text-sm font-bold uppercase tracking-wider">Penjelasan</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultScreen;