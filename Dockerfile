# --- Сборка фронтенда ---
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/book-generator/package*.json ./
RUN npm install
COPY frontend/book-generator/ ./
RUN npm run build

# --- Сборка бэкенда ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /app
COPY backend/BookGenerator/ ./BookGenerator/
RUN dotnet restore BookGenerator/BookGenerator/BookGenerator.csproj
RUN dotnet publish BookGenerator/BookGenerator/BookGenerator.csproj -c Release -o out

# --- Финальный образ ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=backend-build /app/out ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot

EXPOSE 8080
ENTRYPOINT ["dotnet", "BookGenerator.dll"]
