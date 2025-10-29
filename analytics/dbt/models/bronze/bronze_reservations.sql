with source as (
    select *
    from {{ ref('bronze_reservations_raw') }}
)

select
    reservation_id,
    property_id,
    guest_id,
    status,
    booked_at,
    cast(check_in as date) as check_in,
    cast(check_out as date) as check_out,
    cast(revenue as double precision) as revenue,
    channel
from source
