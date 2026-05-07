-- =============================================================================
-- Index health diagnostics (SQL Server)
-- =============================================================================
-- Run periodically (weekly is plenty for a workload this size) to find
-- fragmented or unused indexes. Output is informational; do not auto-rebuild.
-- =============================================================================

-- 1. Fragmentation --- rebuild > 30 %, reorganise 10–30 %, ignore < 10 %
SELECT
    OBJECT_SCHEMA_NAME(ips.object_id)   AS schema_name,
    OBJECT_NAME(ips.object_id)          AS table_name,
    i.name                              AS index_name,
    ips.index_type_desc,
    ROUND(ips.avg_fragmentation_in_percent, 1) AS frag_pct,
    ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') AS ips
JOIN sys.indexes AS i
  ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.page_count > 100              -- ignore tiny indexes
  AND i.name IS NOT NULL
ORDER BY ips.avg_fragmentation_in_percent DESC;

-- 2. Unused indexes --- writes happening but no reads since service start.
--    Drop candidates in non-prod first; some indexes only fire under specific
--    queries (e.g. month-end reports) that may not have run yet.
SELECT
    OBJECT_SCHEMA_NAME(s.object_id) AS schema_name,
    OBJECT_NAME(s.object_id)        AS table_name,
    i.name                          AS index_name,
    s.user_seeks, s.user_scans, s.user_lookups,
    s.user_updates
FROM sys.dm_db_index_usage_stats AS s
JOIN sys.indexes AS i
  ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE s.database_id = DB_ID()
  AND OBJECTPROPERTY(s.object_id, 'IsUserTable') = 1
  AND i.is_primary_key = 0
  AND i.is_unique_constraint = 0
  AND s.user_seeks + s.user_scans + s.user_lookups = 0
  AND s.user_updates > 0
ORDER BY s.user_updates DESC;

-- 3. Missing-index recommendations from the optimiser. Treat as hints, not
--    orders --- create only if the suggested index covers a real workload.
SELECT TOP 25
    ROUND(s.avg_total_user_cost * s.avg_user_impact * (s.user_seeks + s.user_scans), 0)
        AS estimated_benefit,
    d.statement                     AS table_name,
    d.equality_columns,
    d.inequality_columns,
    d.included_columns,
    s.user_seeks, s.user_scans
FROM sys.dm_db_missing_index_groups AS g
JOIN sys.dm_db_missing_index_group_stats AS s ON g.index_group_handle = s.group_handle
JOIN sys.dm_db_missing_index_details AS d   ON g.index_handle = d.index_handle
WHERE d.database_id = DB_ID()
ORDER BY estimated_benefit DESC;

-- 4. Rebuild a single index (only run after reviewing fragmentation output)
-- ALTER INDEX [IX_Vitals_PatientId_Timestamp] ON [Vitals] REBUILD WITH (ONLINE = ON);
