with silver as (
    select * from {{ ref('silver_reservations') }}
),
summary as (
    select
        property_id,
        channel,
        count(*) filter (where status <> 'cancelled') as reservations,
        sum(realized_revenue) as revenue,
        avg(stay_length_nights) as avg_stay_length,
        sum(case when status = 'completed' then 1 else 0 end) as completed_reservations
    from silver
    group by property_id, channel
)

select
    property_id,
    channel,
    reservations,
    completed_reservations,
    revenue,
    avg_stay_length,
    case
        when reservations = 0 then 0
        else completed_reservations::double precision / reservations
    end as conversion_rate,
    current_timestamp as updated_at
from summary
