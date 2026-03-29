import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiSun,
  FiMoon,
  FiUser,
  FiAlertCircle,
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStore } from '../../hooks/useUserStore';
import { login } from '../../services/auth.service';
import useToastLoading from '../../hooks/useToastLoading';
import { loginSchema } from '../../schemas/auth';
import { getDashboardPath } from '../../utils/roles';

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const setAuth = useUserStore((state) => state.setAuth);
  const toast = useToastLoading();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const { user, isLoggedIn } = useUserStore();

  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(getDashboardPath(user.role));
    }
  }, [isLoggedIn, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    toast({ mensagem: 'Realizando login...' });
    const response = await login(data);

    if (response.success && response.data) {
      setAuth(response.data);
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
      navigate(getDashboardPath(response.data.role));
    } else {
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 flex flex-col">
      {/* Top bar */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao início
        </button>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <FiMoon className="w-5 h-5" />
          ) : (
            <FiSun className="w-5 h-5" />
          )}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-gray-200/60 dark:shadow-none p-8 md:p-10">
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                <FiUser className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Identifique-se
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Acesse sua conta para entrar na plataforma do CED Ceará.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
              noValidate
            >
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest"
                >
                  E-mail institucional
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ex@ced.ce.gov.br"
                    {...register('email')}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-gray-200 dark:border-white/10 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest"
                  >
                    Senha de acesso
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-gray-200 dark:border-white/10 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Verificando...' : 'Acessar Plataforma'}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Problemas para acessar?{' '}
                <a
                  href="mailto:suporte@ced.ce.gov.br"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Fale com o suporte
                </a>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
            © {new Date().getFullYear()} Centro de Educação a Distância do Ceará
          </p>
        </div>
      </main>
    </div>
  );
}
