# --- Сборка фронтенда ---
FROM node:18 AS frontend-build
WORKDIR /BookGenerator/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- Сборка бэкенда ---
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /BookGenerator
COPY backend/*.csproj ./backend/
RUN dotnet restore ./backend
COPY backend/. ./backend/
RUN dotnet publish ./backend -c Release -o out

# --- Финальный образ ---
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /BookGenerator
COPY --from=backend-build /BookGenerator/backend/out ./
COPY --from=frontend-build /BookGenerator/frontend/dist ./wwwroot

# Порт, который будет слушать ASP.NET
EXPOSE 8080
ENTRYPOINT ["dotnet", "BookGenerator.dll"]
