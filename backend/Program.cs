using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Entity Framework with SQL Server
builder.Services.AddDbContext<MedicalContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register application services
builder.Services.AddScoped<IPatientService, PatientService>();

// Configure CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // More permissive in development
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // Production: Allow specific origins including GitHub Pages
            // Get allowed origins from configuration or use defaults
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
                ?? new[] { 
                    "http://localhost:5173", 
                    "http://localhost:3000"
                };
            
            policy.SetIsOriginAllowed(origin =>
            {
                // Allow configured origins
                if (allowedOrigins.Contains(origin))
                    return true;
                
                // Allow all GitHub Pages subdomains (https://username.github.io)
                if (origin.EndsWith(".github.io", StringComparison.OrdinalIgnoreCase) && 
                    origin.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
                    return true;
                
                return false;
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must be before UseHttpsRedirection and UseAuthorization
app.UseCors("AllowReact");

// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

// Seed database on startup (only in development)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<MedicalContext>();
        try
        {
            await DbSeeder.SeedAsync(context);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.Run();

