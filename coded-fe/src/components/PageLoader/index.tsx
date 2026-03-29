import { useEffect, useState } from 'react';

interface PageLoaderProps {
  duration?: number;
  onFinish?: () => void;
}

export default function PageLoader({
  duration = 1500,
  onFinish,
}: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const step = 100 / (duration / 16);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, 16);

    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 300);

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center
        bg-slate-50 dark:bg-[#050505] transition-opacity duration-300
        ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="relative">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-2xl bg-primary-500/20 animate-ping" />
          <div className="relative w-16 h-16 bg-linear-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
            <span className="text-white font-black text-xl tracking-tight select-none">
              CED
            </span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Ceará
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Centro de Educação a Distância
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
        Carregando...
      </p>
    </div>
  );
}
