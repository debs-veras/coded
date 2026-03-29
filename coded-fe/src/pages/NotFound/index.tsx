import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-primary-500 selection:text-white transition-colors duration-300">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="flex flex-col items-center justify-center">
          <FiAlertCircle className="w-20 h-20 text-primary-500 mb-6 animate-bounce" />
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tight text-gray-900 dark:text-white">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            Página não encontrada
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            A página que você está procurando não existe ou foi removida
            temporariamente.
          </p>
        </div>

        <div className="pt-8 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-200 bg-primary-600 rounded-full hover:bg-primary-700 hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 dark:focus:ring-offset-gray-950"
          >
            <FiHome className="w-5 h-5 mr-3" />
            <span>Voltar para o Início</span>
          </button>
        </div>
      </div>
    </div>
  );
}
