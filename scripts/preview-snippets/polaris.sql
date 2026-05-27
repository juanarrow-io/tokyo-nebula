-- Top variants by activation, last 30 days
SELECT
    v.name,
    COUNT(a.id) AS activations,
    AVG(a.duration_ms) AS avg_ms
FROM variants AS v
LEFT JOIN activations AS a
    ON a.variant_id = v.id
   AND a.created_at >= NOW() - INTERVAL '30 days'
WHERE v.is_published IS TRUE
GROUP BY v.name
HAVING COUNT(a.id) > 0
ORDER BY activations DESC
LIMIT 5;
