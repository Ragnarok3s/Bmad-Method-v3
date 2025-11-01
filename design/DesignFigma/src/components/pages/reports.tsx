import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function ReportsPage() {
  // Revenue data
  const revenueData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 19200 },
    { month: 'Mar', revenue: 21400 },
    { month: 'Apr', revenue: 23100 },
    { month: 'May', revenue: 25800 },
    { month: 'Jun', revenue: 27300 },
    { month: 'Jul', revenue: 31200 },
    { month: 'Aug', revenue: 29500 },
    { month: 'Sep', revenue: 26800 },
    { month: 'Oct', revenue: 24600 },
    { month: 'Nov', revenue: 22400 },
  ];

  // Occupancy data
  const occupancyData = [
    { month: 'Jan', occupancy: 72 },
    { month: 'Feb', occupancy: 75 },
    { month: 'Mar', occupancy: 78 },
    { month: 'Apr', occupancy: 82 },
    { month: 'May', occupancy: 85 },
    { month: 'Jun', occupancy: 88 },
    { month: 'Jul', occupancy: 92 },
    { month: 'Aug', occupancy: 90 },
    { month: 'Sep', occupancy: 84 },
    { month: 'Oct', occupancy: 80 },
    { month: 'Nov', occupancy: 78 },
  ];

  // Channel distribution
  const channelData = [
    { name: 'Booking.com', value: 45, color: 'var(--chart-1)' },
    { name: 'Airbnb', value: 30, color: 'var(--chart-2)' },
    { name: 'Expedia', value: 15, color: 'var(--chart-3)' },
    { name: 'Direct', value: 10, color: 'var(--chart-4)' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">View detailed property performance metrics</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Select defaultValue="last-12">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="last-12">Last 12 months</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">CSV</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Revenue (YTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$268,400</div>
            <p className="text-xs text-success mt-1">+12.5% vs last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">82.1%</div>
            <p className="text-xs text-success mt-1">+3.2% vs last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Daily Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$185</div>
            <p className="text-xs text-success mt-1">+8.5% vs last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">RevPAR</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$152</div>
            <p className="text-xs text-success mt-1">+11.8% vs last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--text-muted)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--elevation-3)'
                  }}
                  labelStyle={{ color: 'var(--text)', fontWeight: 500 }}
                  itemStyle={{ color: 'var(--text-muted)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--chart-1)" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.9}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--text-muted)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--elevation-3)'
                  }}
                  labelStyle={{ color: 'var(--text)', fontWeight: 500 }}
                  itemStyle={{ color: 'var(--text-muted)' }}
                  formatter={(value: number) => [`${value}%`, 'Occupancy']}
                />
                <Line 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="var(--chart-3)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--chart-3)', r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Channel Distribution & Top Performing Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      boxShadow: 'var(--elevation-3)'
                    }}
                    labelStyle={{ color: 'var(--text)', fontWeight: 500 }}
                    itemStyle={{ color: 'var(--text-muted)' }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Rooms */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { room: '301', occupancy: 95, revenue: '$18,450' },
                { room: '204', occupancy: 92, revenue: '$17,280' },
                { room: '103', occupancy: 90, revenue: '$16,920' },
                { room: '205', occupancy: 88, revenue: '$16,540' },
                { room: '102', occupancy: 87, revenue: '$16,320' },
              ].map((room) => (
                <div key={room.room} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-medium">{room.room}</span>
                    </div>
                    <div>
                      <p className="font-medium">Room {room.room}</p>
                      <p className="text-sm text-muted-foreground">{room.occupancy}% occupancy</p>
                    </div>
                  </div>
                  <span className="font-medium">{room.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guest Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Rating</span>
                <span className="text-lg">4.8 / 5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Reviews</span>
                <span>248</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Response Rate</span>
                <span>98%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Booking Lead Time</span>
                <span>14 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Length of Stay</span>
                <span>3.2 nights</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cancellation Rate</span>
                <span>8.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Net Revenue</span>
                <span>$241,560</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Operating Costs</span>
                <span>$89,420</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Net Profit Margin</span>
                <span>56.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
