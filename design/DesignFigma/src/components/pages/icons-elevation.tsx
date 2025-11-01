import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Calendar, Users, Settings, Bell, Search, Menu, X, 
  Check, AlertCircle, Info, ChevronDown, Plus, Edit,
  Trash2, Download, Upload, Home, FileText, BarChart3,
  Mail, Phone, MapPin, Star, Heart, Share2
} from 'lucide-react';
import { Badge } from '../ui/badge';

export function IconsElevationPage() {
  const iconSizes = [
    { name: 'Small', size: 'h-4 w-4', pixels: '16px', class: 'h-4 w-4' },
    { name: 'Medium', size: 'h-5 w-5', pixels: '20px', class: 'h-5 w-5' },
    { name: 'Large', size: 'h-6 w-6', pixels: '24px', class: 'h-6 w-6' },
    { name: 'Extra Large', size: 'h-8 w-8', pixels: '32px', class: 'h-8 w-8' },
  ];

  const commonIcons = [
    { Icon: Calendar, name: 'Calendar' },
    { Icon: Users, name: 'Users' },
    { Icon: Settings, name: 'Settings' },
    { Icon: Bell, name: 'Bell' },
    { Icon: Search, name: 'Search' },
    { Icon: Menu, name: 'Menu' },
    { Icon: X, name: 'X' },
    { Icon: Check, name: 'Check' },
    { Icon: AlertCircle, name: 'AlertCircle' },
    { Icon: Info, name: 'Info' },
    { Icon: ChevronDown, name: 'ChevronDown' },
    { Icon: Plus, name: 'Plus' },
    { Icon: Edit, name: 'Edit' },
    { Icon: Trash2, name: 'Trash2' },
    { Icon: Download, name: 'Download' },
    { Icon: Upload, name: 'Upload' },
    { Icon: Home, name: 'Home' },
    { Icon: FileText, name: 'FileText' },
    { Icon: BarChart3, name: 'BarChart3' },
    { Icon: Mail, name: 'Mail' },
    { Icon: Phone, name: 'Phone' },
    { Icon: MapPin, name: 'MapPin' },
    { Icon: Star, name: 'Star' },
    { Icon: Heart, name: 'Heart' },
    { Icon: Share2, name: 'Share2' },
  ];

  const elevationLevels = [
    { level: 0, name: 'None', usage: 'Flat surfaces, page background', cssVar: '--elevation-0' },
    { level: 1, name: 'Subtle', usage: 'Card hover states', cssVar: '--elevation-1' },
    { level: 2, name: 'Default', usage: 'Cards, panels', cssVar: '--elevation-2' },
    { level: 3, name: 'Raised', usage: 'Dropdown menus', cssVar: '--elevation-3' },
    { level: 4, name: 'Overlay', usage: 'Modals, dialogs', cssVar: '--elevation-4' },
    { level: 5, name: 'Highest', usage: 'Tooltips', cssVar: '--elevation-5' },
  ];

  const zIndexLevels = [
    { name: 'Base', value: 'var(--z-base)', numeric: '0', usage: 'Default layer' },
    { name: 'Dropdown', value: 'var(--z-dropdown)', numeric: '1000', usage: 'Dropdown menus' },
    { name: 'Sticky', value: 'var(--z-sticky)', numeric: '1020', usage: 'Sticky headers' },
    { name: 'Fixed', value: 'var(--z-fixed)', numeric: '1030', usage: 'Fixed positioning' },
    { name: 'Drawer', value: 'var(--z-drawer)', numeric: '1040', usage: 'Side drawers' },
    { name: 'Modal Backdrop', value: 'var(--z-modal-backdrop)', numeric: '1050', usage: 'Modal overlay' },
    { name: 'Modal', value: 'var(--z-modal)', numeric: '1060', usage: 'Modal content' },
    { name: 'Popover', value: 'var(--z-popover)', numeric: '1070', usage: 'Popovers' },
    { name: 'Tooltip', value: 'var(--z-tooltip)', numeric: '1080', usage: 'Tooltips' },
    { name: 'Toast', value: 'var(--z-toast)', numeric: '1090', usage: 'Toast notifications' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Icons & Elevation</h1>
        <p className="text-muted-foreground mt-2">
          Icon specifications and elevation system for Bmad Method v3
        </p>
      </div>

      {/* Icon Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Specifications</CardTitle>
          <CardDescription>
            All icons use Lucide React library with consistent 24×24px grid and 2px stroke width
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Size Scale */}
          <div>
            <h3 className="mb-4">Size Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {iconSizes.map(({ name, size, pixels, class: className }) => (
                <Card key={name}>
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                    <Calendar className={className} />
                    <div className="text-center">
                      <div className="text-sm">{name}</div>
                      <code className="text-xs text-muted-foreground">{pixels}</code>
                      <div className="text-xs text-muted-foreground mt-1">
                        <code>{size}</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Grid System */}
          <div>
            <h3 className="mb-4">Grid System</h3>
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div 
                    className="absolute inset-0 grid grid-cols-24 grid-rows-24 pointer-events-none"
                    style={{ width: '96px', height: '96px' }}
                  >
                    {Array.from({ length: 24 * 24 }).map((_, i) => (
                      <div key={i} className="border-r border-b border-border/20" />
                    ))}
                  </div>
                  <Calendar className="h-24 w-24 text-primary relative z-10" strokeWidth={2} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Grid</Badge>
                    <span className="text-sm">24×24px base grid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Stroke</Badge>
                    <span className="text-sm">2px width (consistent)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Scaling</Badge>
                    <span className="text-sm">16px, 20px, 24px, 32px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Icons */}
          <div>
            <h3 className="mb-4">Common Icons</h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
              {commonIcons.map(({ Icon, name }) => (
                <div 
                  key={name}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs text-center text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Application */}
          <div>
            <h3 className="mb-4">Color Application</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-foreground" />
                  <div className="text-sm">
                    <div>Default</div>
                    <code className="text-xs text-muted-foreground">text-foreground</code>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <div>Muted</div>
                    <code className="text-xs text-muted-foreground">text-muted-foreground</code>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <div>Primary</div>
                    <code className="text-xs text-muted-foreground">text-primary</code>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Check className="h-5 w-5 text-[#10B981]" />
                  <div className="text-sm">
                    <div>Success</div>
                    <code className="text-xs text-muted-foreground">text-[#10B981]</code>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
                  <div className="text-sm">
                    <div>Warning</div>
                    <code className="text-xs text-muted-foreground">text-[#F59E0B]</code>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <X className="h-5 w-5 text-[#EF4444] dark:text-[#F43F5E]" />
                  <div className="text-sm">
                    <div>Danger</div>
                    <code className="text-xs text-muted-foreground">text-danger</code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elevation System */}
      <Card>
        <CardHeader>
          <CardTitle>Elevation System (Shadows)</CardTitle>
          <CardDescription>
            Shadow levels for creating depth and hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elevationLevels.map(({ level, name, usage, cssVar }) => (
              <div key={level} className="space-y-3">
                <div 
                  className="h-32 rounded-lg bg-card border border-border flex items-center justify-center"
                  style={{ boxShadow: `var(${cssVar})` }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{level}</div>
                    <Badge variant="outline">{name}</Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">{usage}</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{cssVar}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Z-Index Scale */}
      <Card>
        <CardHeader>
          <CardTitle>Z-Index Scale</CardTitle>
          <CardDescription>
            Stacking order for layered elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {zIndexLevels.map(({ name, value, numeric, usage }) => (
              <div 
                key={name}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge>{numeric}</Badge>
                  <div>
                    <div className="text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">{usage}</div>
                  </div>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-2">Using Elevation</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<div className="shadow-[var(--elevation-2)] rounded-lg">
  Card with default elevation
</div>

<div className="shadow-[var(--elevation-4)] rounded-lg">
  Modal with overlay elevation
</div>`}
            </pre>
          </div>

          <div>
            <h4 className="mb-2">Using Z-Index</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<div className="fixed z-[var(--z-modal)]">
  Modal content
</div>

<div className="fixed z-[var(--z-tooltip)]">
  Tooltip
</div>`}
            </pre>
          </div>

          <div>
            <h4 className="mb-2">Using Icons</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { Calendar } from 'lucide-react';

<Calendar className="h-5 w-5 text-primary" />
<Calendar className="h-6 w-6 text-muted-foreground" />`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
