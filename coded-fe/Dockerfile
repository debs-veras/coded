# Usar a imagem oficial do Node.js
FROM node:22-slim

# Instalar o pnpm globalmente
RUN npm install -g pnpm

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos de dependências
COPY package.json pnpm-lock.yaml* ./

# Instalar as dependências
RUN pnpm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que o Vite usa
EXPOSE 5173

# Executar o comando para rodar o servidor de desenvolvimento
# É importante rodar com "--host" para que o Vite escute todas as interfaces de rede
CMD ["pnpm", "run", "dev", "--host"]
