import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ReservationBar, ReservationStatus, Density } from '../reservation-bar';
import { ReservationTile } from '../reservation-tile';
import { Badge } from '../ui/badge';

export function QAReservationVariantsPage() {
  const statuses: ReservationStatus[] = ['confirmed', 'pending', 'checked-in', 'overbooked', 'maintenance', 'none'];
  const densities: Density[] = ['compact', 'comfortable'];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1>QA — Reservation Variants</h1>
        <p className="text-muted-foreground">All combinations of reservation components</p>
      </div>

      {/* Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#2563EB]" />
              <span className="text-sm">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#10B981]" />
              <span className="text-sm">Checked In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#EF4444] dark:bg-[#F43F5E]" />
              <span className="text-sm">Overbooked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#6B7280]" />
              <span className="text-sm">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border-2 border-dashed border-border" />
              <span className="text-sm">Available (None)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservation Bar - All Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Bar - All Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {densities.map((density) => (
            <div key={density} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg capitalize">{density} Density</h3>
                <Badge variant="outline">{density === 'compact' ? '≤ 40px' : '56px'}</Badge>
              </div>
              
              {/* With Icons */}
              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">With Icons</h4>
                <div className="grid gap-3">
                  {statuses.map((status) => (
                    <ReservationBar
                      key={`${status}-${density}-icons`}
                      status={status}
                      density={density}
                      withIcons={true}
                      guestName="John Smith"
                      channel="Booking.com"
                      bookingId="#BK-1234"
                      price={250}
                      guests={2}
                      nights={3}
                    />
                  ))}
                </div>
              </div>

              {/* Without Icons */}
              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Without Icons</h4>
                <div className="grid gap-3">
                  {statuses.map((status) => (
                    <ReservationBar
                      key={`${status}-${density}-no-icons`}
                      status={status}
                      density={density}
                      withIcons={false}
                      guestName="John Smith"
                      channel="Booking.com"
                      bookingId="#BK-1234"
                      price={250}
                      guests={2}
                      nights={3}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reservation Tile - All Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Reservation Tile - All Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {densities.map((density) => (
            <div key={density} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg capitalize">{density} Density</h3>
                <Badge variant="outline">{density === 'compact' ? '44px' : '56px'}</Badge>
              </div>
              
              {/* With Icons */}
              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">With Icons</h4>
                <div className="grid grid-cols-2 gap-3">
                  {statuses.filter(s => s !== 'none').map((status) => (
                    <ReservationTile
                      key={`${status}-${density}-icons`}
                      status={status}
                      density={density}
                      withIcons={true}
                      guestName="John Smith"
                      bookingId="#BK-1234"
                      price={250}
                    />
                  ))}
                </div>
              </div>

              {/* Without Icons */}
              <div className="space-y-3">
                <h4 className="text-sm text-muted-foreground">Without Icons</h4>
                <div className="grid grid-cols-2 gap-3">
                  {statuses.filter(s => s !== 'none').map((status) => (
                    <ReservationTile
                      key={`${status}-${density}-no-icons`}
                      status={status}
                      density={density}
                      withIcons={false}
                      guestName="John Smith"
                      bookingId="#BK-1234"
                      price={250}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Color Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Status Color Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Light Mode</th>
                  <th className="text-left p-3">Dark Mode</th>
                  <th className="text-left p-3">Border</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3">Confirmed</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#2563EB]/10 border border-[#2563EB]/30" />
                      <code className="text-xs">#2563EB/10</code>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#2563EB]/20 border border-[#2563EB]/30" />
                      <code className="text-xs">#2563EB/20</code>
                    </div>
                  </td>
                  <td className="p-3"><code className="text-xs">#2563EB/30</code></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3">Pending</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30" />
                      <code className="text-xs">#F59E0B/10</code>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/30" />
                      <code className="text-xs">#F59E0B/20</code>
                    </div>
                  </td>
                  <td className="p-3"><code className="text-xs">#F59E0B/30</code></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3">Checked In</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#10B981]/10 border border-[#10B981]/30" />
                      <code className="text-xs">#10B981/10</code>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#10B981]/20 border border-[#10B981]/30" />
                      <code className="text-xs">#10B981/20</code>
                    </div>
                  </td>
                  <td className="p-3"><code className="text-xs">#10B981/30</code></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3">Overbooked</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#EF4444]/10 border border-[#EF4444]/30" />
                      <code className="text-xs">#EF4444/10</code>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#F43F5E]/20 border border-[#F43F5E]/30" />
                      <code className="text-xs">#F43F5E/20</code>
                    </div>
                  </td>
                  <td className="p-3"><code className="text-xs">#EF4444/#F43F5E 30%</code></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3">Maintenance</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#6B7280]/10 border border-[#6B7280]/30" />
                      <code className="text-xs">#6B7280/10</code>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 rounded bg-[#6B7280]/20 border border-[#6B7280]/30" />
                      <code className="text-xs">#6B7280/20</code>
                    </div>
                  </td>
                  <td className="p-3"><code className="text-xs">#6B7280/30</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
