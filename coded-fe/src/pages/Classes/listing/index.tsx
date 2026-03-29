import { useState, useEffect
 } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiBookOpen } from 'react-icons/hi';
import EmptyState from '../../../components/EmptyState';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import TableRowActions from '../../../components/ui/TableRowActions';
import AlertConfirm from '../../../components/ui/AlertConfirm';
import useToastLoading from '../../../hooks/useToastLoading';
import Box, { BoxContainer } from '../../../components/ui/Box';
import { InputText } from '../../../components/ui/Input';
import { useForm } from 'react-hook-form';
import PageTable from '../../../components/ui/Pagination';
import type { Class, SearchClassParams } from '../../../types/class';
import { deleteClass, getAllClasses } from '../../../services/class.service';
import useDebounce from '../../../hooks/useDebounce';

type ClassFiltersForm = SearchClassParams;

export default function ClassListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [classes, setClasses] = useState<Class[]>([]);
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ClassFiltersForm>();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    classItem?: Class;
  }>({ show: false });

  const loadClasses = async (
    pageSize: number = registerForPage,
    page: number = 0
  ) => {
    setLoading(true);
    let filters: SearchClassParams = { page: page + 1, limit: pageSize };
    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        name: dataForm.name,
        teacher: dataForm.teacher,
      };
    })();

    const response = await getAllClasses(filters);

    if (response.success && response.data) {
      setClasses(response.data.data);
      const pageData = response.data.pagination;
      setCurrentPage(pageData.page - 1);
      setTotalRegister(pageData.total);
      setTotalPage(pageData.totalPages);
    } else {
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
    }

    setLoading(false);
  };

  const debouncedLoadClasses = useDebounce(loadClasses, 500);

  const handleDelete = async () => {
    if (!deleteModal.classItem) return;
    setLoading(true);
    toast({ mensagem: 'Removendo turma..' });
    const response = await deleteClass(deleteModal.classItem.id);
    setLoading(false);
    loadClasses();
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    setDeleteModal({ show: false });
  };

  const handleClearFilters = () => {
    reset({
      name: '',
      teacher: '',
    });
    setCurrentPage(0);
    loadClasses(registerForPage, 0);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedLoadClasses());
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <BoxContainer>
      <Box>
        <Box.Header>
          <Box.Header.Content>
            <Box.Header.Content.Titulo>Filtros</Box.Header.Content.Titulo>
          </Box.Header.Content>
        </Box.Header>
        <form className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid gap-4 items-end">
          <InputText
            name="name"
            size="sm"
            placeholder="Nome da turma"
            required={false}
            label="Nome"
            register={register}
            disabled={isSubmitting}
          />
          <InputText
            name="teacher"
            size="sm"
            placeholder="ID ou nome do professor"
            required={false}
            label="Professor"
            register={register}
            disabled={isSubmitting}
          />
          <div className="flex gap-2 justify-start">
            <Button
              model="button"
              type="print"
              text="Limpar"
              onClick={handleClearFilters}
              disabled={isSubmitting || loading}
            />
          </div>
        </form>
      </Box>

      <Box loading={loading}>
        {classes.length === 0 && !loading ? (
          <EmptyState
            title="Nenhuma turma encontrada"
            description="Você ainda não criou nenhuma turma. Comece agora!"
            actionLabel="Nova Turma"
            actionTo="/turma/form"
            icon={
              <HiBookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            }
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
                  icon={<HiPlus className="w-5 h-5" />}
                  text="Nova Turma"
                  onClick={() => navigate('/turma/form')}
                />
              }
            >
              <Table.Header>
                <Table.Header.Coluna>Nome</Table.Header.Coluna>
                <Table.Header.Coluna>Professor</Table.Header.Coluna>
                <Table.Header.Coluna>Alunos</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Ações
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {classes.map((cls) => (
                  <Table.Body.Linha key={cls.id}>
                    <Table.Body.Linha.Coluna className="font-medium text-foreground">
                      {cls.name}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {cls.teacher.name}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      <span className="px-2 py-1 rounded-md bg-muted text-xs font-semibold">
                        {cls.total_students || cls.students?.length || 0}
                      </span>
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna alignText="text-right">
                      <TableRowActions
                        actions={{
                          edit: {
                            onClick: () => navigate(`/turma/form/${cls.id}`),
                          },
                          delete: {
                            onClick: () =>
                              setDeleteModal({ show: true, classItem: cls }),
                          },
                        }}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>
            {classes.length > 0 && (
              <PageTable
                loading={isSubmitting}
                page={currentPage}
                totalRecords={totalRegister}
                totalPages={totalPage}
                recordsPerPage={registerForPage}
                onClickPrevPage={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadClasses(registerForPage, newPage);
                }}
                onClickPageNext={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadClasses(registerForPage, newPage);
                }}
                onClickPage={(pagina) => {
                  setCurrentPage(pagina);
                  loadClasses(registerForPage, pagina);
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
        title="Excluir Turma"
        description={
          <>
            Tem certeza que deseja excluir a turma "
            {deleteModal.classItem?.name}"?
          </>
        }
        type="error"
      />
    </BoxContainer>
  );
}
