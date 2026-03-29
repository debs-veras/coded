import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import Button from '../../../../components/ui/Button';
import Table from '../../../../components/ui/Table';
import TableRowActions from '../../../../components/ui/TableRowActions';
import EmptyState from '../../../../components/EmptyState';
import {
  getTeacherActivities,
  deleteActivity,
} from '../../../../services/activity.service';
import useToastLoading from '../../../../hooks/useToastLoading';
import type {
  Activity,
  SearchActivityParams,
} from '../../../../types/activity';
import { formatDateTime } from '../../../../utils/formatar';
import Box, { BoxContainer } from '../../../../components/ui/Box';
import useDebounce from '../../../../hooks/useDebounce';
import { useForm } from 'react-hook-form';
import AlertConfirm from '../../../../components/ui/AlertConfirm';
import { InputText } from '../../../../components/ui/Input';
import { BiBook } from 'react-icons/bi';
import PageTable from '../../../../components/ui/Pagination';

export default function TeacherActivityListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchActivityParams>();

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    activity?: Activity;
  }>({ show: false });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;

  const loadActivities = async (
    pageSize: number = registerForPage,
    page: number = 0
  ) => {
    setLoading(true);
    let filters: SearchActivityParams = { page: page + 1, limit: pageSize };

    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        title: dataForm.title,
      };
    })();

    const response = await getTeacherActivities(filters);
    if (response.success && response.data) {
      const page = response.data.pagination;
      setCurrentPage(page.page - 1);
      setTotalRegister(page.total);
      setTotalPage(page.totalPages);
    } else
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
    setActivities(response?.data?.data || []);
    setLoading(false);
  };

  const debouncedFetch = useDebounce(loadActivities, 500);

  const handleDelete = async () => {
    if (!deleteModal.activity) return;
    setLoading(true);
    toast({ mensagem: 'Removendo dados..' });
    const response = await deleteActivity(deleteModal.activity.id);
    setLoading(false);
    loadActivities();
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    setDeleteModal({ show: false });
  };

  const handleClearFilters = () => {
    reset({ title: '' });
    setCurrentPage(0);
  };

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedFetch());
    return () => subscription.unsubscribe();
  }, []);

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
        {activities.length === 0 && !loading ? (
          <EmptyState
            title="Nenhuma atividade encontrada"
            description="Você ainda não criou nenhuma atividade. Comece agora!"
            actionLabel="Nova Atividade"
            actionTo="/atividades/form"
          />
        ) : (
          <>
            <Table
              densidade="compacta"
              titulo=""
              botoes={
                <Button
                  model="button"
                  type="info"
                  icon={<BiBook className="w-5 h-5" />}
                  text="Nova Atividade"
                  onClick={() => navigate('/atividades/form')}
                />
              }
            >
              <Table.Header>
                <Table.Header.Coluna>Título</Table.Header.Coluna>
                <Table.Header.Coluna>Turma</Table.Header.Coluna>
                <Table.Header.Coluna>Prazo</Table.Header.Coluna>
                <Table.Header.Coluna>Enviada em</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Ações
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {activities.map((activity) => (
                  <Table.Body.Linha key={activity.id}>
                    <Table.Body.Linha.Coluna className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      <span className="px-2 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase">
                        {activity.class?.name ||
                          `Turma ${activity.class_group}`}
                      </span>
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateTime(activity.due_date)}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateTime(activity.created_at)}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna alignText="text-right">
                      <TableRowActions
                        actions={{
                          publish: {
                            onClick: () =>
                              navigate(`/atividades/${activity.id}/respostas`),
                            title: 'Ver Respostas',
                            icon: (
                              <FiCheckCircle className="w-5 h-5 text-green-500" />
                            ),
                          },
                          edit: {
                            onClick: () =>
                              navigate(`/atividades/form/${activity.id}`),
                          },
                          delete: {
                            onClick: () =>
                              setDeleteModal({
                                show: true,
                                activity: activity,
                              }),
                          },
                        }}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>

            {activities.length > 0 && (
              <PageTable
                loading={isSubmitting}
                page={currentPage}
                totalRecords={totalRegister}
                totalPages={totalPage}
                recordsPerPage={registerForPage}
                onClickPrevPage={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadActivities(registerForPage, newPage);
                }}
                onClickPageNext={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadActivities(registerForPage, newPage);
                }}
                onClickPage={(pagina) => {
                  setCurrentPage(pagina);
                  loadActivities(registerForPage, pagina);
                }}
                className="mt-4"
              />
            )}
          </>
        )}
      </Box>

      <AlertConfirm
        open={deleteModal.show}
        onOpenChange={(open) =>
          setDeleteModal(open ? deleteModal : { show: false })
        }
        onConfirm={handleDelete}
        title="Excluir Atividade"
        description={
          <>
            Tem certeza que deseja excluir a atividade "
            {deleteModal.activity?.title}
            "?
          </>
        }
        type="error"
      />
    </BoxContainer>
  );
}
