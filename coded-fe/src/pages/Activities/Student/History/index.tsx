import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiClock,
  FiStar,
  FiMessageSquare,
  FiX,
  FiEye,
} from 'react-icons/fi';
import useDebounce from '../../../../hooks/useDebounce';
import Table from '../../../../components/ui/Table';
import EmptyState from '../../../../components/EmptyState';
import Button from '../../../../components/ui/Button';
import { getStudentResponses } from '../../../../services/activity.service';
import type { StudentResponse } from '../../../../types/activity';
import { formatDateTime } from '../../../../utils/formatar';
import Box, { BoxContainer } from '../../../../components/ui/Box';
import PageTable from '../../../../components/ui/Pagination';
import { useForm } from 'react-hook-form';
import type { SearchStudentResponseParams } from '../../../../types/activity';
import { InputText } from '../../../../components/ui/Input';

export default function StudentHistory() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] =
    useState<StudentResponse | null>(null);
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
  } = useForm<SearchStudentResponseParams>();

  const fetchResponses = async (page: number = 0) => {
    setLoading(true);

    try {
      let title = '';
      await handleSubmit((data) => {
        title = data.title || '';
      })();

      const response = await getStudentResponses({
        title,
        page: page + 1,
        limit: recordsPerPage,
      });

      if (response.success && response.data) {
        setResponses(response.data.data);
        const pagination = response.data.pagination;
        setCurrentPage(pagination.page - 1);
        setTotalRecords(pagination.total);
        setTotalPages(pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useDebounce(() => {
    setCurrentPage(0);
    fetchResponses(0);
  }, 500);

  useEffect(() => {
    fetchResponses(0);
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedFetch());
    return () => subscription.unsubscribe();
  }, [watch, debouncedFetch]);

  const handleClearFilters = () => {
    reset({ title: '' });
    setCurrentPage(0);
    fetchResponses(0);
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
        {!loading && responses.length === 0 ? (
          <EmptyState
            title="Nenhuma resposta encontrada"
            description="Tente buscar por outro título de atividade"
          />
        ) : (
          <>
            <Table titulo="" densidade="compacta">
              <Table.Header>
                <Table.Header.Coluna>Atividade</Table.Header.Coluna>
                <Table.Header.Coluna>Data de Envio</Table.Header.Coluna>
                <Table.Header.Coluna>Status</Table.Header.Coluna>
                <Table.Header.Coluna>Nota</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Ação
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {responses.map((resp) => {
                  const isGraded =
                    resp.score !== undefined && resp.score !== null;

                  return (
                    <Table.Body.Linha key={resp.id}>
                      <Table.Body.Linha.Coluna>
                        {resp.activity?.title ||
                          `Atividade #${resp.activity?.id}`}
                      </Table.Body.Linha.Coluna>
                      <Table.Body.Linha.Coluna>
                        {formatDateTime(resp.created_at)}
                      </Table.Body.Linha.Coluna>
                      <Table.Body.Linha.Coluna>
                        {isGraded ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-full w-fit">
                            <FiCheckCircle className="w-3 h-3" /> Corrigido
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-full w-fit">
                            <FiClock className="w-3 h-3" /> Aguardando
                          </span>
                        )}
                      </Table.Body.Linha.Coluna>
                      <Table.Body.Linha.Coluna>
                        {isGraded ? (
                          <div className="flex flex-col">
                            <span className="text-xl font-black text-primary-600 leading-none">
                              {resp.score}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">
                              de {resp.activity?.max_score || '-'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-black">-</span>
                        )}
                      </Table.Body.Linha.Coluna>
                      <Table.Body.Linha.Coluna alignText="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            model="button"
                            type="info"
                            onClick={() => setSelectedResponse(resp)}
                            text="Ver Detalhes"
                            icon={<FiEye className="w-4 h-4" />}
                          />

                          {!isGraded && (
                            <Button
                              model="button"
                              type="warning"
                              onClick={() =>
                                navigate(
                                  `/atividades/responder/${resp.activity.id}`
                                )
                              }
                              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-none font-bold text-xs"
                              text="Editar"
                            />
                          )}
                        </div>
                      </Table.Body.Linha.Coluna>
                    </Table.Body.Linha>
                  );
                })}
              </Table.Body>
            </Table>

            {responses.length > 0 && (
              <PageTable
                loading={loading}
                page={currentPage}
                totalRecords={totalRecords}
                totalPages={totalPages}
                recordsPerPage={recordsPerPage}
                onClickPrevPage={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  fetchResponses(newPage);
                }}
                onClickPageNext={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  fetchResponses(newPage);
                }}
                onClickPage={(pagina) => {
                  setCurrentPage(pagina);
                  fetchResponses(pagina);
                }}
                className="mt-8"
              />
            )}
          </>
        )}
      </Box>

      {/* Modal Detalhes */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20">
          <div className="bg-white dark:bg-[#0D0D0D] w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Detalhes da Resposta
                </h2>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 cursor-pointer border-none bg-transparent"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">
                    Minha Resposta
                  </label>
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 leading-relaxed italic whitespace-pre-wrap shadow-inner">
                    "{selectedResponse.content}"
                  </div>
                </div>

                {selectedResponse.score !== undefined &&
                  selectedResponse.score !== null && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                      <div className="md:col-span-1 border-r border-primary-100 dark:border-primary-900/30 pr-4">
                        <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1 leading-none flex items-center gap-1.5">
                          <FiStar className="w-3 h-3 fill-primary-600" /> Nota
                        </div>
                        <div className="text-4xl font-black text-primary-700 dark:text-primary-400">
                          {selectedResponse.score}
                        </div>
                        <div className="text-[10px] font-bold text-primary-500 opacity-60 uppercase tracking-tighter italic">
                          Total: 10.0
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <FiMessageSquare className="w-3 h-3" /> Feedback do
                          Professor
                        </div>
                        <p className="text-sm font-medium text-primary-700 dark:text-primary-300 leading-relaxed">
                          {selectedResponse.feedback ||
                            'O professor não incluiu um comentário.'}
                        </p>
                      </div>
                    </div>
                  )}

                <div className="flex justify-end pt-4">
                  <Button
                    model="button"
                    type="success"
                    text="Fechar"
                    onClick={() => setSelectedResponse(null)}
                    className="px-8 shadow-lg shadow-primary-600/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BoxContainer>
  );
}
