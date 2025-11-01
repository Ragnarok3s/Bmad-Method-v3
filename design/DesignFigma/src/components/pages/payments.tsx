import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

function KPICard({ title, value, icon: Icon, subtitle }: { title: string; value: string; icon: React.ElementType; subtitle?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function PaymentsPage() {
  const payments = [
    { id: 'PAY-1234', guest: 'John Smith', booking: 'BK-1234', amount: '$750', method: 'Credit Card', status: 'completed', date: 'Nov 1, 2025' },
    { id: 'PAY-1235', guest: 'Sarah Johnson', booking: 'AB-5678', amount: '$960', method: 'PayPal', status: 'completed', date: 'Nov 1, 2025' },
    { id: 'PAY-1236', guest: 'Mike Brown', booking: 'DR-9012', amount: '$420', method: 'Bank Transfer', status: 'pending', date: 'Nov 2, 2025' },
    { id: 'PAY-1237', guest: 'Emily Davis', booking: 'EX-3456', amount: '$295', method: 'Credit Card', status: 'completed', date: 'Nov 2, 2025' },
    { id: 'PAY-1238', guest: 'James Wilson', booking: 'BK-7890', amount: '$620', method: 'Credit Card', status: 'pending', date: 'Nov 3, 2025' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Payments</h1>
        <p className="text-muted-foreground">Track and manage property payments</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value="$24,580"
          icon={DollarSign}
          subtitle="This month"
        />
        <KPICard
          title="Pending Payments"
          value="$1,540"
          icon={Clock}
          subtitle="3 payments"
        />
        <KPICard
          title="Completed"
          value="$23,040"
          icon={CheckCircle}
          subtitle="18 payments"
        />
        <KPICard
          title="Growth"
          value="+12.5%"
          icon={TrendingUp}
          subtitle="vs last month"
        />
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.guest}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.booking}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Credit Card</span>
              <span className="text-muted-foreground">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>PayPal</span>
              <span className="text-muted-foreground">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Bank Transfer</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cash</span>
              <span className="text-muted-foreground">5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
              <div>
                <p className="text-sm">Due Today</p>
                <p className="text-xs text-muted-foreground">3 payments</p>
              </div>
              <span>$1,240</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
              <div>
                <p className="text-sm">Due This Week</p>
                <p className="text-xs text-muted-foreground">7 payments</p>
              </div>
              <span>$3,580</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
              <div>
                <p className="text-sm">Due This Month</p>
                <p className="text-xs text-muted-foreground">15 payments</p>
              </div>
              <span>$8,920</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
