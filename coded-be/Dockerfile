# Usar a imagem oficial do Python
FROM python:3.12-slim

# Definir variáveis de ambiente para o Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Definir o diretório de trabalho no container
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependências do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o restante do código da aplicação
COPY . .

# Copiar e configurar o entrypoint.sh
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expor a porta que o Django usa
EXPOSE 8000

# Usar o entrypoint para lidar com as migrações e o comando final
ENTRYPOINT ["/app/entrypoint.sh"]
