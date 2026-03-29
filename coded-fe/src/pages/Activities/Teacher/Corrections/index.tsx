import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiEdit3,
  FiStar,
  FiMessageSquare,
  FiX,
  FiCheck,
  FiClock,
  FiArrowLeft,
} from 'react-icons/fi';
import Button from '../../../../components/ui/Button';
import Table from '../../../../components/ui/Table';
import EmptyState from '../../../../components/EmptyState';
import {
  getActivityById,
  getActivityResponses,
  gradeResponse,
} from '../../../../services/activity.service';
import useToastLoading from '../../../../hooks/useToastLoading';
import type {
  Activity,
  StudentResponse,
  SearchStudentResponseParams,
} from '../../../../types/activity';
import { formatDateTime } from '../../../../utils/formatar';
import Box, { BoxContainer } from '../../../../components/ui/Box';
import useDebounce from '../../../../hooks/useDebounce';
import { useForm } from 'react-hook-form';
import { InputText } from '../../../../components/ui/Input';
import PageTable from '../../../../components/ui/Pagination';

export default function TeacherCorrections() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastLoading();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchStudentResponseParams>();

  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [selectedResponse, setSelectedResponse] =
    useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: '',
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;

  const fetchActivity = async () => {
    if (!id) return;
    const atvRes = await getActivityById(id);
    if (atvRes.success && atvRes.data) setActivity(atvRes.data);
    else toast({ mensagem: atvRes.message, tipo: atvRes.type });
  };

  const loadResponses = async (
    pageSize: number = registerForPage,
    page: number = 0
  ) => {
    if (!id) return;
    setLoading(true);

    let filters: SearchStudentResponseParams = {
      page: page + 1,
      limit: pageSize,
    };

    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        student_name: dataForm.student_name,
      };
    })();

    const response = await getActivityResponses(id, filters);
    if (response.success && response.data) {
      const pageData = response.data.pagination;
      setResponses(response.data.data);
      setCurrentPage(pageData.page - 1);
      setTotalRegister(pageData.total);
      setTotalPage(pageData.totalPages);
    } else toast({ mensagem: response.message, tipo: response.type });
    setLoading(false);
  };

  const handleClearFilters = () => {
    reset({ student_name: '' });
    setCurrentPage(0);
  };

  const debouncedFetch = useDebounce(loadResponses, 500);

  useEffect(() => {
    fetchActivity();
    loadResponses();
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedFetch());
    return () => subscription.unsubscribe();
  }, []);

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResponse) return;

    toast({ mensagem: 'Salvando correção...' });

    const response = await gradeResponse(selectedResponse.id, {
      score: parseFloat(gradeData.score),
      feedback: gradeData.feedback,
    });

    if (response.success) {
      setSelectedResponse(null);
      setGradeData({ score: '', feedback: '' });
      loadResponses(registerForPage, currentPage);
    }
    toast({ mensagem: response.message, tipo: response.type });
  };

  const openGradeModal = (resp: StudentResponse) => {
    setSelectedResponse(resp);
    setGradeData({
      score: resp.score || '',
      feedback: resp.feedback || '',
    });
  };

  return (
    <BoxContainer>
      <Box>
        <Box.Header>
          <Box.Header.Content>
            <div className="flex items-center gap-4">
              <Button
                model="button"
                type="print"
                onClick={() => navigate('/atividades')}
                icon={<FiArrowLeft />}
                text="Voltar"
              />
              <Box.Header.Content.Titulo>
                Correção de Respostas (Atividade: {activity?.title})
              </Box.Header.Content.Titulo>
            </div>
          </Box.Header.Content>
        </Box.Header>
        <form className="lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid gap-4">
          <InputText
            name="student_name"
            size="sm"
            placeholder="Nome do aluno"
            required={false}
            label="Aluno"
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
        {responses.length === 0 && !loading ? (
          <EmptyState
            title="Nenhuma resposta"
            description="Os alunos ainda não enviaram respostas para esta atividade"
          />
        ) : (
          <>
            <Table titulo="">
              <Table.Header>
                <Table.Header.Coluna>Aluno</Table.Header.Coluna>
                <Table.Header.Coluna>Enviada em</Table.Header.Coluna>
                <Table.Header.Coluna>Status</Table.Header.Coluna>
                <Table.Header.Coluna>Nota</Table.Header.Coluna>
                <Table.Header.Coluna>Ação</Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {responses?.map((resp) => (
                  <Table.Body.Linha key={resp.id}>
                    <Table.Body.Linha.Coluna className="font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-xs uppercase">
                          {resp.student?.name?.charAt(0) || 'U'}
                        </div>
                        <span>
                          {resp.student?.name || `Estudante ${resp.student}`}
                        </span>
                      </div>
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateTime(resp.created_at)}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {resp.score !== undefined && resp.score !== null ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase">
                          <FiCheck className="w-4 h-4" /> Corrigido
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase">
                          <FiClock className="w-4 h-4" /> Pendente
                        </span>
                      )}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna className="font-black text-primary-600">
                      {resp.score !== undefined && resp.score !== null
                        ? resp.score
                        : '-'}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      <Button
                        model="button"
                        type="success"
                        onClick={() => openGradeModal(resp)}
                        text={
                          resp.score !== undefined && resp.score !== null
                            ? 'Editar'
                            : 'Avaliar'
                        }
                        icon={<FiEdit3 className="w-4 h-4" />}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>

            {responses.length > 0 && (
              <PageTable
                loading={loading}
                page={currentPage}
                totalRecords={totalRegister}
                totalPages={totalPage}
                recordsPerPage={registerForPage}
                onClickPrevPage={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadResponses(registerForPage, newPage);
                }}
                onClickPageNext={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadResponses(registerForPage, newPage);
                }}
                onClickPage={(pagina) => {
                  setCurrentPage(pagina);
                  loadResponses(registerForPage, pagina);
                }}
                className="mt-4"
              />
            )}
          </>
        )}
      </Box>

      {/* Modal Correção */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-20">
          <div className="bg-white dark:bg-[#0D0D0D] w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Avaliar Resposta
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
                    Conteúdo do Aluno
                  </label>
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 leading-relaxed italic whitespace-pre-wrap">
                    "{selectedResponse.content}"
                  </div>
                </div>

                <form onSubmit={handleGrade} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <FiStar className="text-amber-500" />
                        Nota (0-10)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={gradeData.score}
                        onChange={(e) =>
                          setGradeData({ ...gradeData, score: e.target.value })
                        }
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-xl font-black text-center text-primary-600"
                        placeholder="0.0"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <FiMessageSquare />
                        Feedback (Opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={gradeData.feedback}
                        onChange={(e) =>
                          setGradeData({
                            ...gradeData,
                            feedback: e.target.value,
                          })
                        }
                        placeholder="Escreva um comentário construtivo..."
                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      model="button"
                      type="error"
                      className="flex-1"
                      text="Cancelar"
                      onClick={() => setSelectedResponse(null)}
                    />
                    <Button
                      model="submit"
                      type="success"
                      className="flex-2 shadow-lg shadow-primary-600/20"
                      text="Confirmar Avaliação"
                      icon={<FiCheckCircle className="w-5 h-5" />}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </BoxContainer>
  );
}
