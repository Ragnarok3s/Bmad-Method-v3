import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ReservationBar } from '../reservation-bar';
import { ReservationTile } from '../reservation-tile';
import { ChevronLeft, ChevronRight, Grid3x3, List, SlidersHorizontal, Keyboard } from 'lucide-react';
import { useKeyboardShortcuts, KeyboardNavigationPatterns } from '../use-keyboard-navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';

type CalendarView = 'timeline' | 'grid';

interface Room {
  id: string;
  number: string;
  status: 'clean' | 'dirty' | 'maintenance';
}

export function CalendarPage() {
  const [view, setView] = useState<CalendarView>('timeline');
  const [dateRange, setDateRange] = useState('7d');
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Keyboard shortcuts for calendar navigation
  useKeyboardShortcuts([
    {
      key: 'ArrowLeft',
      action: () => setCurrentDayIndex(prev => Math.max(0, prev - 1)),
      description: 'Previous day',
    },
    {
      key: 'ArrowRight',
      action: () => setCurrentDayIndex(prev => Math.min(6, prev + 1)),
      description: 'Next day',
    },
    {
      key: '?',
      shiftKey: true,
      action: () => setShowKeyboardHelp(prev => !prev),
      description: 'Show keyboard shortcuts',
    },
    KeyboardNavigationPatterns.closeOnEscape(() => setSelectedReservation(null)),
  ], !showKeyboardHelp);

  const rooms: Room[] = [
    { id: '1', number: '101', status: 'clean' },
    { id: '2', number: '102', status: 'clean' },
    { id: '3', number: '103', status: 'dirty' },
    { id: '4', number: '104', status: 'clean' },
    { id: '5', number: '201', status: 'clean' },
    { id: '6', number: '202', status: 'maintenance' },
    { id: '7', number: '203', status: 'clean' },
    { id: '8', number: '204', status: 'dirty' },
  ];

  const days = ['Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7'];

  const statusBadges = [
    { status: 'confirmed', count: 12 },
    { status: 'pending', count: 3 },
    { status: 'checked-in', count: 8 },
    { status: 'overbooked', count: 1 },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-surface border-b border-border p-3 sm:p-4">
        {/* Main Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="shrink-0">Calendar</h2>
          
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {/* Date Navigation */}
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs sm:text-sm px-1 sm:px-2 whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
              <span className="hidden sm:inline">Nov 1 - Nov 7, 2025</span>
              <span className="sm:hidden">Nov 1-7</span>
            </span>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* View Toggle */}
            <Separator orientation="vertical" className="h-6 mx-0.5 sm:mx-1 hidden xs:block" />
            <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as CalendarView)} className="shrink-0">
              <ToggleGroupItem value="timeline" className="h-9 px-2 sm:px-3" aria-label="Timeline view">
                <List className="h-4 w-4" />
                <span className="hidden lg:inline ml-1.5">Timeline</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" className="h-9 px-2 sm:px-3" aria-label="Grid view">
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden lg:inline ml-1.5">Grid</span>
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Filters Button */}
            <Separator orientation="vertical" className="h-6 mx-0.5 sm:mx-1 hidden xs:block" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1 sm:gap-1.5 shrink-0 px-2 sm:px-3">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Calendar Filters</SheetTitle>
                  <SheetDescription>
                    Customize your calendar view by selecting property, date range, density, and reservation status filters.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6 px-4 pb-6">
                  {/* Property Selector */}
                  <div className="space-y-2">
                    <label className="text-sm">Property</label>
                    <Select defaultValue="property-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property-1">Main Property</SelectItem>
                        <SelectItem value="property-2">Beach House</SelectItem>
                        <SelectItem value="property-3">Mountain Lodge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm">Date Range</label>
                    <ToggleGroup type="single" value={dateRange} onValueChange={setDateRange} className="grid grid-cols-2 gap-2">
                      <ToggleGroupItem value="7d" className="w-full">7 days</ToggleGroupItem>
                      <ToggleGroupItem value="14d" className="w-full">14 days</ToggleGroupItem>
                      <ToggleGroupItem value="30d" className="w-full">30 days</ToggleGroupItem>
                      <ToggleGroupItem value="month" className="w-full">Month</ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <Separator />

                  {/* Density */}
                  <div className="space-y-2">
                    <label className="text-sm">Display Density</label>
                    <ToggleGroup type="single" value={density} onValueChange={(v) => v && setDensity(v as any)} className="grid grid-cols-2 gap-2">
                      <ToggleGroupItem value="compact" className="w-full">
                        <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                        Compact
                      </ToggleGroupItem>
                      <ToggleGroupItem value="comfortable" className="w-full">
                        <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                        Comfortable
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <Separator />

                  {/* Status Filters */}
                  <div className="space-y-3">
                    <label className="text-sm">Reservation Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusBadges.map((item) => (
                        <Badge 
                          key={item.status} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent justify-center py-2"
                        >
                          {item.status} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Keyboard Shortcuts */}
                  <div className="space-y-2">
                    <label className="text-sm">Keyboard Shortcuts</label>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => setShowKeyboardHelp(true)}
                    >
                      <Keyboard className="h-4 w-4" />
                      View all shortcuts
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto p-6">
        {view === 'timeline' ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 border-b border-border bg-surface-2">
                    <div className="p-3 border-r border-border">
                      <span className="text-sm">Date</span>
                    </div>
                    {days.map((day, i) => (
                      <div key={i} className="p-3 text-center border-r border-border last:border-r-0">
                        <span className="text-sm">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reservation Rows */}
                  <div className="divide-y divide-border">
                    <div className="grid grid-cols-8 min-h-[80px]">
                      <div className="p-3 border-r border-border flex items-center">
                        <span className="text-sm text-muted-foreground">Room 101</span>
                      </div>
                      <div className="p-2 border-r border-border" onClick={() => setSelectedReservation('1')}>
                        <ReservationBar 
                          status="confirmed" 
                          density={density}
                          guestName="John Smith"
                          channel="Booking.com"
                          bookingId="#BK-1234"
                          price={250}
                        />
                      </div>
                      <div className="p-2 border-r border-border col-span-2" onClick={() => setSelectedReservation('2')}>
                        <ReservationBar 
                          status="checked-in" 
                          density={density}
                          guestName="Sarah Johnson"
                          channel="Airbnb"
                          bookingId="#AB-5678"
                          price={320}
                        />
                      </div>
                      <div className="border-r border-border col-span-4" />
                    </div>

                    <div className="grid grid-cols-8 min-h-[80px]">
                      <div className="p-3 border-r border-border flex items-center">
                        <span className="text-sm text-muted-foreground">Room 102</span>
                      </div>
                      <div className="border-r border-border" />
                      <div className="p-2 border-r border-border col-span-3" onClick={() => setSelectedReservation('3')}>
                        <ReservationBar 
                          status="pending" 
                          density={density}
                          guestName="Mike Brown"
                          channel="Direct"
                          bookingId="#DR-9012"
                          price={280}
                        />
                      </div>
                      <div className="border-r border-border col-span-3" />
                    </div>

                    <div className="grid grid-cols-8 min-h-[80px]">
                      <div className="p-3 border-r border-border flex items-center">
                        <span className="text-sm text-muted-foreground">Room 103</span>
                      </div>
                      <div className="border-r border-border col-span-2" />
                      <div className="p-2 border-r border-border col-span-2" onClick={() => setSelectedReservation('4')}>
                        <ReservationBar 
                          status="overbooked" 
                          density={density}
                          guestName="Emily Davis"
                          channel="Expedia"
                          bookingId="#EX-3456"
                          price={295}
                        />
                      </div>
                      <div className="border-r border-border col-span-3" />
                    </div>

                    <div className="grid grid-cols-8 min-h-[80px]">
                      <div className="p-3 border-r border-border flex items-center">
                        <span className="text-sm text-muted-foreground">Room 104</span>
                      </div>
                      <div className="p-2 border-r border-border col-span-4" onClick={() => setSelectedReservation('5')}>
                        <ReservationBar 
                          status="confirmed" 
                          density={density}
                          guestName="James Wilson"
                          channel="Booking.com"
                          bookingId="#BK-7890"
                          price={310}
                        />
                      </div>
                      <div className="border-r border-border col-span-3" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 border-b border-border bg-surface-2">
                    <div className="p-3 border-r border-border">
                      <span className="text-sm">Room</span>
                    </div>
                    {days.map((day, i) => (
                      <div key={i} className="p-3 text-center border-r border-border last:border-r-0">
                        <div className="text-sm">{day}</div>
                      </div>
                    ))}
                  </div>

                  {/* Room Grid */}
                  {rooms.map((room) => (
                    <div key={room.id} className="grid grid-cols-8 border-b border-border last:border-b-0">
                      <div className="p-3 border-r border-border flex items-center justify-between">
                        <span className="text-sm">{room.number}</span>
                        <Badge 
                          variant={room.status === 'clean' ? 'default' : room.status === 'dirty' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {room.status}
                        </Badge>
                      </div>
                      {days.map((_, dayIndex) => (
                        <div key={dayIndex} className="p-2 border-r border-border last:border-r-0 min-h-[72px]">
                          {room.id === '1' && dayIndex === 1 && (
                            <div onClick={() => setSelectedReservation('g1')}>
                              <ReservationTile 
                                status="confirmed" 
                                density={density}
                                guestName="J. Smith"
                                bookingId="#1234"
                                price={250}
                              />
                            </div>
                          )}
                          {room.id === '3' && dayIndex === 2 && (
                            <div onClick={() => setSelectedReservation('g2')}>
                              <ReservationTile 
                                status="pending" 
                                density={density}
                                guestName="M. Brown"
                                bookingId="#9012"
                                price={280}
                              />
                            </div>
                          )}
                          {room.id === '5' && dayIndex === 0 && (
                            <div onClick={() => setSelectedReservation('g3')}>
                              <ReservationTile 
                                status="checked-in" 
                                density={density}
                                guestName="S. Johnson"
                                bookingId="#5678"
                                price={320}
                              />
                            </div>
                          )}
                          {room.id === '7' && dayIndex === 4 && (
                            <div onClick={() => setSelectedReservation('g4')}>
                              <ReservationTile 
                                status="overbooked" 
                                density={density}
                                guestName="E. Davis"
                                bookingId="#3456"
                                price={295}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reservation Details Side Panel */}
      <Sheet open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
        <SheetContent className="w-[480px] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>John Smith</SheetTitle>
                <p className="text-sm text-muted-foreground">#BK-1234</p>
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
              <TabsTrigger value="guests" className="text-xs">Guests</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge>Confirmed</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check-in</span>
                  <span className="text-sm">Nov 2, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check-out</span>
                  <span className="text-sm">Nov 5, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nights</span>
                  <span className="text-sm">3</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Room</span>
                  <span className="text-sm">101</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Guests</span>
                  <span className="text-sm">2 adults</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Channel</span>
                  <span className="text-sm">Booking.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-sm">$750.00</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
                  <div>
                    <p className="text-sm">Deposit</p>
                    <p className="text-xs text-muted-foreground">Oct 15, 2025</p>
                  </div>
                  <span className="text-sm">$375.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
                  <div>
                    <p className="text-sm">Balance Due</p>
                    <p className="text-xs text-muted-foreground">At check-in</p>
                  </div>
                  <span className="text-sm">$375.00</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guests" className="mt-4">
              <div className="space-y-3">
                <div className="p-3 bg-surface-2 rounded-lg">
                  <p className="text-sm">John Smith</p>
                  <p className="text-xs text-muted-foreground">john.smith@email.com</p>
                  <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div className="p-3 bg-surface-2 rounded-lg">
                  <p className="text-sm">Jane Smith</p>
                  <p className="text-xs text-muted-foreground">Guest 2</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="space-y-3">
                <div className="p-3 bg-surface-2 rounded-lg">
                  <p className="text-sm">Late check-in requested (8 PM)</p>
                  <p className="text-xs text-muted-foreground">Oct 20, 2025 by Admin</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-sm">Reservation confirmed</p>
                    <p className="text-xs text-muted-foreground">Oct 15, 2025 3:24 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted mt-1.5" />
                  <div>
                    <p className="text-sm">Reservation created</p>
                    <p className="text-xs text-muted-foreground">Oct 15, 2025 3:20 PM</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="space-y-2">
            <Button className="w-full">Assign Room</Button>
            <Button variant="outline" className="w-full">Check-in</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
