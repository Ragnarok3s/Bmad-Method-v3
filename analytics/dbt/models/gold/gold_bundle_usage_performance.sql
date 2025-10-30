{{ config(materialized='view') }}

with base as (
    select * from {{ ref('silver_bundle_usage') }}
)

select
    workspace_slug,
    bundle_id,
    bundle_type,
    granularity,
    min(period_start) as window_start,
    max(period_start) as window_end,
    sum(view_count) as total_views,
    sum(launch_count) as total_launches,
    case when sum(view_count) > 0 then (sum(launch_count) * 1.0) / sum(view_count) else 0 end as conversion_rate,
    avg(lead_time_p50_seconds) as avg_lead_time_p50_seconds,
    avg(lead_time_p90_seconds) as avg_lead_time_p90_seconds
from base
group by workspace_slug, bundle_id, bundle_type, granularity
