import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiCheckCircle,
  FiChevronRight,
  FiAlertCircle,
} from 'react-icons/fi';
import EmptyState from '../../../../components/EmptyState';
import {
  getStudentActivities,
  getStudentResponses,
} from '../../../../services/activity.service';
import type { Activity, StudentResponse } from '../../../../types/activity';
import { formatDateTime } from '../../../../utils/formatar';
import Box, { BoxContainer } from '../../../../components/ui/Box';
import useDebounce from '../../../../hooks/useDebounce';
import PageTable from '../../../../components/ui/Pagination';
import { useForm } from 'react-hook-form';
import type { SearchActivityParams } from '../../../../types/activity';
import { InputText } from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import useToastLoading from '../../../../hooks/useToastLoading';

export default function StudentActivityListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 10;

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchActivityParams>();

  const fetchActivities = async (page: number = 0) => {
    setLoading(true);

    let title = '';
    await handleSubmit((data) => {
      title = data.title || '';
    })();

    const response = await getStudentActivities({
      title,
      page: page + 1,
      limit: recordsPerPage,
    });

    if (response.success && response.data) {
      setActivities(response.data.data);
      const pagination = response.data.pagination;
      setCurrentPage(pagination.page - 1);
      setTotalRecords(pagination.total);
      setTotalPages(pagination.totalPages);
    }
    setLoading(false);
  };

  const fetchResponses = async () => {
    const response = await getStudentResponses();
    if (response.success && response.data) setResponses(response.data.data);
    else toast({ mensagem: response.message, tipo: response.type });
  };

  const debouncedFetch = useDebounce(() => {
    setCurrentPage(0);
    fetchActivities(0);
  }, 500);

  useEffect(() => {
    fetchResponses();
    fetchActivities(0);
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedFetch());
    return () => subscription.unsubscribe();
  }, []);

  const handleClearFilters = () => {
    reset({ title: '' });
    setCurrentPage(0);
    fetchActivities(0);
  };

  const getResponseForActivity = (activityId: number) => {
    return responses?.find((r) => r.activity.id === activityId);
  };

  const isExpired = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <BoxContainer>
      <Box>
        <Box.Header>
          <Box.Header.Content>
            <Box.Header.Content.Titulo>Filtros</Box.Header.Content.Titulo>
          </Box.Header.Content>
        </Box.Header>
        <form className="lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid gap-4">
          <InputText
            name="title"
            size="sm"
            placeholder="Título da atividade"
            required={false}
            label="Título"
            register={register}
            disabled={isSubmitting}
          />

          <div className=" flex items-end gap-2 justify-end">
            <Button
              model="button"
              type="print"
              text="Limpar filtros"
              onClick={handleClearFilters}
              disabled={isSubmitting || loading}
            />
          </div>
        </form>
      </Box>

      <Box loading={loading}>
        {activities.length === 0 ? (
          <EmptyState
            title="Nenhuma atividade encontrada"
            description="Fique atento às notificações do seu professor"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => {
              const response = getResponseForActivity(activity.id);
              const expired = isExpired(activity.due_date);

              const isGraded =
                !!response &&
                response.score !== undefined &&
                response.score !== null;
              const isSubmitted = !!response && !isGraded;
              const isExpiredActual = !response && expired;

              return (
                <div
                  key={activity.id}
                  className={`group relative bg-gray-50/50 dark:bg-gray-800/50 border rounded-3xl p-6 transition-all duration-300 flex flex-col ${
                    isGraded
                      ? 'border-green-100 dark:border-green-900/30'
                      : isSubmitted
                        ? 'border-primary-100 dark:border-primary-900/30'
                        : isExpiredActual
                          ? 'border-red-100 dark:border-gray-800 opacity-80'
                          : 'border-amber-100 dark:border-amber-900/30 hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-1">
                      {isGraded ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest">
                          <FiCheckCircle className="w-3.5 h-3.5" /> Corrigida
                        </span>
                      ) : isSubmitted ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-600 text-[10px] font-black uppercase tracking-widest">
                          <FiClock className="w-3.5 h-3.5" /> Resposta enviada
                        </span>
                      ) : isExpiredActual ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest">
                          <FiAlertCircle className="w-3.5 h-3.5" /> Expirada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                          <FiClock className="w-3.5 h-3.5" /> Aguardando
                          resposta
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                        Prazo
                      </div>
                      <div
                        className={`text-xs font-black ${expired ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {formatDateTime(activity.due_date)}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 decoration-primary-500 group-hover:underline underline-offset-4 decoration-2">
                    {activity.title}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-8 h-10 italic leading-relaxed">
                    "{activity.description}"
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-semibold italic">
                        Postado em {formatDateTime(activity.created_at)}
                      </span>
                      {isGraded ? (
                        <span className="text-xs font-black text-green-600">
                          Nota: {response.score} / {activity.max_score}
                        </span>
                      ) : (
                        activity.max_score && (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Valor: {activity.max_score}
                          </span>
                        )
                      )}
                    </div>

                    <div className="flex gap-2">
                      {isGraded ? (
                        <Button
                          model="button"
                          type="success"
                          text="Ver Resultado"
                          onClick={() => navigate('/respostas/historico')}
                          className="px-6 py-2.5 text-xs font-bold"
                        />
                      ) : isSubmitted ? (
                        <Button
                          model="button"
                          type="warning"
                          text="Editar Resposta"
                          onClick={() =>
                            navigate(`/atividades/responder/${activity.id}`)
                          }
                          className="px-6 py-2.5 text-xs font-bold"
                        />
                      ) : isExpiredActual ? (
                        <Button
                          model="button"
                          type="default"
                          text="Expirada"
                          className="px-6 py-2.5 text-xs font-bold opacity-50 cursor-not-allowed"
                          disabled
                        />
                      ) : (
                        <Button
                          model="button"
                          type="success"
                          text="Responder"
                          onClick={() =>
                            navigate(`/atividades/responder/${activity.id}`)
                          }
                          icon={<FiChevronRight className="w-4 h-4" />}
                          className="px-6 py-2.5 text-xs font-bold shadow-lg shadow-primary-600/20"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activities.length > 0 && (
          <PageTable
            loading={loading}
            page={currentPage}
            totalRecords={totalRecords}
            totalPages={totalPages}
            recordsPerPage={recordsPerPage}
            onClickPrevPage={() => {
              const newPage = currentPage - 1;
              setCurrentPage(newPage);
              fetchActivities(newPage);
            }}
            onClickPageNext={() => {
              const newPage = currentPage + 1;
              setCurrentPage(newPage);
              fetchActivities(newPage);
            }}
            onClickPage={(pagina) => {
              setCurrentPage(pagina);
              fetchActivities(pagina);
            }}
            className="mt-8"
          />
        )}
      </Box>
    </BoxContainer>
  );
}
