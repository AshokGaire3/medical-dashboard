using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MedicalDashboard.Api.Data;

/// <summary>
/// Used only by the EF Core CLI tools (dotnet ef migrations add) when targeting
/// the Npgsql provider.  Not referenced at runtime.
/// </summary>
public class PostgresDesignTimeFactory : IDesignTimeDbContextFactory<MedicalContext>
{
    public MedicalContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<MedicalContext>();

        // Read from env var first so the CI/CD pipeline can override it.
        // Falls back to a local dev Postgres instance.
        var connStr = Environment.GetEnvironmentVariable("POSTGRES_CONNECTION")
                      ?? "Host=localhost;Port=5432;Database=meddash_pg;Username=postgres;Password=postgres";

        optionsBuilder.UseNpgsql(connStr, npgsql =>
            npgsql.MigrationsAssembly("MedicalDashboard.Api"));

        return new MedicalContext(optionsBuilder.Options);
    }
}
