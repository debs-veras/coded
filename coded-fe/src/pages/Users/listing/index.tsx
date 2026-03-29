import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiDocumentText, HiPlus } from 'react-icons/hi';
import EmptyState from '../../../components/EmptyState';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import TableRowActions from '../../../components/ui/TableRowActions';
import AlertConfirm from '../../../components/ui/AlertConfirm';
import useToastLoading from '../../../hooks/useToastLoading';
import {
  formatDateName,
  formatDateTime,
  formatPhone,
} from '../../../utils/formatar';
import { getRoleBadgeStyles, translateRole } from '../../../utils/roles';
import Box, { BoxContainer } from '../../../components/ui/Box';
import { InputSelect, InputText } from '../../../components/ui/Input';
import { useForm } from 'react-hook-form';
import PageTable from '../../../components/ui/Pagination';
import type { SearchUserParams, User } from '../../../types/user';
import { deleteUser, getAllUsers } from '../../../services/user.service';
import useDebounce from '../../../hooks/useDebounce';

export default function UserListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchUserParams>();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    user?: User;
  }>({ show: false });

  const roleptions = [
    { value: 'ADMIN', label: translateRole('ADMIN') },
    { value: 'STUDENT', label: translateRole('STUDENT') },
    { value: 'TEACHER', label: translateRole('TEACHER') },
  ];

  const loadPosts = async (
    pageSize: number = registerForPage,
    page: number = 0
  ) => {
    setLoading(true);
    let filters: SearchUserParams = { page: page + 1, limit: pageSize };

    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        email: dataForm.email,
        name: dataForm.name,
        role: dataForm.role as 'ADMIN' | 'STUDENT' | 'TEACHER' | undefined,
      };
    })();

    const response = await getAllUsers(filters);
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
    setUsers(response?.data?.data || []);
    setLoading(false);
  };

  const debouncedLoadPosts = useDebounce(loadPosts, 500);

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setLoading(true);
    toast({ mensagem: 'Removendo dados..' });
    const response = await deleteUser(deleteModal.user.id);
    setLoading(false);
    loadPosts();
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    setDeleteModal({ show: false });
  };

  const handleClearFilters = () => {
    reset({
      email: '',
      name: '',
      role: '',
    });
    setCurrentPage(0);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedLoadPosts());
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
            name="name"
            size="sm"
            placeholder="Nome do usuário"
            required={false}
            label="Nome"
            register={register}
            disabled={isSubmitting}
          />
          <InputText
            name="email"
            size="sm"
            placeholder="Email do usuário"
            required={false}
            label="Email"
            register={register}
            disabled={isSubmitting}
          />
          <InputSelect
            control={control}
            name="role"
            label="Cargo"
            size="sm"
            required={false}
            options={roleptions}
            defaultOptionLabel="Todos"
            placeholder="Selecione o cargo"
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
        {users.length === 0 && !loading ? (
          <EmptyState
            title="Nenhum usuário encontrado"
            description="Você ainda não criou nenhum usuário. Comece agora!"
            actionLabel="Novo Usuário"
            actionTo="/user/form"
            icon={
              <HiDocumentText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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
                  text="Novo Usuário"
                  onClick={() => navigate('/user/form')}
                />
              }
            >
              <Table.Header>
                <Table.Header.Coluna>#</Table.Header.Coluna>
                <Table.Header.Coluna>Nome</Table.Header.Coluna>
                <Table.Header.Coluna>Email</Table.Header.Coluna>
                <Table.Header.Coluna>Role</Table.Header.Coluna>
                <Table.Header.Coluna>Telefone</Table.Header.Coluna>
                <Table.Header.Coluna>Data de criação</Table.Header.Coluna>
                <Table.Header.Coluna>Data de atualização</Table.Header.Coluna>
                <Table.Header.Coluna>Último Login</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Ações
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Body.Linha key={user.id}>
                    <Table.Body.Linha.Coluna>{user.id}</Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {user.name}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {user.email}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {user.role ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all duration-200 ${
                            getRoleBadgeStyles(user.role).bg
                          } ${getRoleBadgeStyles(user.role).text} ${
                            getRoleBadgeStyles(user.role).border
                          }`}
                        >
                          {translateRole(user.role)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatPhone(user.phone || '-')}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateName(user.date_joined || '-')}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateName(user.updated_at || '-')}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateTime(user.last_login)}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna alignText="text-right">
                      <TableRowActions
                        actions={{
                          edit: {
                            onClick: () => navigate(`/user/form/${user.id}`),
                          },
                          delete: {
                            onClick: () =>
                              setDeleteModal({ show: true, user: user }),
                          },
                        }}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>
            {users.length > 0 && (
              <PageTable
                loading={isSubmitting}
                page={currentPage}
                totalRecords={totalRegister}
                totalPages={totalPage}
                recordsPerPage={registerForPage}
                onClickPrevPage={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadPosts(registerForPage, newPage);
                }}
                onClickPageNext={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadPosts(registerForPage, newPage);
                }}
                onClickPage={(pagina) => {
                  setCurrentPage(pagina);
                  loadPosts(registerForPage, pagina);
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
        title="Excluir Usuário"
        description={
          <>
            Tem certeza que deseja excluir o usuário "{deleteModal.user?.name}"?
          </>
        }
        type="error"
      />
    </BoxContainer>
  );
}
