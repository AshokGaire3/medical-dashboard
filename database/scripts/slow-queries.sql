-- =============================================================================
-- Slow query / hot query diagnostics (SQL Server)
-- =============================================================================
-- Use when an endpoint is slow and you suspect database time. These DMVs
-- accumulate stats since the SQL Server instance last started, so absolute
-- numbers depend on uptime --- compare relatively, not absolutely.
-- =============================================================================

-- 1. Top 25 queries by average CPU per execution
SELECT TOP 25
    ROUND(qs.total_worker_time / 1000.0 / qs.execution_count, 2) AS avg_cpu_ms,
    qs.execution_count,
    ROUND(qs.total_logical_reads * 1.0 / qs.execution_count, 0) AS avg_logical_reads,
    qs.last_execution_time,
    SUBSTRING(qt.text,
              qs.statement_start_offset / 2 + 1,
              ((CASE qs.statement_end_offset
                   WHEN -1 THEN DATALENGTH(qt.text)
                   ELSE qs.statement_end_offset
                END - qs.statement_start_offset) / 2) + 1) AS sql_text
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS qt
WHERE qt.dbid = DB_ID()
ORDER BY avg_cpu_ms DESC;

-- 2. Top 10 queries by total executions (hottest)
SELECT TOP 10
    qs.execution_count,
    ROUND(qs.total_elapsed_time / 1000.0 / qs.execution_count, 2) AS avg_elapsed_ms,
    qs.last_execution_time,
    SUBSTRING(qt.text,
              qs.statement_start_offset / 2 + 1,
              ((CASE qs.statement_end_offset
                   WHEN -1 THEN DATALENGTH(qt.text)
                   ELSE qs.statement_end_offset
                END - qs.statement_start_offset) / 2) + 1) AS sql_text
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS qt
WHERE qt.dbid = DB_ID()
ORDER BY qs.execution_count DESC;

-- 3. Currently running queries (live snapshot)
SELECT
    r.session_id, r.status, r.wait_type, r.wait_time, r.cpu_time,
    r.logical_reads, r.reads, r.writes,
    SUBSTRING(t.text,
              r.statement_start_offset / 2 + 1,
              ((CASE r.statement_end_offset
                   WHEN -1 THEN DATALENGTH(t.text)
                   ELSE r.statement_end_offset
                END - r.statement_start_offset) / 2) + 1) AS sql_text
FROM sys.dm_exec_requests AS r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) AS t
WHERE r.session_id <> @@SPID;
