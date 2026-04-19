using System.Text;
using MedicalDashboard.Api.Auth;
using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Middleware;
using MedicalDashboard.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration: database provider (SQLite fallback) --------------------
var connStr = builder.Configuration.GetConnectionString("DefaultConnection")
              ?? "Data Source=meddash.db";
var useSqlite = connStr.Contains("Data Source=", StringComparison.OrdinalIgnoreCase)
                && !connStr.Contains("Server=", StringComparison.OrdinalIgnoreCase);

builder.Services.AddDbContext<MedicalContext>(options =>
{
    if (useSqlite)
        options.UseSqlite(connStr);
    else
        options.UseSqlServer(connStr);
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
    });

builder.Services.AddAuthorization();

// --- App services ----------------------------------------------------------
builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IPatientService, PatientService>();

builder.Services.AddControllers();

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
app.MapControllers();

// --- DB init + seed --------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var ctx = services.GetRequiredService<MedicalContext>();

        // For this demo we use EnsureCreated to avoid migration drift.
        // For production hardening: switch to MigrateAsync and maintain proper migrations.
        await ctx.Database.EnsureCreatedAsync();

        await DbSeeder.SeedAsync(ctx, services);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing/seeding the database.");
    }
}

app.Run();
