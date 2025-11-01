import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';

function StatusCard({ title, count, icon: Icon, variant }: { title: string; count: number; icon: React.ElementType; variant: 'danger' | 'warning' | 'success' }) {
  const colors = {
    danger: 'text-danger',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colors[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">requests</p>
      </CardContent>
    </Card>
  );
}

export function MaintenancePage() {
  const requests = [
    {
      id: 'MNT-001',
      room: '202',
      issue: 'AC not working',
      priority: 'urgent',
      status: 'in-progress',
      assignee: 'Mike T.',
      reported: '2 hours ago',
      category: 'HVAC'
    },
    {
      id: 'MNT-002',
      room: '105',
      issue: 'Leaking faucet',
      priority: 'high',
      status: 'pending',
      assignee: 'Unassigned',
      reported: '5 hours ago',
      category: 'Plumbing'
    },
    {
      id: 'MNT-003',
      room: '301',
      issue: 'Light bulb replacement',
      priority: 'low',
      status: 'pending',
      assignee: 'Unassigned',
      reported: '1 day ago',
      category: 'Electrical'
    },
    {
      id: 'MNT-004',
      room: '108',
      issue: 'Door lock malfunction',
      priority: 'urgent',
      status: 'pending',
      assignee: 'Unassigned',
      reported: '3 hours ago',
      category: 'Security'
    },
    {
      id: 'MNT-005',
      room: '204',
      issue: 'Window won\'t close',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'John K.',
      reported: '6 hours ago',
      category: 'General'
    },
    {
      id: 'MNT-006',
      room: '102',
      issue: 'Shower head clogged',
      priority: 'medium',
      status: 'completed',
      assignee: 'Mike T.',
      reported: '2 days ago',
      category: 'Plumbing'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/30">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-info/10 text-info border-info/30">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/30">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-danger/10 text-danger border-danger/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/30">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1>Maintenance</h1>
          <p className="text-muted-foreground">Track and manage maintenance requests</p>
        </div>
        <Button className="w-full sm:w-auto shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusCard title="Urgent Requests" count={2} icon={AlertCircle} variant="danger" />
        <StatusCard title="Pending" count={3} icon={Clock} variant="warning" />
        <StatusCard title="Completed Today" count={1} icon={CheckCircle} variant="success" />
      </div>

      {/* Active Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Active Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.filter(r => r.status !== 'completed').map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{request.id}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>Room {request.room}</span>
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm">{request.issue}</p>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                        <span>Category: {request.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Assignee: {request.assignee}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Reported: {request.reported}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        {request.status === 'pending' ? 'Assign' : 'Update'}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories & Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>HVAC</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Plumbing</span>
                <Badge variant="outline">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Electrical</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Security</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>General</span>
                <Badge variant="outline">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Staff */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <p className="font-medium">Mike T.</p>
                  <p className="text-sm text-muted-foreground">HVAC Specialist</p>
                </div>
                <Badge variant="outline">2 active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <p className="font-medium">John K.</p>
                  <p className="text-sm text-muted-foreground">General Maintenance</p>
                </div>
                <Badge variant="outline">1 active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <p className="font-medium">Sarah P.</p>
                  <p className="text-sm text-muted-foreground">Electrician</p>
                </div>
                <Badge variant="outline">0 active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completions */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.filter(r => r.status === 'completed').map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.id}</span>
                    <span className="text-muted-foreground">•</span>
                    <span>Room {request.room}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.issue}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
