with base as (
    select *
    from {{ ref('bronze_reservations') }}
)

select
    reservation_id,
    property_id,
    guest_id,
    status,
    booked_at::timestamp as booked_at,
    check_in,
    check_out,
    revenue,
    channel,
    datediff('day', check_in, check_out) as stay_length_nights,
    case when status = 'completed' then revenue else 0 end as realized_revenue
from base
