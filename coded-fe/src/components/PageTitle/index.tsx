import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FaHome, FaList, FaUser } from 'react-icons/fa';

export type PageMeta = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

type PageConfig = {
  match: RegExp;
  data?: PageMeta;
  build?: (id?: string) => PageMeta;
};

interface PageTitleProps {
  onChange?: (page: PageMeta) => void;
}

export default function PageTitle({ onChange }: PageTitleProps) {
  const location = useLocation();

  const config: PageConfig[] = useMemo(
    () => [
      {
        match: /^\/dashboard\/?$/,
        data: {
          name: 'Bem-vindo de volta',
          description: 'Aqui está um resumo da sua jornada acadêmica',
          icon: <FaHome />,
        },
      },
      {
        match: /^\/users$/,
        data: {
          name: 'Usuários',
          description: 'Gerencie os usuários do sistema',
          icon: <FaUser />,
        },
      },
      {
        match: /^\/user\/form$/,
        data: {
          name: 'Novo Usuário',
          description: 'Crie um novo usuário',
          icon: <FaUser />,
        },
      },
      {
        match: /^\/user\/form\/(.+)$/,
        build: (id) => ({
          name: 'Editar Usuário',
          description: `Editando usuário #${id ?? ''}`,
          icon: <FaUser />,
        }),
      },
      {
        match: /^\/turmas$/,
        data: {
          name: 'Turmas',
          description: 'Gerencie as turmas do sistema',
          icon: <FaUser />,
        },
      },
      {
        match: /^\/turma\/form$/,
        data: {
          name: 'Nova Turma',
          description: 'Crie uma nova turma',
          icon: <FaUser />,
        },
      },
      {
        match: /^\/turma\/form\/(.+)$/,
        build: (id) => ({
          name: 'Editar Turma',
          description: `Editando turma #${id ?? ''}`,
          icon: <FaUser />,
        }),
      },
      // Atividades - Professor
      {
        match: /^\/atividades\/?$/,
        data: {
          name: 'Minhas Atividades',
          description: 'Gerencie as atividades enviadas para suas turmas',
          icon: <FaList />,
        },
      },
      {
        match: /^\/atividades\/form$/,
        data: {
          name: 'Nova Atividade',
          description: 'Crie uma nova atividade para seus alunos',
          icon: <FaList />,
        },
      },
      {
        match: /^\/atividades\/form\/(.+)$/,
        build: (id) => ({
          name: 'Editar Atividade',
          description: `Editando atividade #${id ?? ''}`,
          icon: <FaList />,
        }),
      },
      {
        match: /^\/atividades\/(.+)\/respostas$/,
        build: (id) => ({
          name: 'Correção de Respostas',
          description: `Avaliando respostas da atividade #${id ?? ''}`,
          icon: <FaList />,
        }),
      },
      // Atividades - Aluno
      {
        match: /^\/atividades\/turma$/,
        data: {
          name: 'Atividades da Turma',
          description: 'Confira as atividades disponíveis e envie suas respostas',
          icon: <FaList />,
        },
      },
      {
        match: /^\/atividades\/responder\/(.+)$/,
        build: (id) => ({
          name: 'Enviar Resposta',
          description: `Respondendo à atividade #${id ?? ''}`,
          icon: <FaList />,
        }),
      },
      {
        match: /^\/respostas\/historico$/,
        data: {
          name: 'Minhas Respostas',
          description: 'Histórico de atividades enviadas e notas',
          icon: <FaList />,
        },
      },
    ],
    []
  );

  const currentPage: PageMeta = useMemo(() => {
    const path = location.pathname;

    for (const item of config) {
      const match = path.match(item.match);
      if (!match) continue;
      if (item.data) return item.data;
      if (item.build) return item.build(match[1]);
    }

    return {
      name: 'Página',
      description: 'Navegue pelo blog',
      icon: <FaList />,
    };
  }, [location.pathname, config]);

  useEffect(() => {
    document.title = `${currentPage.name}`;
    onChange?.(currentPage);
  }, [currentPage, onChange]);

  return (
    <div className="flex flex-col">
      <div className="text-xl flex gap-2 items-center">
        <span className="text-primary">{currentPage.icon}</span>
        <h1 className="font-semibold text-primary">{currentPage.name}</h1>
      </div>

      <p className="text-sm text-gray-500">{currentPage.description}</p>
    </div>
  );
}
