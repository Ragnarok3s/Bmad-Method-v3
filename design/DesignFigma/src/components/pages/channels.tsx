import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, ExternalLink, Settings } from 'lucide-react';

export function ChannelsPage() {
  const channels = [
    {
      id: 'booking',
      name: 'Booking.com',
      status: 'connected',
      reservations: 45,
      revenue: '$12,450',
      color: '#003580'
    },
    {
      id: 'airbnb',
      name: 'Airbnb',
      status: 'connected',
      reservations: 38,
      revenue: '$9,870',
      color: '#FF5A5F'
    },
    {
      id: 'expedia',
      name: 'Expedia',
      status: 'connected',
      reservations: 22,
      revenue: '$6,540',
      color: '#FFCB05'
    },
    {
      id: 'direct',
      name: 'Direct Bookings',
      status: 'active',
      reservations: 15,
      revenue: '$5,200',
      color: '#2563EB'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Channels</h1>
          <p className="text-muted-foreground">Manage your distribution channels and integrations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{channel.name}</CardTitle>
              <Badge variant={channel.status === 'connected' ? 'default' : 'secondary'}>
                {channel.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reservations</span>
                  <span className="text-sm">{channel.reservations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="text-sm">{channel.revenue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Channel Management */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: channel.color }}
                >
                  <span className="text-white text-xs font-semibold">
                    {channel.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{channel.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="inline-block">{channel.reservations} active reservations</span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="inline-block sm:inline">{channel.revenue} this month</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-8 sm:w-8 shrink-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Available Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['VRBO', 'Hotels.com', 'TripAdvisor'].map((channel) => (
              <div
                key={channel}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium">{channel}</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
