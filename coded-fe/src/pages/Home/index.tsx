import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiPlay,
  FiAward,
  FiBookOpen,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiUsers,
  FiStar,
  FiCheckCircle,
  FiCode,
  FiTrendingUp,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import heroIllustration from '../../../public/favicon.svg';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const courses = [
    {
      title: 'Desenvolvimento Fullstack',
      category: 'Tecnologia',
      students: '1.2k+',
      rating: 4.9,
      icon: <FiCode className="w-6 h-6" />,
      color: 'primary',
    },
    {
      title: 'Gestão Ágil de Projetos',
      category: 'Negócios',
      students: '850+',
      rating: 4.8,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'secondary',
    },
    {
      title: 'Inovação na Educação',
      category: 'Educação',
      students: '2.1k+',
      rating: 5.0,
      icon: <FiAward className="w-6 h-6" />,
      color: 'primary',
    },
  ];

  const stats = [
    { label: 'Alunos Ativos', value: '45k+' },
    { label: 'Municípios', value: '184' },
    { label: 'Cursos', value: '120+' },
    { label: 'Satisfação', value: '98%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-x-hidden font-sans selection:bg-primary-500/30 transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full h-full">
        {/* Header */}
        <header
          className={`px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
            scrolled
              ? 'backdrop-blur-xl bg-white/70 dark:bg-[#050505]/70 border-b border-gray-200/50 dark:border-white/5 py-3 shadow-lg'
              : 'bg-transparent border-b border-transparent'
          }`}
        >
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold select-none shadow-md shadow-primary-500/20 group-hover:scale-105 transition-all duration-300">
                CED
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Ceará
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {['Cursos', 'Sobre o CED', 'Inovação'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:-translate-y-px relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 cursor-pointer overflow-hidden relative group"
              aria-label="Toggle Theme"
            >
              <div className="transition-transform duration-500 group-hover:rotate-12">
                {theme === 'light' ? (
                  <FiMoon className="w-5 h-5" />
                ) : (
                  <FiSun className="w-5 h-5" />
                )}
              </div>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-2.5 rounded-full bg-linear-to-r from-primary-600 to-primary-500 text-white hover:shadow-xl hover:shadow-primary-500/30 transition-all font-bold text-sm hover:-translate-y-0.5 cursor-pointer"
              >
                Portal
              </button>
            </div>
            <button
              className="lg:hidden p-2.5 text-gray-900 dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-18 bg-white dark:bg-[#050505] z-40 p-6 flex flex-col gap-8 animate-fade-in-up">
            <div className="flex flex-col gap-6">
              {['Cursos', 'Sobre o CED', 'Inovação'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-2xl font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-2xl bg-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/20"
            >
              Acessar Portal
            </button>
          </div>
        )}

        {/* HERO */}
        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col items-start z-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-700 dark:text-primary-400 font-bold text-xs tracking-widest uppercase mb-8 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Educação Pública Digital
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-gray-900 dark:text-white text-balance transition-colors duration-500">
                TRANSFORME SEU <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 via-primary-500 to-secondary-500 animate-gradient">
                  FUTURO AGORA.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed transition-colors duration-500">
                Rompendo fronteiras para entregar qualificação de nível mundial
                e inclusão digital em todos os cantos do Ceará.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                <button className="group relative px-8 py-4.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-primary-600 dark:bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white">
                    EXPLORAR CURSOS
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="flex items-center gap-4 px-6 py-4 text-gray-800 dark:text-white font-bold hover:text-primary-600 dark:hover:text-primary-400 transition-all group cursor-pointer text-base">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:border-primary-500/50 group-hover:scale-110 transition-all shadow-sm">
                    <FiPlay className="ml-1 w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  Conheça o CED
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-12 border-t border-gray-200 dark:border-white/5 w-full">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element Right */}
            <div className="lg:col-span-5 relative mt-16 lg:mt-0 z-10 animate-float text-balance">
              <div className="relative glass-card rounded-[3rem] p-2 overflow-hidden aspect-4/5">
                <img
                  src={heroIllustration}
                  alt="Educação Digital"
                  className="w-full h-full object-cover rounded-[2.5rem]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                  <div className="w-16 h-16 bg-white dark:bg-primary-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                    <FiAward className="w-8 h-8 text-primary-600 dark:text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 leading-tight">
                    Excelência Certificada
                  </h3>
                  <p className="text-gray-300 font-medium">
                    Mais de uma década formando profissionais para o mercado
                    global.
                  </p>
                </div>
              </div>
              {/* Floating Decorative Card */}
              <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl animate-float [animation-delay:1s] hidden md:block border-primary-500/30">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-primary-600 border-4 border-white dark:border-neutral-900"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                      Alunos On-line
                    </p>
                    <p className="text-lg font-black text-primary-600 dark:text-primary-400">
                      +2.450
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FEATURED COURSES SECTION */}
        <section id="cursos" className="max-w-7xl mx-auto px-6 md:px-12 py-32 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="text-primary-600 dark:text-primary-400 font-black text-sm tracking-[0.2em] uppercase mb-4">
                Catálogo de Excelência
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                CURSOS EM DESTAQUE.
              </h2>
            </div>
            <button className="flex items-center gap-3 text-lg font-black text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
              VER TODOS OS CURSOS
              <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                    course.color === 'primary'
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400'
                  }`}
                >
                  {course.icon}
                </div>
                <div className="text-xs font-black tracking-widest text-primary-600 dark:text-primary-400 uppercase mb-3">
                  {course.category}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                    <FiUsers className="w-4 h-4" />
                    {course.students} Alunos
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-black text-yellow-500">
                    <FiStar className="w-4 h-4 fill-current" />
                    {course.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BENTO GRID (ABOUT) */}
        <section id="sobre-o-ced" className="max-w-7xl mx-auto px-6 md:px-12 py-20 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 h-auto xl:h-[600px]">
            {/* Main Bento Box */}
            <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-12 flex flex-col justify-between group overflow-hidden relative border border-gray-200 dark:border-white/10 hover:border-primary-500/30 transition-all duration-500 shadow-xl dark:shadow-none">
              <div className="absolute inset-0 bg-linear-to-tr from-primary-500/10 dark:from-primary-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 w-20 h-20 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <FiBookOpen className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white tracking-tighter leading-tight">
                  QUALIDADE QUE <br /> TRANSFORMA.
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xl max-w-md font-medium leading-relaxed">
                  Experiências de aprendizado imersivas focadas na realidade das
                  novas carreiras digitais.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 md:row-span-1 bg-secondary-500 rounded-[3rem] p-12 text-black flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
              <h2 className="text-4xl font-black mb-4 relative z-10 tracking-tighter">
                INCLUSÃO SEM FRONTEIRAS
              </h2>
              <p className="font-bold text-black/70 text-xl max-w-lg relative z-10 leading-relaxed">
                Cobrimos todos os 184 municípios cearenses com tecnologia de
                ponta.
              </p>
            </div>

            <div className="md:col-span-1 md:row-span-1 glass-card rounded-[3rem] p-10 flex flex-col items-center justify-center text-center group hover:bg-primary-500/5 transition-all">
              <div className="text-7xl font-black text-primary-600 dark:text-primary-500 mb-2 tracking-tighter">
                10+
              </div>
              <div className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                Anos de <br /> Liderança
              </div>
            </div>

            <div className="md:col-span-1 md:row-span-1 bg-gray-900 dark:bg-[#111] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center group hover:bg-primary-600 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all">
                <FiArrowRight className="w-8 h-8 text-white group-hover:text-primary-600 transition-colors" />
              </div>
              <div className="text-sm font-black text-white uppercase tracking-[0.2em]">
                CONHEÇA <br /> NOSSA HISTÓRIA
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="bg-white dark:bg-[#080808] py-32 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20 animate-fade-in-up">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">
                QUEM FAZ, RECOMENDA.
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                Milhares de alunos transformaram suas vidas através dos nossos
                certificados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 relative"
                >
                  <div className="flex gap-1 text-primary-500 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 italic mb-10 leading-relaxed">
                    "O CED Ceará abriu portas que eu nem sabia que existiam. O
                    curso de Fullstack me deu a base para meu primeiro emprego
                    na área de tecnologia."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-400 to-primary-600" />
                    <div>
                      <p className="font-black text-gray-900 dark:text-white">
                        Ana Oliveira
                      </p>
                      <p className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-tighter">
                        Aluna Egressa
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-white dark:bg-[#050505] border-t border-gray-200 dark:border-white/5 py-24 transition-colors duration-500 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20">
                  C
                </div>
                <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  Ceará Digital
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed mb-8">
                O maior portal de educação a distância pública do estado do
                Ceará, conectando pessoas ao conhecimento.
              </p>
              <div className="flex gap-4">
                {['ig', 'fb', 'yt', 'ln'].map((soc) => (
                  <div
                    key={soc}
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary-500 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="text-xs font-black uppercase">{soc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase text-sm">
                Plataforma
              </h4>
              <ul className="flex flex-col gap-4 text-gray-500 dark:text-gray-400 font-bold text-sm">
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Todos os Cursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Certificados
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Polos Digitais
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Blog Inova
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase text-sm">
                Institucional
              </h4>
              <ul className="flex flex-col gap-4 text-gray-500 dark:text-gray-400 font-bold text-sm">
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Sobre o CED
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Transparência
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Governo do Estado
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    LGPD
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 bg-slate-50 dark:bg-white/5 p-8 rounded-4xl border border-gray-100 dark:border-white/5">
              <h4 className="font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase text-sm">
                Newsletter Inovação
              </h4>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6">
                Receba novidades sobre novos cursos e tecnologias.
              </p>
              <div className="flex gap-2 p-1.5 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="bg-transparent border-none focus:ring-0 px-4 py-2 w-full text-sm font-bold"
                />
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-black text-xs hover:bg-primary-700 transition-all uppercase">
                  OK
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-gray-400">
            <div>
              &copy; {new Date().getFullYear()} Centro de Educação a Distância
              do Ceará.
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-primary-500" />
                Segurança 256-bit
              </div>
              <a href="#" className="hover:text-primary-600 transition-all">
                Privacidade
              </a>
              <a href="#" className="hover:text-primary-600 transition-all">
                Termos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
