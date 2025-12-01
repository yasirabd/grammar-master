export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: 'Present' | 'Past' | 'Present Perfect';
}

export interface QuizState {
  status: 'idle' | 'loading' | 'active' | 'finished' | 'error';
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: number[]; // Stores the index of the selected option, -1 if skipped
  score: number;
  errorMessage?: string;
}

export enum AppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ACTIVE = 'active',
  FINISHED = 'finished',
  ERROR = 'error',
}