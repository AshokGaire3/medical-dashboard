using MedicalDashboard.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Data;

public class MedicalContext : DbContext
{
    public MedicalContext(DbContextOptions<MedicalContext> options) : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Vital> Vitals => Set<Vital>();
    public DbSet<MedicalCondition> MedicalConditions => Set<MedicalCondition>();
    public DbSet<Medication> Medications => Set<Medication>();
    public DbSet<TestResult> TestResults => Set<TestResult>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Vitals)
            .WithOne(v => v.Patient)
            .HasForeignKey(v => v.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.MedicalHistory)
            .WithOne(mc => mc.Patient)
            .HasForeignKey(mc => mc.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Medications)
            .WithOne(m => m.Patient)
            .HasForeignKey(m => m.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.TestResults)
            .WithOne(tr => tr.Patient)
            .HasForeignKey(tr => tr.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Appointments)
            .WithOne(a => a.Patient)
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>().HasIndex(p => p.Status);
        modelBuilder.Entity<Patient>().HasIndex(p => p.IsCurrentPatient);
        modelBuilder.Entity<Patient>().HasIndex(p => p.Name);

        modelBuilder.Entity<Vital>().HasIndex(v => v.PatientId);
        modelBuilder.Entity<Vital>().HasIndex(v => v.Timestamp);

        modelBuilder.Entity<Medication>().HasIndex(m => m.PatientId);
        modelBuilder.Entity<Medication>().HasIndex(m => m.Status);

        modelBuilder.Entity<TestResult>().HasIndex(tr => tr.PatientId);
        modelBuilder.Entity<TestResult>().HasIndex(tr => tr.Date);

        modelBuilder.Entity<MedicalCondition>().HasIndex(mc => mc.PatientId);

        modelBuilder.Entity<Appointment>().HasIndex(a => a.PatientId);
        modelBuilder.Entity<Appointment>().HasIndex(a => a.ScheduledAt);
        modelBuilder.Entity<Appointment>().HasIndex(a => a.Status);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
