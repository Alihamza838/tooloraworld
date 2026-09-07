import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface PolicyQuizProps {
  title?: string;
  questions?: QuizQuestion[];
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Where is your file data processed when using Toolora utilities?',
    options: [
      'Encrypted and uploaded to an Amazon AWS S3 bucket',
      'Exclusively in your browser’s volatile RAM via WebAssembly',
      'Sent to a machine-learning training server for classification',
      'Stored on a decentralized peer-to-peer cloud network'
    ],
    correctIndex: 1,
    explanation: 'Toolora executes all algorithms 100% client-side inside isolated WebAssembly and HTML5 Canvas sandboxes.'
  },
  {
    question: 'What happens to your document files when you close or refresh your browser tab?',
    options: [
      'They remain cached in our cloud database for 30 days',
      'They are archived into a compressed zip on the server',
      'All in-memory buffers and Blobs are instantly purged from RAM',
      'They are sent to an email backup service'
    ],
    correctIndex: 2,
    explanation: 'Because no server stores data, closing the tab instantly revokes all ephemeral memory objects.'
  }
];

export const PolicyQuiz: React.FC<PolicyQuizProps> = ({
  title = 'Interactive Technical & Privacy Knowledge Check',
  questions = DEFAULT_QUESTIONS
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="my-8 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-orange-600 text-white">
            <HelpCircle className="w-4 h-4" />
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {!isCompleted ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {currentQ.question}
          </p>

          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let itemClass = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60';

              if (isAnswered) {
                if (isCorrect) {
                  itemClass = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                } else if (isSelected) {
                  itemClass = 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${itemClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700 space-y-3">
              <div>
                <strong>Explanation:</strong> {currentQ.explanation}
              </div>
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-3">
          <Award className="w-12 h-12 text-orange-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Quiz Completed!
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> points.
          </p>
          <button
            onClick={restart}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Knowledge Check</span>
          </button>
        </div>
      )}
    </div>
  );
};
