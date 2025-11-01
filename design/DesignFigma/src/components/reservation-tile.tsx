import React from 'react';
import { Badge } from './ui/badge';
import { GripVertical } from 'lucide-react';
import { ReservationStatus, Density } from './reservation-bar';

interface ReservationTileProps {
  status: ReservationStatus;
  density?: Density;
  withIcons?: boolean;
  guestName?: string;
  bookingId?: string;
  price?: number;
  className?: string;
  width?: number;
}

const statusConfig: Record<ReservationStatus, { bg: string; border: string; text: string }> = {
  confirmed: {
    bg: 'bg-[#2563EB]/10 dark:bg-[#2563EB]/20',
    border: 'border-[#2563EB]/30',
    text: 'text-[#2563EB]',
  },
  pending: {
    bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
    border: 'border-[#F59E0B]/30',
    text: 'text-[#F59E0B]',
  },
  'checked-in': {
    bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/20',
    border: 'border-[#10B981]/30',
    text: 'text-[#10B981]',
  },
  overbooked: {
    bg: 'bg-[#EF4444]/10 dark:bg-[#F43F5E]/20',
    border: 'border-[#EF4444]/30 dark:border-[#F43F5E]/30',
    text: 'text-[#EF4444] dark:text-[#F43F5E]',
  },
  maintenance: {
    bg: 'bg-[#6B7280]/10 dark:bg-[#6B7280]/20',
    border: 'border-[#6B7280]/30',
    text: 'text-[#6B7280]',
  },
  none: {
    bg: 'bg-transparent',
    border: 'border-border',
    text: 'text-muted-foreground',
  }
};

export function ReservationTile({
  status,
  density = 'comfortable',
  withIcons = true,
  guestName = 'Guest Name',
  bookingId = '#12345',
  price = 250,
  className = '',
  width
}: ReservationTileProps) {
  const config = statusConfig[status];
  const isCompact = density === 'compact';
  const heightClass = isCompact ? 'h-11 min-h-[44px]' : 'h-14 min-h-[56px]';
  
  if (status === 'none') {
    return null;
  }

  return (
    <div 
      className={`${heightClass} rounded-lg border ${config.border} ${config.bg} px-2.5 py-2 relative overflow-hidden cursor-move hover:shadow-md transition-all group ${className}`}
      style={width ? { width: `${width}px` } : undefined}
    >
      {status === 'overbooked' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #EF4444 0, #EF4444 1px, transparent 1px, transparent 8px)',
            opacity: 0.08,
          }}
        />
      )}
      
      <div className="relative h-full flex items-center gap-1.5">
        {withIcons && (
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
        
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className={`truncate ${isCompact ? 'text-sm' : ''}`}>{guestName}</span>
              {status === 'overbooked' && (
                <Badge variant="destructive" className="h-4 px-1 text-[10px]">!</Badge>
              )}
            </div>
            {!isCompact && (
              <div className="text-xs text-muted-foreground truncate">
                {bookingId}
              </div>
            )}
          </div>
          
          <span className={`${isCompact ? 'text-xs' : 'text-sm'} shrink-0`}>
            ${price}
          </span>
        </div>
      </div>
    </div>
  );
}
