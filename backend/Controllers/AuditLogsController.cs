using MedicalDashboard.Api.Data;
using MedicalDashboard.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicalDashboard.Api.Controllers;

// Read-only access to audit log entries. Admin-only — sensitive data.
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/audit-logs")]
public class AuditLogsController : ControllerBase
{
    private readonly MedicalContext _context;

    public AuditLogsController(MedicalContext context)
    {
        _context = context;
    }

    // GET: api/audit-logs?resource=patients&userId=&page=1&pageSize=50
    // Returns most-recent first, paginated.
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<AuditLogDto>>> GetLogs(
        [FromQuery] string? resource,
        [FromQuery] int? userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _context.AuditLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(resource))
            query = query.Where(a => a.Resource == resource.ToLower());

        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        query = query.OrderByDescending(a => a.Timestamp);

        var total = await query.CountAsync();
        var rows = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResultDto<AuditLogDto>
        {
            Items = rows.Select(a => new AuditLogDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserEmail = a.UserEmail,
                UserRole = a.UserRole,
                Method = a.Method,
                Path = a.Path,
                Resource = a.Resource,
                ResourceId = a.ResourceId,
                StatusCode = a.StatusCode,
                IpAddress = a.IpAddress,
                UserAgent = a.UserAgent,
                Timestamp = a.Timestamp.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            Total = total,
        });
    }
}
