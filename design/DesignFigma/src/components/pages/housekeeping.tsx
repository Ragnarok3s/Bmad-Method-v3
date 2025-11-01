import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle, Clock, AlertCircle, Wrench } from 'lucide-react';

function StatusCard({ title, count, icon: Icon, variant }: { title: string; count: number; icon: React.ElementType; variant: 'success' | 'warning' | 'info' | 'danger' }) {
  const colors = {
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    danger: 'text-danger',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colors[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">rooms</p>
      </CardContent>
    </Card>
  );
}

export function HousekeepingPage() {
  const rooms = [
    { number: '101', status: 'clean', priority: 'normal', assignee: 'Maria G.', lastCleaned: '2 hours ago' },
    { number: '102', status: 'dirty', priority: 'high', assignee: 'Unassigned', lastCleaned: '1 day ago' },
    { number: '103', status: 'in-progress', priority: 'normal', assignee: 'John D.', lastCleaned: '30 mins ago' },
    { number: '104', status: 'clean', priority: 'normal', assignee: 'Maria G.', lastCleaned: '3 hours ago' },
    { number: '201', status: 'dirty', priority: 'high', assignee: 'Unassigned', lastCleaned: '2 days ago' },
    { number: '202', status: 'maintenance', priority: 'urgent', assignee: 'Maintenance', lastCleaned: '1 week ago' },
    { number: '203', status: 'clean', priority: 'normal', assignee: 'Sarah M.', lastCleaned: '1 hour ago' },
    { number: '204', status: 'in-progress', priority: 'normal', assignee: 'John D.', lastCleaned: '15 mins ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clean':
        return <Badge className="bg-success/10 text-success border-success/30">Clean</Badge>;
      case 'dirty':
        return <Badge className="bg-warning/10 text-warning border-warning/30">Dirty</Badge>;
      case 'in-progress':
        return <Badge className="bg-info/10 text-info border-info/30">In Progress</Badge>;
      case 'maintenance':
        return <Badge className="bg-danger/10 text-danger border-danger/30">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-warning/10 text-warning border-warning/30">High</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Housekeeping</h1>
        <p className="text-muted-foreground">Manage room cleaning and maintenance tasks</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="Clean Rooms" count={18} icon={CheckCircle} variant="success" />
        <StatusCard title="Dirty Rooms" count={5} icon={AlertCircle} variant="warning" />
        <StatusCard title="In Progress" count={3} icon={Clock} variant="info" />
        <StatusCard title="Out of Order" count={2} icon={Wrench} variant="danger" />
      </div>

      {/* Room Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Room Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <Card key={room.number} className="relative">
                <CardContent className="p-4">
                  {room.priority !== 'normal' && (
                    <div className="absolute top-2 right-2">
                      {getPriorityBadge(room.priority)}
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg">Room {room.number}</h3>
                      <div className="mt-2">
                        {getStatusBadge(room.status)}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assignee</span>
                        <span>{room.assignee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last cleaned</span>
                        <span>{room.lastCleaned}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={room.status === 'clean' || room.status === 'maintenance'}
                    >
                      {room.status === 'dirty' ? 'Start Cleaning' : room.status === 'in-progress' ? 'Mark Complete' : 'View Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Maria G.', 'John D.', 'Sarah M.'].map((staff, index) => (
              <div key={staff} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{staff}</p>
                    <p className="text-sm text-muted-foreground">Housekeeper</p>
                  </div>
                  <Badge variant="outline">{index === 0 ? 3 : index === 1 ? 2 : 3} rooms</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-success">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span>{index === 0 ? '95%' : index === 1 ? '88%' : '92%'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
