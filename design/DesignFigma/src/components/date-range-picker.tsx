import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

const presets = [
  { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Last 14 days', getValue: () => ({ from: subDays(new Date(), 13), to: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: 'This month', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'This year', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
];

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  disabled = false,
  disabledDates,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(value);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    onChange?.(newRange);
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    const newRange = preset.getValue();
    handleSelect(newRange);
    setOpen(false);
  };

  const formatRange = (range: DateRange | undefined) => {
    if (!range?.from) {
      return placeholder;
    }
    if (!range.to) {
      return format(range.from, 'MMM dd, yyyy');
    }
    return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left',
            !range && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatRange(range)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets */}
          <div className="border-r border-border">
            <div className="p-3 space-y-1">
              <div className="text-sm text-muted-foreground px-2 py-1.5">Presets</div>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  className="w-full justify-start text-sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={{ from: range?.from, to: range?.to }}
              onSelect={handleSelect as any}
              disabled={disabledDates}
              numberOfMonths={2}
              className="rounded-md"
            />
            <div className="text-xs text-muted-foreground px-2 pt-2 border-t border-border mt-2">
              Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
