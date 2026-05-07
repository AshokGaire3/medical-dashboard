# ── Build stage ──────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore dependencies first (layer-cache friendly).
COPY *.csproj ./
RUN dotnet restore

# Copy source and publish a self-contained release build.
COPY . ./
RUN dotnet publish -c Release -o /app /p:UseAppHost=false

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app ./

# Render assigns a PORT env var; fall back to 5000 for local Docker / compose.
ENV ASPNETCORE_URLS=http://+:${PORT:-5000}
EXPOSE 5000
EXPOSE 10000

ENTRYPOINT ["dotnet", "MedicalDashboard.Api.dll"]
