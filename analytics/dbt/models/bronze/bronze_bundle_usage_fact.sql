{{ config(materialized='view') }}

select
    bundle_id,
    bundle_type,
    workspace_slug,
    period_start,
    granularity,
    view_count,
    launch_count,
    lead_time_samples,
    lead_time_p50_seconds,
    lead_time_p90_seconds,
    last_event_at
from {{ source('core_analytics', 'bundle_usage_fact') }}
