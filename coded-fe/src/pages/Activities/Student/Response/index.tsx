import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSend, FiClock, FiAlignLeft, FiAlertCircle } from 'react-icons/fi';
import Button from '../../../../components/ui/Button';
import {
  getActivityById,
  getStudentResponses,
  submitResponse,
  updateResponse,
} from '../../../../services/activity.service';
import useToastLoading from '../../../../hooks/useToastLoading';
import type { Activity, StudentResponse } from '../../../../types/activity';
import { formatDateTime } from '../../../../utils/formatar';
import Box, { BoxContainer } from '../../../../components/ui/Box';

const responseSchema = z.object({
  content: z.string().min(10, 'A resposta deve ter pelo menos 10 caracteres'),
});

type ResponseFormData = z.infer<typeof responseSchema>;

export default function StudentResponseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [existingResponse, setExistingResponse] =
    useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
  });

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [actRes, respRes] = await Promise.all([
        getActivityById(id),
        getStudentResponses(),
      ]);
      if (actRes.success && actRes.data) setActivity(actRes.data);
      if (respRes.success && respRes.data) {
        const data = respRes.data.data;
        const resp = data.find((r) => r.activity.id === Number(id));

        if (resp) {
          setExistingResponse(resp);
          reset({ content: resp.content });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: ResponseFormData) => {
    toast({
      mensagem: existingResponse
        ? 'Atualizando resposta...'
        : 'Enviando resposta...',
    });

    const response = existingResponse
      ? await updateResponse(existingResponse.id, data)
      : await submitResponse({
          activity: Number(id),
          content: data.content,
        });

    if (response.success) {
      toast({ mensagem: 'Resposta enviada com sucesso!', tipo: 'success' });
      navigate('/atividades/turma');
    } else {
      toast({ mensagem: response.message, tipo: response.type || 'error' });
    }
  };

  const expired = activity ? new Date(activity.due_date) < new Date() : false;
  const isGraded =
    existingResponse?.score !== undefined && existingResponse?.score !== null;

  return (
    <BoxContainer>
      <Box loading={loading}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Detalhes da Atividade
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiAlignLeft className="w-4 h-4 text-primary-600 mt-1" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      Descrição
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                      "{activity?.description}"
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiClock className="w-4 h-4 text-primary-600 mt-1" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      Prazo de Entrega
                    </div>
                    <div
                      className={`text-sm font-black ${expired ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      {activity ? formatDateTime(activity.due_date) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {expired && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex gap-4 text-red-600">
                <FiAlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-xs font-bold">
                  O prazo para esta atividade já expirou. Você não pode mais
                  enviar ou editar sua resposta.
                </p>
              </div>
            )}

            {isGraded && (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-6 flex gap-4 text-green-600 font-bold uppercase tracking-wider text-[10px]">
                Atividade já avaliada. Edição bloqueada.
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1 leading-none">
                  Minha Resposta
                </label>
                <textarea
                  {...register('content')}
                  rows={12}
                  disabled={expired || isGraded || isSubmitting}
                  placeholder="Escreva sua resposta aqui..."
                  className="w-full px-5 py-4 rounded-xl border border-neutral-200 dark:border-neutral-700 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none italic leading-relaxed"
                />
                {errors.content && (
                  <span className="text-xs text-red-500 mt-1 font-semibold">
                    {errors.content.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-4 pt-6">
                <Button
                  model="button"
                  type="print"
                  text="Voltar"
                  onClick={() => navigate(-1)}
                />
                <Button
                  model="submit"
                  type="success"
                  loading={isSubmitting}
                  disabled={expired || isGraded}
                  className="flex items-center gap-2 px-8"
                  text={existingResponse ? 'Salvar Edição' : 'Enviar Resposta'}
                  icon={<FiSend className="w-5 h-5" />}
                />
              </div>
            </form>
          </div>
        </div>
      </Box>
    </BoxContainer>
  );
}
