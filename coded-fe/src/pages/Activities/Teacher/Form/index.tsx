import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiSave,
  FiCalendar,
  FiType,
  FiAlignLeft,
  FiUsers,
} from 'react-icons/fi';
import Button from '../../../../components/ui/Button';
import { InputText, InputSelect } from '../../../../components/ui/Input';
import {
  getActivityById,
  createActivity,
  updateActivity,
} from '../../../../services/activity.service';
import { getAllClasses } from '../../../../services/class.service';
import useToastLoading from '../../../../hooks/useToastLoading';
import type { Class } from '../../../../types/class';
import Box, { BoxContainer } from '../../../../components/ui/Box';

const activitySchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  class_group: z.string().min(1, 'Selecione uma turma'),
  due_date: z.string().min(1, 'Selecione a data de entrega'),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export default function TeacherActivityForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: '',
      description: '',
      class_group: '',
      due_date: '',
    },
  });

  const fetchClasses = async () => {
    const response = await getAllClasses({});
    if (response.success && response.data) setClasses(response.data.data);
    else toast({ mensagem: response.message, tipo: response.type });
  };

  const fetchActivity = async () => {
    if (!id) return;
    setLoading(true);
    const response = await getActivityById(id);
    if (response.success && response.data) {
      setValue('title', response.data.title);
      setValue('description', response.data.description);
      setValue('class_group', String(response.data.class_group));
      setValue('due_date', response.data.due_date);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
    if (id) fetchActivity();
  }, [id]);

  const onSubmit = async (data: ActivityFormData) => {
    toast({
      mensagem: id ? 'Atualizando atividade...' : 'Criando atividade...',
    });

    const payload = {
      ...data,
      class_group: Number(data.class_group),
    };

    const response = id
      ? await updateActivity(id, payload)
      : await createActivity(payload);

    if (response.success) {
      toast({ mensagem: response.message, tipo: 'success' });
      navigate('/atividades');
    } else {
      toast({ mensagem: response.message, tipo: response.type || 'error' });
      reset();
    }
  };

  const classOptions = classes.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <BoxContainer>
      <Box loading={loading}>
        <Box.Header>
          <Box.Header.Content>
            <Box.Header.Content.Titulo>
              {isEdit ? 'Editar Atividade' : 'Nova Atividade'}
            </Box.Header.Content.Titulo>
          </Box.Header.Content>
        </Box.Header>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              name="title"
              label="Título da Atividade"
              placeholder="Ex: Redação sobre Tecnologia"
              register={register}
              errors={errors}
              icon={<FiType className="text-gray-400" />}
            />

            <InputSelect
              name="class_group"
              label="Turma Destino"
              control={control}
              options={classOptions}
              errors={errors}
              placeholder="Selecione a turma..."
              icon={<FiUsers className="text-gray-400" />}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
              Descrição / Instruções{' '}
              <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative group w-full">
              <FiAlignLeft className="absolute left-3 top-4 text-gray-400" />
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Descreva detalhadamente o que o aluno deve fazer..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none italic leading-relaxed"
              />
            </div>
            {errors.description && (
              <span className="text-xs text-red-500 mt-1 font-semibold">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              name="due_date"
              label="Data de Entrega"
              type="datetime-local"
              register={register}
              errors={errors}
              icon={<FiCalendar className="text-gray-400" />}
            />

            <div className="hidden md:block" />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button
              model="button"
              type="print"
              text="Voltar"
              onClick={() => navigate('/atividades')}
              className="px-8 font-bold"
            />
            <Button
              model="submit"
              type="success"
              loading={isSubmitting}
              className="px-10 font-black shadow-lg shadow-green-600/20"
              text={id ? 'Salvar Alterações' : 'Criar Atividade'}
              icon={<FiSave className="w-5 h-5" />}
            />
          </div>
        </form>
      </Box>
    </BoxContainer>
  );
}
