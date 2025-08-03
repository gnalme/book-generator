# --- Сборка фронтенда ---
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Сборка бэкенда ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /src

COPY backend/BookGenerator/ ./BookGenerator/
WORKDIR /src/BookGenerator

RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# --- Финальный образ ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Бэкенд
COPY --from=backend-build /app/publish ./

# Фронтенд
COPY --from=frontend-build /app/frontend/dist ./wwwroot

EXPOSE 8080
ENTRYPOINT ["dotnet", "BookGenerator.dll"]

