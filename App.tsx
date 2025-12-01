import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { generateQuizQuestions } from './services/geminiService';
import { QuizState, AppStatus } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>({
    status: AppStatus.IDLE,
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
  });

  const startQuiz = async () => {
    setGameState(prev => ({ ...prev, status: AppStatus.LOADING, errorMessage: undefined }));
    
    try {
      const questions = await generateQuizQuestions();
      setGameState({
        status: AppStatus.ACTIVE,
        questions,
        currentQuestionIndex: 0,
        userAnswers: [],
        score: 0,
      });
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        status: AppStatus.ERROR,
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred."
      }));
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setGameState(prev => ({
      ...prev,
      userAnswers: [...prev.userAnswers, optionIndex],
    }));
  };

  const handleNextQuestion = () => {
    setGameState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= prev.questions.length) {
        // Calculate Score
        let newScore = 0;
        prev.questions.forEach((q, idx) => {
          // The current answer being processed is already in userAnswers from handleAnswer
          // But wait, userAnswers is updated in handleAnswer which runs BEFORE this.
          // However, react state updates are batched/async.
          // Let's rely on the updated userAnswers array in the new state, but we are inside the updater.
          // Actually, since handleAnswer is called first, we need to be careful.
          // Let's calculate score based on the accumulated answers + the one just added.
          // To simplify, we'll calculate the score at the end of the game based on the final array.
          
          // Actually, let's just transition to FINISHED. The ResultScreen will calculate score or we do it here.
          // We can't access the *latest* userAnswers easily here if they were batched in the same event loop tick without refs.
          // But handleAnswer and handleNextQuestion are triggered by distinct user actions (click option -> click next).
          // So prev.userAnswers is up to date *except* for the one just added if we did them together.
          // In QuizScreen, we call onAnswer then onNext.
          // So userAnswers in 'prev' here DOES include the latest answer.
          if (prev.userAnswers[idx] === q.correctIndex) {
            newScore++;
          }
        });
        
        // Fix: The loop above runs on `prev.userAnswers` which includes the latest answer 
        // because onAnswer sets state, re-render happens, then user clicks Next.
        
        // Wait, in QuizScreen `handleConfirmAnswer` calls `onAnswer` then `onNext` immediately.
        // This causes a race condition if relying on state update.
        // Let's fix this logic. `userAnswers` should be updated, then we check if finished.
        
        return {
          ...prev,
          status: AppStatus.FINISHED,
          score: 0, // We will calculate strict score in rendering or effect, or fix the flow below.
        };
      }
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
      };
    });
  };

  // Recalculate score when finishing to be safe
  useEffect(() => {
    if (gameState.status === AppStatus.FINISHED) {
      let calculatedScore = 0;
      gameState.questions.forEach((q, idx) => {
        if (gameState.userAnswers[idx] === q.correctIndex) {
          calculatedScore++;
        }
      });
      setGameState(prev => ({ ...prev, score: calculatedScore }));
    }
  }, [gameState.status, gameState.questions, gameState.userAnswers]);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-slate-800">
            Grammar<span className="text-indigo-600">Master</span>
          </div>
          {gameState.status === AppStatus.ACTIVE && (
             <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
               Soal {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
             </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {gameState.status === AppStatus.IDLE && (
          <StartScreen onStart={startQuiz} />
        )}

        {gameState.status === AppStatus.ERROR && (
          <StartScreen 
            onStart={startQuiz} 
            isError={true} 
            errorMessage={gameState.errorMessage} 
          />
        )}

        {gameState.status === AppStatus.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">Menyiapkan Soal...</h2>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
              AI sedang membuat soal tenses unik beserta pembahasannya untukmu.
            </p>
          </div>
        )}

        {gameState.status === AppStatus.ACTIVE && (
          <QuizScreen
            questions={gameState.questions}
            currentQuestionIndex={gameState.currentQuestionIndex}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
            totalQuestions={gameState.questions.length}
          />
        )}

        {gameState.status === AppStatus.FINISHED && (
          <ResultScreen
            questions={gameState.questions}
            userAnswers={gameState.userAnswers}
            score={gameState.score}
            onRestart={() => setGameState({ ...gameState, status: AppStatus.IDLE })}
          />
        )}
      </main>
    </div>
  );
};

export default App;