import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiBookOpen, HiAnnotation, HiUser } from 'react-icons/hi';
import Box, { BoxContainer } from '../../../components/ui/Box';
import { InputText, InputSelect } from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useToastLoading from '../../../hooks/useToastLoading';
import { classSchema, type ClassFormType } from '../../../schemas/class';
import {
  createClass,
  getClassById,
  updateClass,
} from '../../../services/class.service';
import { getAllUsers } from '../../../services/user.service';
import type { User } from '../../../types/user';
import type { CreateClassInput } from '../../../types/class';

export default function ClassForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastLoading();
  const isEdit = !!id;

  const [teachers, setTeachers] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormType>({
    resolver: zodResolver(classSchema),
  });

  const loadInitialData = async () => {
    const teachersRes = await getAllUsers({ role: 'TEACHER' });

    if (teachersRes.success && teachersRes.data)
      setTeachers(
        teachersRes.data.data.map((u: User) => ({
          value: u.id,
          label: u.name,
        }))
      );
    else toast({ mensagem: teachersRes.message, tipo: teachersRes.type });
    if (isEdit) {
      const response = await getClassById(id!);
      if (response.success && response.data) {
        setValue('name', response.data.name);
        setValue('description', response.data.description);
        setValue('teacher', response.data.teacher.id);
      } else {
        toast({ mensagem: response.message, tipo: response.type });
        reset();
        navigate('/turmas');
      }
    }
    setLoading(false);
  };

  const onSubmit = async (data: ClassFormType) => {
    const classData: CreateClassInput = { ...data };

    const response = isEdit
      ? await updateClass(id!, classData)
      : await createClass(classData);

    if (response.success) navigate('/turmas');
    toast({ mensagem: response.message, tipo: response.type });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <BoxContainer>
      <Box loading={loading}>
        <Box.Header>
          <Box.Header.Content>
            <Box.Header.Content.Titulo>
              {isEdit ? 'Editar Turma' : 'Nova Turma'}
            </Box.Header.Content.Titulo>
          </Box.Header.Content>
        </Box.Header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              name="name"
              label="Nome da Turma"
              placeholder="Ex: Turma de Progressão 2026 - A"
              icon={<HiBookOpen className="w-5 h-5 text-gray-400" />}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />

            <InputSelect
              name="teacher"
              label="Professor Responsável"
              placeholder="Selecione o professor"
              icon={<HiUser className="w-5 h-5 text-gray-400" />}
              control={control}
              options={teachers}
              errors={errors}
              disabled={isSubmitting}
            />
          </div>

          <InputText
            name="description"
            label="Descrição"
            placeholder="Descreva o foco da turma..."
            icon={<HiAnnotation className="w-5 h-5 text-gray-400" />}
            register={register}
            errors={errors}
            required={false}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              model="button"
              type="print"
              text="Voltar"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            />
            <Button
              model="submit"
              type="success"
              text={isEdit ? 'Salvar Alterações' : 'Criar Turma'}
              loading={isSubmitting}
            />
          </div>
        </form>
      </Box>
    </BoxContainer>
  );
}
