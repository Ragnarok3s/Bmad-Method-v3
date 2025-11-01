import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Filter, Download, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const reservations = [
    { id: 'BK-1234', guest: 'John Smith', checkIn: 'Nov 2, 2025', checkOut: 'Nov 5, 2025', room: '101', status: 'confirmed', channel: 'Booking.com', total: '$750' },
    { id: 'AB-5678', guest: 'Sarah Johnson', checkIn: 'Nov 1, 2025', checkOut: 'Nov 4, 2025', room: '203', status: 'checked-in', channel: 'Airbnb', total: '$960' },
    { id: 'DR-9012', guest: 'Mike Brown', checkIn: 'Nov 3, 2025', checkOut: 'Nov 6, 2025', room: '102', status: 'pending', channel: 'Direct', total: '$840' },
    { id: 'EX-3456', guest: 'Emily Davis', checkIn: 'Nov 3, 2025', checkOut: 'Nov 5, 2025', room: '103', status: 'overbooked', channel: 'Expedia', total: '$590' },
    { id: 'BK-7890', guest: 'James Wilson', checkIn: 'Nov 1, 2025', checkOut: 'Nov 5, 2025', room: '104', status: 'confirmed', channel: 'Booking.com', total: '$1240' },
    { id: 'AB-2345', guest: 'Lisa Anderson', checkIn: 'Nov 4, 2025', checkOut: 'Nov 7, 2025', room: '201', status: 'confirmed', channel: 'Airbnb', total: '$900' },
    { id: 'DR-6789', guest: 'Robert Taylor', checkIn: 'Nov 2, 2025', checkOut: 'Nov 4, 2025', room: '202', status: 'pending', channel: 'Direct', total: '$500' },
    { id: 'BK-3456', guest: 'Maria Garcia', checkIn: 'Nov 5, 2025', checkOut: 'Nov 8, 2025', room: '204', status: 'confirmed', channel: 'Booking.com', total: '$1050' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'checked-in':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overbooked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Reservations</h1>
          <p className="text-muted-foreground">Manage all property reservations</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search guest, booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select defaultValue="all-status">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="overbooked">Overbooked</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-channels">
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-channels">All Channels</SelectItem>
                <SelectItem value="booking">Booking.com</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="expedia">Expedia</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-properties">
              <SelectTrigger>
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-properties">All Properties</SelectItem>
                <SelectItem value="property-1">Main Property</SelectItem>
                <SelectItem value="property-2">Beach House</SelectItem>
                <SelectItem value="property-3">Mountain Lodge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <CardTitle>All Reservations</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Filter className="h-4 w-4 mr-2" />
              <span className="sm:inline">Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              <span className="sm:inline">Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id} className="cursor-pointer hover:bg-accent/50">
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>{reservation.guest}</TableCell>
                    <TableCell>{reservation.checkIn}</TableCell>
                    <TableCell>{reservation.checkOut}</TableCell>
                    <TableCell>{reservation.room}</TableCell>
                    <TableCell className="text-muted-foreground">{reservation.channel}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{reservation.total}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{reservation.guest}</p>
                      <p className="text-sm text-muted-foreground">{reservation.id}</p>
                    </div>
                    <Badge variant={getStatusVariant(reservation.status)} className="shrink-0">
                      {reservation.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Check-in:</span>
                      <p>{reservation.checkIn}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Check-out:</span>
                      <p>{reservation.checkOut}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Room {reservation.room}</span>
                      <span>•</span>
                      <span>{reservation.channel}</span>
                    </div>
                    <span className="font-medium">{reservation.total}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
