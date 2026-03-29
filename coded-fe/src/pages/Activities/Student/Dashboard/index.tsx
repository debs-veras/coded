import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBook,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiStar,
  FiCalendar,
} from 'react-icons/fi';
import Box, { BoxContainer } from '../../../../components/ui/Box';
import { getStudentDashboard } from '../../../../services/activity.service';
import type { StudentDashboardData } from '../../../../types/dashboard';
import { formatDateTime } from '../../../../utils/formatar';
import Button from '../../../../components/ui/Button';
import EmptyState from '../../../../components/EmptyState';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getStudentDashboard();
        if (response.success && response.data) {
          setData(response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      label: 'Total de Atividades',
      value: data?.stats.total_activities || 0,
      icon: <FiBook />,
      color: 'bg-blue-500',
    },
    {
      label: 'Concluídas',
      value: data?.stats.completed_activities || 0,
      icon: <FiCheckCircle />,
      color: 'bg-green-500',
    },
    {
      label: 'Pendentes',
      value: data?.stats.pending_activities || 0,
      icon: <FiClock />,
      color: 'bg-amber-500',
    },
    {
      label: 'Média Geral',
      value: data?.stats.average_score?.toFixed(1) || '0.0',
      icon: <FiStar />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <BoxContainer>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-gray-100 dark:shadow-none`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                {stat.label}
              </p>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {stat.value}
              </h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Activities */}
          <Box loading={loading}>
            <Box.Header>
              <Box.Header.Content>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <Box.Header.Content.Titulo>
                    Para Hoje
                  </Box.Header.Content.Titulo>
                </div>
              </Box.Header.Content>
            </Box.Header>

            {!data || data.activities_today.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic text-sm">
                Nenhuma atividade vence hoje. Aproveite para descansar!
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {data?.activities_today.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                    onClick={() =>
                      navigate(`/atividades/responder/${activity.id}`)
                    }
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        {activity.title}
                      </h5>
                      <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-full">
                        Vence às {formatDateTime(activity.due_date, 'hora')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <FiAward className="w-3 h-3" /> {activity.teacher_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiBook className="w-3 h-3" /> {activity.class_name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Box>

          {/* Upcoming Activities */}
          <Box loading={loading}>
            <Box.Header>
              <Box.Header.Content>
                <Box.Header.Content.Titulo>
                  Próximas Atividades
                </Box.Header.Content.Titulo>
              </Box.Header.Content>
              <Button
                onClick={() => navigate('/atividades/turma')}
                text="Ver Atividades"
                model="button"
              />
            </Box.Header>

            {!data || data.upcoming_activities.length === 0 ? (
              <EmptyState
                title="Tudo em dia!"
                description="Você não tem atividades futuras pendentes."
              />
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {data?.upcoming_activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                    onClick={() =>
                      navigate(`/atividades/responder/${activity.id}`)
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <h5 className="font-bold text-gray-900 dark:text-white">
                          {activity.title}
                        </h5>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          {activity.class_name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                          {formatDateTime(activity.due_date, 'data')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {formatDateTime(activity.due_date, 'hora')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Box>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Class Info */}
          <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl shadow-primary-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:scale-175 transition-transform duration-500">
              <FiBook size={120} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/60">
              Sua Turma
            </p>
            <h4 className="text-2xl font-black mb-2 leading-tight">
              {data?.class_info.name || 'Carregando...'}
            </h4>
            <div className="flex items-center gap-2 text-primary-100 font-medium">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-bold">
                {data?.class_info.teacher.charAt(0)}
              </div>
              <span className="text-sm">{data?.class_info.teacher}</span>
            </div>
          </div>

          {/* Calendar Small */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 text-center">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-4">
              <FiCalendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Hoje é
            </p>
            <h4 className="text-xl font-black text-gray-900 dark:text-white capitalize">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(
                new Date()
              )}
            </h4>
          </div>
        </div>
      </div>
    </BoxContainer>
  );
}
