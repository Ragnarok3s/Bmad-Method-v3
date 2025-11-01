import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

export function DesignTokensPage() {
  const colors = [
    { name: 'Primary', token: '--primary', light: '#2563EB', dark: '#2563EB' },
    { name: 'Accent', token: '--accent', light: '#0EA5E9', dark: '#14B8A6' },
    { name: 'Success', token: '--success', light: '#10B981', dark: '#10B981' },
    { name: 'Warning', token: '--warning', light: '#F59E0B', dark: '#F59E0B' },
    { name: 'Danger', token: '--danger', light: '#EF4444', dark: '#F43F5E' },
    { name: 'Info', token: '--info', light: '#60A5FA', dark: '#60A5FA' },
  ];

  const surfaces = [
    { name: 'Background', token: '--bg', light: '#F8FAFC', dark: '#0B1220' },
    { name: 'Surface', token: '--surface', light: '#FFFFFF', dark: '#0F172A' },
    { name: 'Surface 2', token: '--surface-2', light: '#F1F5F9', dark: '#111827' },
    { name: 'Border', token: '--border', light: '#E5E7EB', dark: '#1F2937' },
    { name: 'Border Strong', token: '--border-strong', light: '#E5E7EB', dark: '#273245', darkOnly: true },
  ];

  const text = [
    { name: 'Text', token: '--text', light: '#111827', dark: '#E5E7EB' },
    { name: 'Text Muted', token: '--text-muted', light: '#6B7280', dark: '#9CA3AF' },
  ];

  const elevations = [
    { level: 0, description: 'Flat surfaces', css: 'var(--elevation-0)' },
    { level: 1, description: 'Subtle depth', css: 'var(--elevation-1)' },
    { level: 2, description: 'Cards, panels', css: 'var(--elevation-2)' },
    { level: 3, description: 'Raised components', css: 'var(--elevation-3)' },
    { level: 4, description: 'Overlays', css: 'var(--elevation-4)' },
    { level: 5, description: 'Highest elements', css: 'var(--elevation-5)' },
  ];

  const breakpoints = [
    { name: 'Mobile', icon: Smartphone, size: '375px', description: 'Small phones' },
    { name: 'Tablet', icon: Tablet, size: '768px', description: 'Tablets, large phones' },
    { name: 'Desktop', icon: Monitor, size: '1024px', description: 'Laptops, desktops' },
    { name: 'Wide', icon: Monitor, size: '1440px', description: 'Large screens' },
  ];

  const zIndex = [
    { name: 'Base', token: '--z-base', value: '0' },
    { name: 'Dropdown', token: '--z-dropdown', value: '1000' },
    { name: 'Sticky', token: '--z-sticky', value: '1020' },
    { name: 'Fixed', token: '--z-fixed', value: '1030' },
    { name: 'Drawer', token: '--z-drawer', value: '1040' },
    { name: 'Modal Backdrop', token: '--z-modal-backdrop', value: '1050' },
    { name: 'Modal', token: '--z-modal', value: '1060' },
    { name: 'Popover', token: '--z-popover', value: '1070' },
    { name: 'Tooltip', token: '--z-tooltip', value: '1080' },
    { name: 'Toast', token: '--z-toast', value: '1090' },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1>Design Tokens</h1>
        <p className="text-muted-foreground">
          Complete reference of design tokens and variables used throughout the system
        </p>
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="elevation">Elevation</TabsTrigger>
          <TabsTrigger value="breakpoints">Breakpoints</TabsTrigger>
          <TabsTrigger value="zindex">Z-Index</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          {/* Semantic Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Semantic Colors</CardTitle>
              <CardDescription>
                Colors that convey meaning and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {colors.map((color) => (
                  <div key={color.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{color.name}</span>
                      <code className="text-xs text-muted-foreground">{color.token}</code>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <div 
                          className="h-16 rounded-lg border border-border"
                          style={{ backgroundColor: color.light }}
                        />
                        <p className="text-xs text-muted-foreground">Light: {color.light}</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div 
                          className="h-16 rounded-lg border border-border"
                          style={{ backgroundColor: color.dark }}
                        />
                        <p className="text-xs text-muted-foreground">Dark: {color.dark}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Surface Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Surface Colors</CardTitle>
              <CardDescription>
                Background and surface layer colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {surfaces.map((surface: any) => (
                  <div key={surface.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{surface.name}</span>
                        {surface.darkOnly && <Badge variant="outline" className="text-xs">Dark Mode</Badge>}
                      </div>
                      <code className="text-xs text-muted-foreground">{surface.token}</code>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <div 
                          className="h-16 rounded-lg border border-border"
                          style={{ backgroundColor: surface.light }}
                        />
                        <p className="text-xs text-muted-foreground">Light: {surface.light}</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div 
                          className="h-16 rounded-lg border border-border"
                          style={{ backgroundColor: surface.dark }}
                        />
                        <p className="text-xs text-muted-foreground">Dark: {surface.dark}</p>
                      </div>
                    </div>
                    {surface.darkOnly && (
                      <p className="text-xs text-muted-foreground italic">
                        Used for table/grid borders in dark mode for better visibility
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Text Colors</CardTitle>
              <CardDescription>
                Text and foreground colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {text.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <code className="text-xs text-muted-foreground">{item.token}</code>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <div 
                          className="h-16 rounded-lg border border-border flex items-center justify-center"
                          style={{ backgroundColor: '#FFFFFF' }}
                        >
                          <span style={{ color: item.light }}>Aa</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Light: {item.light}</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div 
                          className="h-16 rounded-lg border border-border flex items-center justify-center"
                          style={{ backgroundColor: '#0F172A' }}
                        >
                          <span style={{ color: item.dark }}>Aa</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Dark: {item.dark}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Elevation Tab */}
        <TabsContent value="elevation">
          <Card>
            <CardHeader>
              <CardTitle>Elevation Scale</CardTitle>
              <CardDescription>
                Shadow system for creating depth and hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elevations.map((elevation) => (
                  <div key={elevation.level} className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">Level {elevation.level}</Badge>
                        <code className="text-xs text-muted-foreground">
                          --elevation-{elevation.level}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">{elevation.description}</p>
                    </div>
                    <div 
                      className="h-24 bg-surface rounded-lg"
                      style={{ boxShadow: elevation.css }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakpoints Tab */}
        <TabsContent value="breakpoints">
          <Card>
            <CardHeader>
              <CardTitle>Responsive Breakpoints</CardTitle>
              <CardDescription>
                Screen size breakpoints for responsive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breakpoints.map((bp, index) => {
                  const Icon = bp.icon;
                  return (
                    <div 
                      key={bp.name} 
                      className="flex items-start gap-4 p-4 rounded-lg border border-border"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4>{bp.name}</h4>
                          <Badge variant="secondary">{bp.size}</Badge>
                          <code className="text-xs text-muted-foreground">
                            --breakpoint-{bp.name.toLowerCase()}
                          </code>
                        </div>
                        <p className="text-sm text-muted-foreground">{bp.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Z-Index Tab */}
        <TabsContent value="zindex">
          <Card>
            <CardHeader>
              <CardTitle>Z-Index Scale</CardTitle>
              <CardDescription>
                Layering system for overlapping elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {zIndex.map((item, index) => (
                  <div 
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.value}</Badge>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <code className="text-sm text-muted-foreground">{item.token}</code>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-surface-2 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Usage:</strong> Always use defined z-index tokens to maintain proper layering hierarchy. 
                  Never use arbitrary z-index values. The scale ensures elements stack correctly across the application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing">
          <Card>
            <CardHeader>
              <CardTitle>Spacing System</CardTitle>
              <CardDescription>
                Layout spacing and sizing tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-3">Layout Dimensions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Sidebar Width</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">240px</Badge>
                      <code className="text-sm text-muted-foreground">--sidebar-width</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Sidebar Collapsed</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">64px</Badge>
                      <code className="text-sm text-muted-foreground">--sidebar-collapsed</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>TopBar Height</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">64px</Badge>
                      <code className="text-sm text-muted-foreground">--topbar-height</code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3">Icon Sizes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Small</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">16px</Badge>
                      <code className="text-sm text-muted-foreground">--icon-sm</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Medium</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">20px</Badge>
                      <code className="text-sm text-muted-foreground">--icon-md</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Large</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">24px</Badge>
                      <code className="text-sm text-muted-foreground">--icon-lg</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Extra Large</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">32px</Badge>
                      <code className="text-sm text-muted-foreground">--icon-xl</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Stroke Width</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">2px</Badge>
                      <code className="text-sm text-muted-foreground">--icon-stroke</code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3">Density Tokens</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Compact Row Height</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">40px</Badge>
                      <code className="text-sm text-muted-foreground">--density-compact-row</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Comfortable Row Height</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">48px</Badge>
                      <code className="text-sm text-muted-foreground">--density-comfortable-row</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Compact Gap</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">0.5rem</Badge>
                      <code className="text-sm text-muted-foreground">--density-compact-gap</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span>Comfortable Gap</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">0.75rem</Badge>
                      <code className="text-sm text-muted-foreground">--density-comfortable-gap</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-2 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Best Practice:</strong> Use spacing in multiples of 4px (0.25rem) for consistent alignment. 
                  Common spacing values: 4px, 8px, 12px, 16px, 24px, 32px, 48px.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
