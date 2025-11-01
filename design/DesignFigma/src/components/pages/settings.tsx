import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function SettingsPage({ theme, onThemeToggle }: SettingsPageProps) {
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      {/* Settings Content */}
      <Tabs defaultValue="general" className="space-y-3 sm:space-y-4 md:space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex h-auto gap-1 p-1">
          <TabsTrigger value="general" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">General</TabsTrigger>
          <TabsTrigger value="appearance" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">Notify</TabsTrigger>
          <TabsTrigger value="integrations" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-3 sm:space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>Update your property details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property-name">Property Name</Label>
                <Input id="property-name" defaultValue="Main Property" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-address">Address</Label>
                <Input id="property-address" defaultValue="123 Main St, City" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-phone">Phone</Label>
                  <Input id="property-phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-email">Email</Label>
                  <Input id="property-email" type="email" defaultValue="info@property.com" />
                </div>
              </div>
              <div className="pt-2 sm:pt-4">
                <Button className="w-full sm:w-auto">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check-in / Check-out Times</CardTitle>
              <CardDescription>Set default times for guests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check-in-time">Check-in Time</Label>
                  <Input id="check-in-time" type="time" defaultValue="15:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check-out-time">Check-out Time</Label>
                  <Input id="check-out-time" type="time" defaultValue="11:00" />
                </div>
              </div>
              <div className="pt-2 sm:pt-4">
                <Button className="w-full sm:w-auto">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-3 sm:space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="theme-toggle">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={onThemeToggle}
                  className="shrink-0"
                />
              </div>

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label>Theme Preview</Label>
                  <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                    Current theme: <span className="font-medium">{theme === 'light' ? 'Light' : 'Dark'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
                    <div className="h-3 w-24 bg-primary rounded" />
                    <div className="space-y-2">
                      <div className="h-2 bg-foreground/20 rounded" />
                      <div className="h-2 bg-foreground/20 rounded w-4/5" />
                      <div className="h-2 bg-foreground/20 rounded w-3/5" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-surface-2 space-y-3">
                    <div className="h-3 w-24 bg-foreground/40 rounded" />
                    <div className="space-y-2">
                      <div className="h-2 bg-foreground/20 rounded" />
                      <div className="h-2 bg-foreground/20 rounded w-4/5" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Adjust how information is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing and make UI more compact
                  </p>
                </div>
                <Switch id="compact-mode" className="shrink-0" />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable UI animations
                  </p>
                </div>
                <Switch id="animations" defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-3 sm:space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage email notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="new-reservations">New Reservations</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when new reservations are made
                  </p>
                </div>
                <Switch id="new-reservations" defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="check-in-reminders">Check-in Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming check-ins
                  </p>
                </div>
                <Switch id="check-in-reminders" defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="payment-alerts">Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for payment status changes
                  </p>
                </div>
                <Switch id="payment-alerts" defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>Control in-app notification behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications for important events
                  </p>
                </div>
                <Switch id="desktop-notifications" className="shrink-0" />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="sound-alerts">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound for notifications
                  </p>
                </div>
                <Switch id="sound-alerts" className="shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-3 sm:space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Manager Integrations</CardTitle>
              <CardDescription>Connect your booking channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded bg-[#003580] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">B.com</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">Booking.com</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">Configure</Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded bg-[#FF5A5F] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">Airbnb</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">Airbnb</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">Configure</Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded bg-[#FFCB05] flex items-center justify-center shrink-0">
                    <span className="text-black text-xs">Exp</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">Expedia</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Manage payment integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded bg-[#635BFF] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">Stripe</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">Stripe</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
