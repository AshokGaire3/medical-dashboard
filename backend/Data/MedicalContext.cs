using MedicalDashboard.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Patient + child cascades ----------------------------------------
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

        // --- Soft-delete + concurrency for Patient ---------------------------
        // Hide soft-deleted rows from every query by default. Use IgnoreQueryFilters()
        // to opt in (e.g. admin restore screens). Child entities inherit the
        // filter via their Patient navigation so a soft-deleted patient's
        // vitals/meds/etc. also disappear from queries.
        modelBuilder.Entity<Patient>().HasQueryFilter(p => p.DeletedAt == null);
        modelBuilder.Entity<Vital>().HasQueryFilter(v => v.Patient.DeletedAt == null);
        modelBuilder.Entity<MedicalCondition>().HasQueryFilter(mc => mc.Patient.DeletedAt == null);
        modelBuilder.Entity<Medication>().HasQueryFilter(m => m.Patient.DeletedAt == null);
        modelBuilder.Entity<TestResult>().HasQueryFilter(tr => tr.Patient.DeletedAt == null);
        modelBuilder.Entity<Appointment>().HasQueryFilter(a => a.Patient.DeletedAt == null);
        modelBuilder.Entity<Patient>().Property(p => p.ConcurrencyStamp).IsConcurrencyToken();
        modelBuilder.Entity<Patient>().HasIndex(p => p.DeletedAt);

        // --- Indexes ---------------------------------------------------------
        modelBuilder.Entity<Patient>().HasIndex(p => p.Status);
        modelBuilder.Entity<Patient>().HasIndex(p => p.IsCurrentPatient);
        modelBuilder.Entity<Patient>().HasIndex(p => p.Name);

        // --- Care team assignment -------------------------------------------
        // Doctors and nurses each have an optional roster. Restrict so a user
        // can't be deleted while still assigned to live patients (would need
        // explicit reassignment first).
        modelBuilder.Entity<Patient>()
            .HasOne(p => p.AssignedDoctor)
            .WithMany()
            .HasForeignKey(p => p.AssignedDoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Patient>()
            .HasOne(p => p.AssignedNurse)
            .WithMany()
            .HasForeignKey(p => p.AssignedNurseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Patient>().HasIndex(p => p.AssignedDoctorId);
        modelBuilder.Entity<Patient>().HasIndex(p => p.AssignedNurseId);

        // Composite indexes match the actual query patterns: list rows for a
        // patient ordered by time / status. SQL Server can use these to skip
        // a sort step entirely.
        modelBuilder.Entity<Vital>().HasIndex(v => new { v.PatientId, v.Timestamp });
        modelBuilder.Entity<Vital>().HasIndex(v => v.Timestamp);

        modelBuilder.Entity<Medication>().HasIndex(m => new { m.PatientId, m.Status });
        modelBuilder.Entity<Medication>().HasIndex(m => m.Status);

        modelBuilder.Entity<TestResult>().HasIndex(tr => new { tr.PatientId, tr.Date });
        modelBuilder.Entity<TestResult>().HasIndex(tr => tr.Date);

        modelBuilder.Entity<MedicalCondition>().HasIndex(mc => mc.PatientId);

        modelBuilder.Entity<Appointment>().HasIndex(a => new { a.PatientId, a.ScheduledAt });
        modelBuilder.Entity<Appointment>().HasIndex(a => a.ScheduledAt);
        modelBuilder.Entity<Appointment>().HasIndex(a => a.Status);
        modelBuilder.Entity<Appointment>().Property(a => a.ConcurrencyStamp).IsConcurrencyToken();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Audit logs: indexed by time (recent-first listing) and by user (per-user history).
        modelBuilder.Entity<AuditLog>().HasIndex(a => a.Timestamp);
        modelBuilder.Entity<AuditLog>().HasIndex(a => a.UserId);
        modelBuilder.Entity<AuditLog>().HasIndex(a => a.Resource);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        StampAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        StampAuditFields();
        return base.SaveChanges();
    }

    // Centralised audit/concurrency stamping so individual services don't have
    // to remember to set UpdatedAt or rotate ConcurrencyStamp on every write.
    private void StampAuditFields()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State != EntityState.Modified) continue;

            TrySetProperty(entry, "UpdatedAt", now);

            if (entry.Metadata.FindProperty("ConcurrencyStamp") is not null)
            {
                entry.CurrentValues["ConcurrencyStamp"] = Guid.NewGuid();
            }
        }
    }

    private static void TrySetProperty(EntityEntry entry, string name, object value)
    {
        var property = entry.Metadata.FindProperty(name);
        if (property is null) return;
        entry.CurrentValues[name] = value;
    }
}
