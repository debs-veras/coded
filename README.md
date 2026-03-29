# 🚀 Coded - Plataforma de Gestão Educacional

Bem-vindo ao **Coded**, uma plataforma robusta para gestão de atividades escolares. Este documento fornece um guia detalhado sobre como preparar seu ambiente e colocar o projeto para rodar, seja via Docker ou manualmente.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

### Geral
- **Git**: Para clonar e gerenciar versões do código.
- **Docker & Docker Compose** (Opcional, mas altamente recomendado): Para rodar o ambiente completo de forma isolada e rápida.

### Para Execução Manual
- **Python 3.10 ou superior**: Necessário para o Backend (Django).
- **Node.js 18 ou superior**: Necessário para o Frontend (React).
- **Gerenciador de Pacotes Node**: Recomendamos o **pnpm** (detectado no projeto) ou **npm**.

---

## 🐳 Opção 1: Execução via Docker (Recomendado)

O Docker simplifica o processo configurando o banco de dados e as dependências automaticamente dentro de containers.

1. **Subir os serviços**:
   Na raiz do projeto, abra o terminal e execute:
   ```bash
   docker-compose up --build
   ```
2. **Preparar o Banco de Dados (Migrações)**:
   Com os containers rodando, execute o comando para criar as tabelas:
   ```bash
   docker compose exec backend python manage.py migrate
   ```

3. **Aguardar a inicialização**:
   - O **Backend** estará disponível em: `http://localhost:8000`
   - O **Frontend** estará disponível em: `http://localhost:5173`

4. **Criar Usuário Administrador**:
   Com os containers rodando, abra um novo terminal na raiz do projeto e execute:
   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

> [!TIP]
> Com o Docker, você não precisa se preocupar em instalar Python ou Node localmente, apenas o Docker Engine.

---

## 🛠️ Opção 2: Execução Manual (Passo a Passo)

Siga estas etapas para configurar cada parte do sistema individualmente.

### 🐍 1. Backend (Django REST)

O backend gerencia a lógica de negócio, autenticação e o banco de dados (SQLite por padrão).

1. **Acessar o diretório**:
   ```bash
   cd coded-be
   ```
2. **Configurar Ambiente Virtual (venv)**:
   Isso isola as bibliotecas do projeto do seu sistema global.
   ```bash
   python -m venv .venv
   # Ativar no Windows:
   .venv\Scripts\activate
   # Ativar no Linux/Mac:
   source .venv/bin/activate
   ```
3. **Instalar Dependências**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Preparar o Banco de Dados**:
   Cria as tabelas necessárias no SQLite.
   ```bash
   python manage.py migrate
   ```
5. **Criar Usuário Administrador**:
   Necessário para acessar o painel de controle e gerenciar o sistema.
   ```bash
   python manage.py createsuperuser
   ```
6. **Iniciar o Servidor**:
   ```bash
   python manage.py runserver
   ```

### ⚛️ 2. Frontend (React + Vite)

A interface moderna que consome a API do backend.

1. **Acessar o diretório**:
   ```bash
   cd ../coded-fe
   ```
2. **Instalar Dependências**:
   ```bash
   pnpm install  # ou npm install
   ```
3. **Configurar Variáveis de Ambiente**:
   Crie um arquivo chamado `.env` na pasta `coded-fe` e adicione:
   ```env
   VITE_URL_API=http://127.0.0.1:8000
   ```
4. **Iniciar o Ambiente de Desenvolvimento**:
   ```bash
   pnpm run dev  # ou npm run dev
   ```

---

## 📂 Estrutura Detalhada do Projeto

Abaixo apresentamos a organização interna de cada módulo do sistema para facilitar a navegação no código-fonte.

### 🐍 Backend (`/coded-be`)
O backend segue o padrão modular do Django, separando a lógica de negócio por domínio:
- **`config/`**: Contém as configurações globais do Django (`settings.py`), roteamento raiz (`urls.py`) e definições de WSGI/ASGI.
- **`apps/`**: Diretório centralizado das aplicações:
  - **`accounts/`**: Gerenciamento de sessões e autenticação (JWT).
  - **`users/`**: Modelos de usuário customizados, perfis e dashboards.
  - **`classes/`**: Lógica de turmas, matrículas e associações aluno-professor.
  - **`activities/`**: Ciclo de vida das atividades e sistema de submissões/correções.
  - **`core/`**: Funcionalidades compartilhadas, como respostas padrão da API.
- **`manage.py`**: Utilitário de linha de comando para tarefas administrativas.
- **`requirements.txt`**: Lista de todas as dependências Python necessárias.

### ⚛️ Frontend (`/coded-fe`)
O frontend utiliza uma arquitetura baseada em componentes e serviços, organizada em `src/`:
- **`src/components/`**: Peças de UI reutilizáveis (botões, modais, cards, sidebar).
- **`src/pages/`**: Telas completas da aplicação, organizadas por contexto (Login, Dashboard, Atividades).
- **`src/services/`**: Camada de comunicação com o backend usando Axios.
- **`src/hooks/`**: Lógicas de estado complexas extraídas em Hooks customizados.
- **`src/layouts/`**: Modelos de página que definem a estrutura comum (ex: Sidebar + Header + Content).
- **`src/contexts/`**: Provedores de estado global (como o AuthContext).
- **`src/schemas/`**: Esquemas de validação de dados usando a biblioteca **Zod**.
- **`src/router/`**: Configurações de rotas da aplicação via React Router.
- **`src/types/`**: Interfaces e tipos globais para garantir a segurança do TypeScript.
- **`src/utils/`**: Funções auxiliares, formatadores de data e máscaras de campos.

---

## 🔐 Perfis de Acesso (RBAC)

Após rodar o comando `createsuperuser`, você pode acessar a API ou o Frontend com as credenciais criadas. Recomendamos criar perfis em `CustomUser` com diferentes `roles` (Student, Teacher, Admin) para testar as permissões de acesso da plataforma.

---

## ⚙️ Variáveis de Ambiente (.env)

O arquivo `.env` é fundamental para separar a configuração do código. No **Coded**, ele é usado principalmente no frontend para definir para onde as requisições devem ir.

### Frontend (`coded-fe/.env`)
- **`VITE_URL_API`**: Define o endereço base do backend (ex: `http://127.0.0.1:8000`).
- **Segurança**: No Vite, apenas variáveis prefixadas com `VITE_` são expostas ao código do cliente. Isso evita que chaves secretas do servidor vazem acidentalmente para o navegador.

---

## 👤 Perfis de Acesso (RBAC)

O **Coded** utiliza um sistema de Controle de Acesso Baseado em Papéis para garantir a segurança e a privacidade dos dados. Cada usuário possui um `role` definido que determina suas permissões dentro da plataforma.

### 1. 🎓 Estudante (STUDENT)
O foco do aluno é o consumo de conteúdo e a entrega de tarefas.
- **Dashboard Pessoal**: Acesso a métricas de desempenho, médias e prazos urgentes.
- **Atividades**: Pode visualizar todas as atividades publicadas para a sua **Turma (`ClassGroup`)**.
- **Submissões**: Pode enviar uma resposta para cada atividade, desde que esteja dentro do prazo.
- **Feedback**: Pode visualizar as notas e os comentários pedagógicos deixados pelo professor em suas entregas.
- **Restrição**: Não tem acesso aos dados de outros alunos ou de turmas nas quais não está matriculado.

### 2. 👨‍🏫 Professor (TEACHER)
O foco do professor é a gestão pedagógica e a avaliação.
- **Gestão de Atividades**: Pode criar, editar e remover atividades para as turmas que leciona.
- **Avaliação**: Tem acesso a todas as submissões enviadas pelos alunos para suas atividades.
- **Correção**: Pode atribuir notas (0 a 10) e escrever feedbacks detalhados para cada aluno.
- **Turmas**: Visualiza a lista de alunos matriculados em suas turmas vinculadas.
- **Restrição**: Não pode gerenciar usuários do sistema ou alterar configurações globais.

### 3. 🛡️ Administrador (ADMIN)
O foco do administrador é a manutenção e a gestão global.
- **Gestão de Usuários**: CRUD completo de Alunos, Professores e outros Admins.
- **Gestão de Turmas**: Cria e organiza os grupos de alunos e vincula os professores responsáveis.
- **Visibilidade Total**: Pode visualizar qualquer dado no sistema para fins de suporte e auditoria.
- **Configurações**: Acesso total ao painel administrativo e endpoints de gestão.

---

## 🏛️ Decisões Técnicas e Arquitetura

O **Coded** foi projetado com um foco rigoroso em escalabilidade, segurança e experiência do desenvolvedor (DX). Abaixo detalhamos as escolhas que sustentam a robustez da plataforma.

### 🐍 Backend (Django Ecosystem)

1.  **Monolito Modular via Django Apps**: Optamos por dividir o sistema em aplicações independentes (`users`, `activities`, `classes`). Isso garante o princípio da **Responsabilidade Única (SRP)**, facilitando a manutenção e permitindo que novas funcionalidades sejam acopladas sem gerar dívida técnica nos módulos existentes.
2.  **Django REST Framework (DRF)**: Escolhido pela maturidade em fornecer uma camada de serialização poderosa e um sistema de permissões extensível, essencial para o nosso modelo de **RBAC (Role-Based Access Control)**.
3.  **Segurança e JWT (JSON Web Tokens)**: Implementamos a autenticação via `djangorestframework-simplejwt`. Esta escolha permite uma API **stateless**, onde o servidor não precisa armazenar sessões, escalando horizontalmente com facilidade.
4.  **Padronização de Comunicação (`standard_response`)**: Criamos um contrato rígido de resposta JSON. Independentemente do endpoint, o frontend sempre recebe um objeto com `success`, `message` e `data`. Isso reduz a complexidade de tratamento de erros na UI e garante previsibilidade.
5.  **Otimização de Consultas (Aggregations)**: Para dashboards rápidos, utilizamos agregadores do banco de dados (`Count`, `Avg`, `Sum`) através do Django ORM. Isso evita o carregamento de milhares de registros na memória do servidor, processando as estatísticas diretamente na camada de dados.
6.  **Estratégia de Banco de Dados**: Utilizamos **SQLite** para o ambiente de desenvolvimento pela sua simplicidade e portabilidade (sem necessidade de configurar um servidor externo), mas o projeto está preparado para migrar para **PostgreSQL** em produção através de variáveis de ambiente no `settings.py`.

### ⚛️ Frontend (Modern React Stack)

1.  **Vite + React 19**: A escolha do Vite proporciona um Hot Module Replacement (HMR) instantâneo, enquanto o React 19 nos permite utilizar as últimas melhorias de renderização e estabilidade da biblioteca.
2.  **Arquitetura Service Layer**: Implementamos uma camada de abstração entre a UI e a API. Cada domínio possui um serviço dedicado que gerencia as requisições via **Axios**, permitindo a substituição de bibliotecas de rede ou a implementação de mocks de teste sem alterar os componentes.
3.  **Zustand para Estado Global**: Em vez do Redux (muitas vezes verboso), escolhemos o Zustand por sua simplicidade e performance. Ele gerencia o estado de autenticação e temas com um custo mínimo de re-renderização.
4.  **Validação Estruturada com Zod**: Utilizamos o Zod para definir schemas de validação que são compartilhados entre os formulários (**React Hook Form**) e a tipagem do TypeScript. Isso garante que os dados enviados para a API estejam sempre íntegros antes mesmo da requisição.
5.  **Design System com TailwindCSS 4.0**: A adoção do Tailwind 4 nos permite criar uma interface moderna com suporte nativo a **Dark Mode**, efeitos de **Glassmorphism** e animações fluidas, mantendo o bundle final extremamente leve.

### 📦 Infraestrutura e Tooling

1.  **Conteinerização com Docker**: O uso do `docker-compose` garante que qualquer desenvolvedor rode o projeto com as mesmas versões de Node, Python e dependências, eliminando o clássico problema do "na minha máquina funciona".
2.  **Gerenciamento de Pacotes Modernos**: No frontend, priorizamos o **pnpm** pela sua eficiência em armazenamento (content-addressable storage) e velocidade de instalação comparado ao npm tradicional. No backend, mantemos o padrão `pip` com `requirements.txt` para máxima compatibilidade.

---

## 📖 Documentação da API

Abaixo estão os endereços completos da API, organizados por recurso.

### 🔐 Autenticação (`/auth/`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autenticação inicial, retorna Access e Refresh tokens. |
| `POST` | `/auth/logout` | Invalida o Refresh Token atual. |
| `POST` | `/auth/token/refresh` | Gera um novo Access Token a partir de um Refresh válido. |
| `GET` | `/auth/verify` | Retorna os dados do usuário dono do token atual. |

### 👤 Usuários (`/users/`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/users/dashboard` | Estatísticas e progresso específicas para o **Aluno**. |
| `GET` | `/users` | Listagem de todos os usuários (Apenas Admin). |
| `POST` | `/users` | Cadastro de novos usuários. |
| `GET` | `/users/{id}` | Detalhes de um perfil específico. |
| `PATCH` | `/users/{id}` | Atualização de dados cadastrais. |

### 🏫 Turmas (`/classes/`)
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/classes` | Listagem de turmas ativas. |
| `POST` | `/classes` | Criação de nova turma. |
| `GET` | `/classes/{id}` | Detalhes da turma e lista de alunos matriculados. |

### 📝 Atividades e Submissões
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/atividades` | Listagem geral de atividades. |
| `POST` | `/atividades` | Criação de atividade (Professor). |
| `GET` | `/me/atividades` | Filtra atividades vinculadas ao usuário. |
| `POST` | `/respostas` | Envio de resposta para uma atividade (Aluno). |
| `GET` | `/me/respostas` | Lista de submissões do aluno |

---

## 📈 Scripts Disponíveis

Para facilitar o desenvolvimento e a manutenção, o projeto conta com os seguintes scripts:

### 🐍 Backend (Django)
Utilize estes comandos dentro da pasta `coded-be/` (com o venv ativo):
- `python manage.py runserver`: Inicia o servidor de desenvolvimento.
- `python manage.py migrate`: Aplica as migrações ao banco de dados.
- `python manage.py makemigrations`: Gera novos arquivos de migração após mudanças nos modelos.
- `python manage.py createsuperuser`: Cria um usuário com permissões totais de administrador.
- `python manage.py shell`: Abre um terminal interativo com o contexto do Django.

### ⚛️ Frontend (React/Vite)
Utilize estes comandos dentro da pasta `coded-fe/`:
- `pnpm dev`: Inicia o ambiente de desenvolvimento com Hot Module Replacement (HMR).
- `pnpm build`: Compila o projeto e gera arquivos otimizados para produção na pasta `dist/`.
- `pnpm lint`: Executa a verificação estática do código para encontrar problemas de padrão e sintaxe.
- `pnpm format`: Formata automaticamente todos os arquivos usando o Prettier.

