import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  isError?: boolean;
  errorMessage?: string;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, isError, errorMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-indigo-100 p-4 rounded-full mb-6 animate-pulse">
        <BookOpen className="w-12 h-12 text-indigo-600" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
        Grammar<span className="text-indigo-600">Master</span>
      </h1>
      
      <p className="text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
        Uji kemampuan Bahasa Inggris kamu dengan fokus pada 
        <span className="font-semibold text-slate-800"> Simple Present</span>, 
        <span className="font-semibold text-slate-800"> Simple Past</span>, dan 
        <span className="font-semibold text-slate-800"> Present Perfect Tense</span>.
      </p>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 max-w-md">
          <p className="font-medium">Error</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-1"
      >
        Mulai Kuis
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="mt-8 text-sm text-slate-400">
        Didukung oleh Gemini AI • Dibuat soal secara otomatis
      </div>
    </div>
  );
};

export default StartScreen;