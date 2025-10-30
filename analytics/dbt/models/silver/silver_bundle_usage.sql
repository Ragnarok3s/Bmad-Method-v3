{{ config(materialized='view') }}

select
    bundle_id,
    bundle_type,
    workspace_slug,
    period_start,
    granularity,
    view_count,
    launch_count,
    case when view_count > 0 then (launch_count * 1.0) / view_count else 0 end as conversion_rate,
    lead_time_p50_seconds,
    lead_time_p90_seconds,
    last_event_at
from {{ ref('bronze_bundle_usage_fact') }}
