import type z from 'zod';

import { userSchema } from '../../../schemas/user';
import { useNavigate, useParams } from 'react-router-dom';
import useToastLoading from '../../../hooks/useToastLoading';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUser,
  getUserById,
  updateUser,
} from '../../../services/user.service';
import { getAllClasses } from '../../../services/class.service';
import { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import type { CreateUserInput } from '../../../types/user';
import Box from '../../../components/ui/Box';
import {
  InputCep,
  InputCpf,
  InputPassword,
  InputPhone,
  InputSelect,
  InputText,
  InputUf,
} from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { removeMask } from '../../../utils/formatar';

type UserFormType = z.infer<typeof userSchema>;

const roleOptions = [
  { value: 'TEACHER', label: 'Professor' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'STUDENT', label: 'Estudante' },
];

export default function UserForm() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = watch('role');
  const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const cepValue = watch('address.cep') as string | undefined;

  const fetchCep = async (cep: string) => {
    setIsFetchingCep(true);
    toast({ mensagem: 'Buscando endereço...' });
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      toast({ tipo: 'dismiss' });
      const data = await response.json();

      if (!data.erro) {
        setValue('address.logradouro', data.logradouro);
        setValue('address.bairro', data.bairro);
        setValue('address.localidade', data.localidade);
        setValue('address.uf', data.uf);
      } else toast({ mensagem: 'CEP não encontrado', tipo: 'error' });
    } catch {
      toast({ mensagem: 'Erro ao buscar CEP', tipo: 'error' });
    } finally {
      setIsFetchingCep(false);
    }
  };

  const debouncedFetchCep = useDebounce(fetchCep, 500);

  useEffect(() => {
    const cep = cepValue?.replace(/\D/g, '');
    if (cep?.length === 8) debouncedFetchCep(cep);
  }, [cepValue]);

  const fetchClasses = async () => {
    const response = await getAllClasses({ limit: 1000 });
    if (response.success && response.data) {
      const options = response.data.data.map((c) => ({
        value: c.id,
        label: c.name,
      }));
      setClasses(options);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const loadUser = async () => {
    const response = await getUserById(id!);
    if (response.success && response.data) {
      setValue('name', response.data.name);
      setValue('email', response.data.email);
      setValue('role', response.data.role);
      setValue('phone', response.data.phone);
      setValue('birth_date', response.data.birth_date);
      setValue('cpf', response.data.cpf);
      if (response.data.class_group)
        setValue('class_group', response.data.class_group);
      if (response.data.address) {
        setValue('address.cep', response.data.address.cep);
        setValue('address.logradouro', response.data.address.logradouro);
        setValue('address.numero', response.data.address.numero);
        setValue('address.bairro', response.data.address.bairro);
        setValue('address.localidade', response.data.address.localidade);
        setValue('address.uf', response.data.address.uf);
      }
    } else {
      toast({ mensagem: response.message, tipo: response.type });
      reset();
      navigate('/users');
    }
  };

  const onSubmit = async (data: UserFormType) => {
    const userData: CreateUserInput = {
      ...data,
      class_group: data.class_group || null,
      password: data.password || '',
      phone: removeMask(data.phone || ''),
      birth_date: data.birth_date ?? null,
      cpf: removeMask(data.cpf || ''),
      address: data.address
        ? {
            cep: removeMask(data.address.cep || ''),
            logradouro: data.address.logradouro ?? null,
            numero: data.address.numero ?? null,
            bairro: data.address.bairro ?? null,
            localidade: data.address.localidade ?? null,
            uf: data.address.uf ?? null,
          }
        : undefined,
    };

    const response = isEdit
      ? await updateUser(id!, userData)
      : await createUser(userData);

    toast({ mensagem: response.message, tipo: response.type });

    if (response.success) {
      reset();
      navigate('/users');
    }
  };

  useEffect(() => {
    if (isEdit) loadUser();
  }, [isEdit]);

  return (
    <Box loading={isEdit && isSubmitting}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            name="name"
            label="Nome Completo"
            register={register}
            errors={errors}
            disabled={isSubmitting}
            placeholder="Digite o nome"
          />

          <InputText
            name="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={isSubmitting}
            placeholder="Digite o email"
          />

          <InputCpf
            name="cpf"
            label="CPF"
            control={control}
            errors={errors}
            disabled={isSubmitting}
            placeholder="000.000.000-00"
          />

          <InputPhone
            name="phone"
            label="Telefone"
            control={control}
            errors={errors}
            disabled={isSubmitting}
            placeholder="(00) 00000-0000"
          />

          <InputText
            name="birth_date"
            label="Data de Nascimento"
            type="date"
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />

          <InputSelect
            control={control}
            name="role"
            label="Perfil"
            errors={errors}
            disabled={isSubmitting}
            options={roleOptions}
            defaultOptionLabel="Selecione um perfil"
            noNullOption
          />

          {selectedRole === 'STUDENT' && (
            <InputSelect
              control={control}
              name="class_group"
              label="Turma"
              errors={errors}
              disabled={isSubmitting}
              options={classes}
              defaultOptionLabel="Selecione uma turma"
            />
          )}
        </div>
        {!isEdit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputPassword
              name="password"
              label="Senha"
              register={register}
              errors={errors}
              disabled={isSubmitting}
              placeholder="Digite a senha"
            />

            <InputPassword
              name="password_confirm"
              label="Confirmar Senha"
              register={register}
              errors={errors}
              disabled={isSubmitting}
              placeholder="Confirme a senha"
            />
          </div>
        )}

        {(selectedRole === 'STUDENT' || selectedRole === 'TEACHER') && (
          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputCep
                name="address.cep"
                label="CEP"
                control={control}
                errors={errors}
                disabled={isSubmitting || isFetchingCep}
                placeholder="00000-000"
              />

              <InputText
                name="address.logradouro"
                label="Logradouro"
                register={register}
                errors={errors}
                disabled={isSubmitting || isFetchingCep}
                placeholder="Ex: Rua das Flores"
              />

              <InputText
                name="address.numero"
                label="Número"
                register={register}
                errors={errors}
                disabled={isSubmitting || isFetchingCep}
                placeholder="Ex: 123"
              />

              <InputText
                name="address.bairro"
                label="Bairro"
                register={register}
                errors={errors}
                disabled={isSubmitting || isFetchingCep}
                placeholder="Digite o bairro"
              />

              <InputText
                name="address.localidade"
                label="Cidade"
                register={register}
                errors={errors}
                disabled={isSubmitting || isFetchingCep}
                placeholder="Ex: São Paulo"
              />

              <InputUf
                control={control}
                name="address.uf"
                label="UF"
                errors={errors}
                disabled={isSubmitting || isFetchingCep}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="print"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            text="Voltar"
            model="button"
          />

          <Button
            type="info"
            loading={isSubmitting}
            disabled={isSubmitting}
            text={isSubmitting ? 'Salvando...' : 'Cadastrar'}
            model="submit"
          />
        </div>
      </form>
    </Box>
  );
}
