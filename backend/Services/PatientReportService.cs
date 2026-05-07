using MedicalDashboard.Api.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MedicalDashboard.Api.Services;

public interface IPatientReportService
{
    // Renders a patient summary as a PDF byte array. Includes demographics,
    // active medications, recent vitals, conditions, and the latest NEWS2 score.
    byte[] BuildPatientReport(Patient patient, HealthScoreSnapshot? scoreSnapshot);
}

// Lightweight record passed in instead of the full DTO so the PDF doesn't depend on web layer types.
public record HealthScoreSnapshot(int Total, string BandLabel, string Recommendation, string VitalTimestamp);

public class PatientReportService : IPatientReportService
{
    public PatientReportService()
    {
        // Required by QuestPDF: declare we're using the Community License.
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] BuildPatientReport(Patient patient, HealthScoreSnapshot? snapshot)
    {
        var doc = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(36);
                page.Size(PageSizes.Letter);
                page.DefaultTextStyle(t => t.FontSize(10).FontFamily("Helvetica"));

                page.Header().Element(h => ComposeHeader(h, patient));
                page.Content().PaddingVertical(10).Element(c => ComposeContent(c, patient, snapshot));
                page.Footer().AlignCenter().Text(t =>
                {
                    t.Span("Generated ").FontSize(8).FontColor(Colors.Grey.Medium);
                    t.Span($"{DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC").FontSize(8).FontColor(Colors.Grey.Medium);
                    t.Span(" — Page ").FontSize(8).FontColor(Colors.Grey.Medium);
                    t.CurrentPageNumber().FontSize(8).FontColor(Colors.Grey.Medium);
                    t.Span(" of ").FontSize(8).FontColor(Colors.Grey.Medium);
                    t.TotalPages().FontSize(8).FontColor(Colors.Grey.Medium);
                });
            });
        });

        return doc.GeneratePdf();
    }

    // Title bar at the top of every page.
    private static void ComposeHeader(IContainer container, Patient patient)
    {
        container.PaddingBottom(8).BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
            .Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Patient Chart Report").FontSize(16).Bold().FontColor(Colors.Blue.Darken3);
                    col.Item().Text($"{patient.Name}  ·  {patient.Age} yrs  ·  {patient.Gender}")
                        .FontSize(10).FontColor(Colors.Grey.Darken1);
                });
                row.ConstantItem(120).AlignRight().Text(t =>
                {
                    t.Span("Status: ").FontSize(9).FontColor(Colors.Grey.Medium);
                    t.Span(patient.Status).FontSize(9).Bold();
                });
            });
    }

    private static void ComposeContent(IContainer container, Patient patient, HealthScoreSnapshot? snapshot)
    {
        container.Column(col =>
        {
            col.Spacing(12);

            // NEWS2 risk score card (only if a score is available).
            if (snapshot is not null)
            {
                col.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Row(row =>
                {
                    row.ConstantItem(80).Background(BandColor(snapshot.BandLabel)).Padding(8).AlignCenter()
                        .Column(c =>
                        {
                            c.Item().AlignCenter().Text(snapshot.Total.ToString()).FontSize(28).Bold().FontColor(Colors.White);
                            c.Item().AlignCenter().Text(snapshot.BandLabel).FontSize(8).FontColor(Colors.White);
                        });
                    row.RelativeItem().PaddingLeft(10).Column(c =>
                    {
                        c.Item().Text("NEWS2 health score").FontSize(11).Bold();
                        c.Item().Text(snapshot.Recommendation).FontSize(9).FontColor(Colors.Grey.Darken2);
                        c.Item().Text($"Based on vitals recorded at {snapshot.VitalTimestamp}")
                            .FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                });
            }

            Section(col, "Demographics", inner =>
            {
                inner.Item().Row(r =>
                {
                    r.RelativeItem().Column(c =>
                    {
                        Field(c, "Patient ID", patient.Id.ToString());
                        Field(c, "Primary condition", patient.Condition);
                        Field(c, "Last visit", patient.LastVisit.ToString("yyyy-MM-dd"));
                    });
                    r.RelativeItem().Column(c =>
                    {
                        Field(c, "Phone", patient.ContactPhone);
                        Field(c, "Email", patient.ContactEmail);
                        Field(c, "Address", patient.ContactAddress);
                    });
                });
            });

            // Recent vitals (most recent 5).
            var recentVitals = patient.Vitals.OrderByDescending(v => v.Timestamp).Take(5).ToList();
            if (recentVitals.Count > 0)
            {
                Section(col, "Recent vitals", inner =>
                {
                    inner.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn();
                            c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn();
                        });
                        TableHeader(table, "When", "HR", "BP", "Temp", "SpO₂", "Resp");
                        foreach (var v in recentVitals)
                        {
                            TableCell(table, v.Timestamp.ToString("yyyy-MM-dd HH:mm"));
                            TableCell(table, $"{v.HeartRate}");
                            TableCell(table, $"{v.BloodPressureSystemic}/{v.BloodPressureDiastolic}");
                            TableCell(table, $"{v.Temperature:0.0}°F");
                            TableCell(table, $"{v.OxygenSaturation}%");
                            TableCell(table, $"{v.RespiratoryRate}");
                        }
                    });
                });
            }

            // Active medications only (current treatment plan).
            var activeMeds = patient.Medications.Where(m => m.Status == "Active").ToList();
            if (activeMeds.Count > 0)
            {
                Section(col, "Active medications", inner =>
                {
                    inner.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn(2);
                        });
                        TableHeader(table, "Name", "Dosage", "Frequency", "Prescribed by");
                        foreach (var m in activeMeds)
                        {
                            TableCell(table, m.Name);
                            TableCell(table, m.Dosage);
                            TableCell(table, m.Frequency);
                            TableCell(table, m.PrescribedBy);
                        }
                    });
                });
            }

            // Active conditions.
            var activeConds = patient.MedicalHistory.Where(c => c.Status == "Active" || c.Status == "Chronic").ToList();
            if (activeConds.Count > 0)
            {
                Section(col, "Conditions", inner =>
                {
                    inner.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn();
                        });
                        TableHeader(table, "Condition", "Severity", "Status", "Diagnosed");
                        foreach (var c in activeConds)
                        {
                            TableCell(table, c.Condition);
                            TableCell(table, c.Severity);
                            TableCell(table, c.Status);
                            TableCell(table, c.DiagnosedDate.ToString("yyyy-MM-dd"));
                        }
                    });
                });
            }

            if (!string.IsNullOrWhiteSpace(patient.TreatmentNotes))
            {
                Section(col, "Treatment notes", inner =>
                {
                    inner.Item().Text(patient.TreatmentNotes).FontSize(10);
                });
            }
        });
    }

    // Utility: render a titled section with a thin separator.
    private static void Section(ColumnDescriptor parent, string title, Action<ColumnDescriptor> body)
    {
        parent.Item().Column(col =>
        {
            col.Spacing(4);
            col.Item().Text(title).FontSize(11).Bold().FontColor(Colors.Blue.Darken2);
            col.Item().LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);
            body(col);
        });
    }

    private static void Field(ColumnDescriptor col, string label, string value)
    {
        col.Item().PaddingVertical(1).Row(row =>
        {
            row.ConstantItem(110).Text(label).FontSize(9).FontColor(Colors.Grey.Medium);
            row.RelativeItem().Text(string.IsNullOrEmpty(value) ? "—" : value).FontSize(10);
        });
    }

    private static void TableHeader(TableDescriptor table, params string[] cells)
    {
        table.Header(header =>
        {
            foreach (var cell in cells)
            {
                header.Cell().Background(Colors.Grey.Lighten4).Padding(4)
                    .Text(cell).FontSize(9).Bold().FontColor(Colors.Grey.Darken2);
            }
        });
    }

    private static void TableCell(TableDescriptor table, string value)
    {
        table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten3).Padding(4)
            .Text(value).FontSize(9);
    }

    // Map our risk band labels to a colored block.
    private static string BandColor(string bandLabel) => bandLabel switch
    {
        "High risk" => Colors.Red.Darken2,
        "Medium risk" => Colors.Orange.Darken2,
        "Low-medium risk" => Colors.Yellow.Darken3,
        _ => Colors.Green.Darken2,
    };
}
