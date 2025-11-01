import React from 'react';
import { Badge } from './ui/badge';
import { Building2, User, Calendar, DollarSign } from 'lucide-react';

export type ReservationStatus = 'confirmed' | 'pending' | 'checked-in' | 'overbooked' | 'maintenance' | 'none';
export type Density = 'compact' | 'comfortable';

interface ReservationBarProps {
  status: ReservationStatus;
  density?: Density;
  withIcons?: boolean;
  guestName?: string;
  channel?: string;
  bookingId?: string;
  price?: number;
  guests?: number;
  nights?: number;
  className?: string;
}

const statusConfig: Record<ReservationStatus, { bg: string; border: string; text: string; label: string }> = {
  confirmed: {
    bg: 'bg-[#2563EB]/10 dark:bg-[#2563EB]/20',
    border: 'border-[#2563EB]/30',
    text: 'text-[#2563EB]',
    label: 'Confirmed'
  },
  pending: {
    bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
    border: 'border-[#F59E0B]/30',
    text: 'text-[#F59E0B]',
    label: 'Pending'
  },
  'checked-in': {
    bg: 'bg-[#10B981]/10 dark:bg-[#10B981]/20',
    border: 'border-[#10B981]/30',
    text: 'text-[#10B981]',
    label: 'Checked In'
  },
  overbooked: {
    bg: 'bg-[#EF4444]/10 dark:bg-[#F43F5E]/20',
    border: 'border-[#EF4444]/30 dark:border-[#F43F5E]/30',
    text: 'text-[#EF4444] dark:text-[#F43F5E]',
    label: 'Overbooked'
  },
  maintenance: {
    bg: 'bg-[#6B7280]/10 dark:bg-[#6B7280]/20',
    border: 'border-[#6B7280]/30',
    text: 'text-[#6B7280]',
    label: 'Maintenance'
  },
  none: {
    bg: 'bg-transparent',
    border: 'border-border',
    text: 'text-muted-foreground',
    label: 'Available'
  }
};

export function ReservationBar({
  status,
  density = 'comfortable',
  withIcons = true,
  guestName = 'Guest Name',
  channel = 'Booking.com',
  bookingId = '#12345',
  price = 250,
  guests = 2,
  nights = 3,
  className = ''
}: ReservationBarProps) {
  const config = statusConfig[status];
  const isCompact = density === 'compact';
  const heightClass = isCompact ? 'h-10 min-h-[40px]' : 'h-14 min-h-[56px]';
  
  if (status === 'none') {
    return (
      <div className={`${heightClass} rounded-lg border border-dashed ${config.border} ${config.bg} ${className}`} />
    );
  }

  return (
    <div 
      className={`${heightClass} rounded-lg border ${config.border} ${config.bg} px-3 py-2 relative overflow-hidden cursor-pointer hover:shadow-md transition-all ${className}`}
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
      
      <div className="relative h-full flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`truncate ${isCompact ? 'text-sm' : ''}`}>{guestName}</span>
            {status === 'overbooked' && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">Overbooked</Badge>
            )}
          </div>
          {!isCompact && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              {withIcons && <Building2 className="h-3 w-3" />}
              <span>{channel}</span>
              <span>•</span>
              <span>{bookingId}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {withIcons && !isCompact && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{guests}</span>
              <Calendar className="h-3 w-3 ml-1" />
              <span>{nights}n</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            {withIcons && <DollarSign className="h-4 w-4 text-muted-foreground" />}
            <span className={isCompact ? 'text-sm' : ''}>${price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
