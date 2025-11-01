import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DateRangePicker } from '../date-range-picker';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';

export function QADatePickerPage() {
  const [range1, setRange1] = useState({ from: new Date(), to: new Date() });
  const [range2, setRange2] = useState({ from: new Date(), to: new Date() });
  const [range3, setRange3] = useState({ from: new Date(), to: new Date() });

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'This Month', days: 0 },
  ];

  const getPresetDate = (days: number) => {
    const today = new Date();
    if (days === 0) {
      // This month
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today
      };
    }
    const from = new Date(today);
    from.setDate(today.getDate() - days);
    return { from, to: today };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>QA — Date Range Picker</h1>
        <p className="text-muted-foreground mt-2">
          Testing all states, presets, and interactions of the Date Range Picker component
        </p>
      </div>

      {/* Basic Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Date Range Picker</CardTitle>
          <CardDescription>Default implementation with all features</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePicker
            value={range1}
            onChange={setRange1}
            placeholder="Select date range"
          />
        </CardContent>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Selections</CardTitle>
          <CardDescription>Quick date range selections: 7/14/30 days and This Month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {presets.map(({ label, days }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => setRange2(getPresetDate(days))}
                >
                  {label}
                </Button>
              ))}
            </div>
            <DateRangePicker
              value={range2}
              onChange={setRange2}
              placeholder="Select or use preset"
            />
            <div className="text-sm text-muted-foreground">
              Selected: {range2.from.toLocaleDateString()} - {range2.to.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual States */}
      <Card>
        <CardHeader>
          <CardTitle>Visual States</CardTitle>
          <CardDescription>Hover, selected, disabled, and range states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* State Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Default</Badge>
                <div className="h-10 rounded-md border border-border bg-background flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Normal day cell</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Hover</Badge>
                <div className="h-10 rounded-md border border-border bg-accent flex items-center justify-center">
                  <span className="text-sm">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Hover state</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Selected</Badge>
                <div className="h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-sm">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Start/End date</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">In Range</Badge>
                <div className="h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <span className="text-sm text-primary">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Within range</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Today</Badge>
                <div className="h-10 rounded-md border-2 border-primary flex items-center justify-center">
                  <span className="text-sm">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Current day</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Disabled</Badge>
                <div className="h-10 rounded-md bg-muted flex items-center justify-center opacity-50">
                  <span className="text-sm text-muted-foreground">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Not selectable</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Outside Month</Badge>
                <div className="h-10 rounded-md flex items-center justify-center">
                  <span className="text-sm text-muted-foreground/50">30</span>
                </div>
                <p className="text-xs text-muted-foreground">Other month</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4 space-y-2">
                <Badge variant="outline">Focus</Badge>
                <div className="h-10 rounded-md border border-border ring-2 ring-primary flex items-center justify-center">
                  <span className="text-sm">15</span>
                </div>
                <p className="text-xs text-muted-foreground">Keyboard focus</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Preview */}
          <div>
            <h4 className="mb-3">Calendar Preview (Light & Dark)</h4>
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Week 1 */}
                {[30, 31, 1, 2, 3, 4, 5].map((day, i) => (
                  <div 
                    key={i}
                    className={`h-10 rounded-md flex items-center justify-center text-sm ${
                      day > 29 ? 'text-muted-foreground/50' : 
                      day === 3 ? 'bg-primary text-primary-foreground' :
                      day === 4 || day === 5 ? 'bg-primary/10 text-primary' :
                      'hover:bg-accent'
                    }`}
                  >
                    {day}
                  </div>
                ))}
                {/* Week 2 */}
                {[6, 7, 8, 9, 10, 11, 12].map((day, i) => (
                  <div 
                    key={i}
                    className={`h-10 rounded-md flex items-center justify-center text-sm ${
                      day === 12 ? 'bg-primary text-primary-foreground' :
                      day >= 6 && day < 12 ? 'bg-primary/10 text-primary' :
                      'hover:bg-accent'
                    }`}
                  >
                    {day}
                  </div>
                ))}
                {/* Week 3 */}
                {[13, 14, 15, 16, 17, 18, 19].map((day, i) => (
                  <div 
                    key={i}
                    className={`h-10 rounded-md flex items-center justify-center text-sm ${
                      day === 15 ? 'border-2 border-primary' : 'hover:bg-accent'
                    }`}
                  >
                    {day}
                  </div>
                ))}
                {/* Week 4 */}
                {[20, 21, 22, 23, 24, 25, 26].map((day, i) => (
                  <div 
                    key={i}
                    className={`h-10 rounded-md flex items-center justify-center text-sm ${
                      day >= 22 && day <= 25 ? 'bg-muted opacity-50 cursor-not-allowed' : 'hover:bg-accent'
                    }`}
                  >
                    {day}
                  </div>
                ))}
                {/* Week 5 */}
                {[27, 28, 29, 30, 1, 2, 3].map((day, i) => (
                  <div 
                    key={i}
                    className={`h-10 rounded-md flex items-center justify-center text-sm ${
                      day <= 3 ? 'text-muted-foreground/50' : 'hover:bg-accent'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                Timezone: America/New_York
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>Accessible keyboard shortcuts for date selection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">←</kbd>
                <span className="text-sm">Previous day</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">→</kbd>
                <span className="text-sm">Next day</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">↑</kbd>
                <span className="text-sm">Previous week</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">↓</kbd>
                <span className="text-sm">Next week</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Page Up</kbd>
                <span className="text-sm">Previous month</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Page Down</kbd>
                <span className="text-sm">Next month</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Enter</kbd>
                <span className="text-sm">Select date</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Esc</kbd>
                <span className="text-sm">Close picker</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disabled Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Disabled Dates</CardTitle>
          <CardDescription>Preventing selection of past dates or specific ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePicker
            value={range3}
            onChange={setRange3}
            placeholder="Select future dates only"
            disabledDates={(date) => date < new Date()}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Past dates are disabled and cannot be selected
          </p>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2">Basic Implementation</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { DateRangePicker } from './components/date-range-picker';

const [dateRange, setDateRange] = useState({
  from: new Date(),
  to: new Date()
});

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  placeholder="Select date range"
/>`}
            </pre>
          </div>

          <div>
            <h4 className="mb-2">With Disabled Dates</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  disabledDates={(date) => {
    // Disable weekends
    const day = date.getDay();
    return day === 0 || day === 6;
  }}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
