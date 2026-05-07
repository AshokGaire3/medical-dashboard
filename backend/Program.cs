using System.Text;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using FluentValidation;
using FluentValidation.AspNetCore;
using MedicalDashboard.Api.Auth;
using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Hubs;
using MedicalDashboard.Api.Middleware;
using MedicalDashboard.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration: database provider (SQLite / PostgreSQL / SQL Server) ---
// Detection order:
//   "Host="   in the conn string  → PostgreSQL (Render / Supabase / etc.)
//   "Data Source=" without Server → SQLite (local dev default)
//   anything else                 → SQL Server (docker-compose / Azure)
var connStr = builder.Configuration.GetConnectionString("DefaultConnection")
              ?? "Data Source=../database/meddash.db";
var usePostgres = connStr.Contains("Host=", StringComparison.OrdinalIgnoreCase);
var useSqlite   = !usePostgres
                  && connStr.Contains("Data Source=", StringComparison.OrdinalIgnoreCase)
                  && !connStr.Contains("Server=", StringComparison.OrdinalIgnoreCase);

builder.Services.AddDbContext<MedicalContext>(options =>
{
    if (usePostgres)
    {
        options.UseNpgsql(connStr, npgsql =>
        {
            npgsql.MigrationsAssembly("MedicalDashboard.Api");
            // Transient-failure retry for cloud Postgres (Render spins down free DBs).
            npgsql.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorCodesToAdd: null);
        });
    }
    else if (useSqlite)
    {
        options.UseSqlite(connStr, sqlite => sqlite.MigrationsAssembly("MedicalDashboard.Api"));
    }
    else
    {
        options.UseSqlServer(connStr, sql =>
        {
            sql.MigrationsAssembly("MedicalDashboard.Api");
            // Transient-failure retry. SQL Server (especially Azure SQL / Docker)
            // routinely closes idle connections; without this, the first request
            // after an idle period 500s instead of recovering.
            sql.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
        });
    }

    // Most endpoints are read-only; tracking is wasted CPU/RAM. Mutating
    // services explicitly opt back in via .AsTracking() when needed.
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

// --- JWT auth --------------------------------------------------------------
var jwtSection = builder.Configuration.GetSection(JwtOptions.SectionName);
builder.Services.Configure<JwtOptions>(jwtSection);
var jwtOptions = jwtSection.Get<JwtOptions>() ?? new JwtOptions();

// Provide a dev-only key if nothing is configured so local setup works out-of-the-box.
if (string.IsNullOrWhiteSpace(jwtOptions.Key) || jwtOptions.Key.Length < 32)
{
    if (builder.Environment.IsDevelopment())
    {
        jwtOptions.Key = "dev-only-insecure-key-change-me-32chars-minimum!";
        builder.Services.PostConfigure<JwtOptions>(o => o.Key = jwtOptions.Key);
    }
    else
    {
        throw new InvalidOperationException("Jwt:Key must be configured in non-development environments (>= 32 chars).");
    }
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
            ClockSkew = TimeSpan.FromSeconds(30),
        };

        // SignalR sends the JWT as ?access_token=... on the WebSocket upgrade because
        // browsers can't set Authorization headers on WS connections. Pull it from the
        // query string when the request targets one of our hubs.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// --- App services ----------------------------------------------------------
builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<IHealthScoreService, HealthScoreService>();
builder.Services.AddSingleton<IPatientReportService, PatientReportService>();

builder.Services.AddControllers();
builder.Services.AddSignalR();

// --- Validation ------------------------------------------------------------
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// --- Swagger with JWT ------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Medical Dashboard API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Paste your JWT (no 'Bearer ' prefix needed).",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference { Id = "Bearer", Type = ReferenceType.SecurityScheme },
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { [scheme] = new List<string>() });
});

// --- CORS ------------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                          ?? new[] { "http://localhost:5173", "http://localhost:3000" };
            policy.SetIsOriginAllowed(origin =>
                  {
                      if (allowed.Contains(origin)) return true;
                      if (origin.EndsWith(".github.io", StringComparison.OrdinalIgnoreCase)
                          && origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase)) return true;
                      return false;
                  })
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();

// --- Pipeline --------------------------------------------------------------
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
// Audit logging runs after auth so we have user claims, but before controller execution.
app.UseMiddleware<AuditLoggingMiddleware>();
app.MapControllers();
// Real-time vitals hub. Clients connect at /hubs/vitals.
app.MapHub<VitalsHub>("/hubs/vitals");

// --- DB init + seed --------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var ctx = services.GetRequiredService<MedicalContext>();

        // Apply any pending EF migrations on startup. Schema changes ship as
        // committed migration files, not as runtime CREATE-IF-NOT-EXISTS.
        await ctx.Database.MigrateAsync();

        await DbSeeder.SeedAsync(ctx, services);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing/seeding the database.");
    }
}

app.Run();
