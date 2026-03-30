# Usar a imagem oficial do Node.js
FROM node:22-slim

# Instalar o pnpm globalmente
RUN npm install -g pnpm

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos de definição de dependências primeiro
COPY package.json pnpm-lock.yaml* ./

# Instalar as dependências (aproveita cache se package.json não mudar)
RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host"]
