import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, ClipboardCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  suffix?: string;
}

function KPICard({ title, value, change, icon: Icon, suffix }: KPICardProps) {
  const isPositive = change && change > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl">{value}</span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-danger" />
            )}
            <span className={`text-xs ${isPositive ? 'text-success' : 'text-danger'}`}>
              {Math.abs(change)}% vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const upcomingReservations = [
    { id: 'BK-1234', guest: 'John Smith', checkIn: '2025-11-02', room: '101', status: 'confirmed' },
    { id: 'BK-1235', guest: 'Sarah Johnson', checkIn: '2025-11-02', room: '203', status: 'pending' },
    { id: 'BK-1236', guest: 'Mike Brown', checkIn: '2025-11-03', room: '105', status: 'confirmed' },
    { id: 'BK-1237', guest: 'Emily Davis', checkIn: '2025-11-03', room: '301', status: 'confirmed' },
    { id: 'BK-1238', guest: 'James Wilson', checkIn: '2025-11-04', room: '207', status: 'pending' },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">Overview of your property performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <KPICard
          title="Occupancy Rate"
          value="87.5"
          suffix="%"
          change={5.2}
          icon={Calendar}
        />
        <KPICard
          title="RevPAR"
          value="$145"
          change={8.3}
          icon={DollarSign}
        />
        <KPICard
          title="ADR"
          value="$185"
          change={3.1}
          icon={DollarSign}
        />
        <KPICard
          title="Today's Arrivals"
          value="12"
          icon={Calendar}
        />
        <KPICard
          title="Active Alerts"
          value="3"
          icon={AlertCircle}
        />
        <KPICard
          title="Pending Tasks"
          value="8"
          icon={ClipboardCheck}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingReservations.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell>{res.guest}</TableCell>
                      <TableCell className="text-muted-foreground">{res.id}</TableCell>
                      <TableCell>{res.room}</TableCell>
                      <TableCell>
                        <Badge variant={res.status === 'confirmed' ? 'default' : 'secondary'}>
                          {res.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {upcomingReservations.map((res) => (
                <div key={res.id} className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{res.guest}</p>
                      <p className="text-sm text-muted-foreground">{res.id}</p>
                    </div>
                    <Badge variant={res.status === 'confirmed' ? 'default' : 'secondary'} className="shrink-0">
                      {res.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Room {res.room}</span>
                    <span>•</span>
                    <span>{res.checkIn}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Housekeeping Status */}
        <Card>
          <CardHeader>
            <CardTitle>Housekeeping Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Clean Rooms</span>
                <span className="text-success">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dirty Rooms</span>
                <span className="text-warning">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>In Progress</span>
                <span className="text-info">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Out of Order</span>
                <span className="text-danger">2</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span>Total Rooms</span>
                  <span>28</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
