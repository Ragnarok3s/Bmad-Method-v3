import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Sun, Moon, Monitor, Zap, ZapOff, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SystemPreferencesPage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [autoDetectTheme, setAutoDetectTheme] = useState(true);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Detect system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1>System Preferences</h1>
        <p className="text-muted-foreground mt-2">
          How Bmad Method v3 respects system-level accessibility and appearance preferences
        </p>
      </div>

      {/* Color Scheme Preference */}
      <Card>
        <CardHeader>
          <CardTitle>prefers-color-scheme</CardTitle>
          <CardDescription>
            Automatic theme detection based on operating system preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Detection */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm">System Preference Detected</div>
                <div className="text-xs text-muted-foreground">Current OS color scheme</div>
              </div>
            </div>
            <Badge variant={systemTheme === 'dark' ? 'default' : 'secondary'} className="flex items-center gap-1">
              {systemTheme === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
              {systemTheme === 'dark' ? 'Dark' : 'Light'}
            </Badge>
          </div>

          {/* Auto-detect Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm">Auto-detect Theme</div>
                <div className="text-xs text-muted-foreground">Follow system preference automatically</div>
              </div>
            </div>
            <Switch checked={autoDetectTheme} onCheckedChange={setAutoDetectTheme} />
          </div>

          {/* Manual Theme Selection */}
          {!autoDetectTheme && (
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <Sun className="h-5 w-5" />
                <span className="text-sm">Light</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <Moon className="h-5 w-5" />
                <span className="text-sm">Dark</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
                <Monitor className="h-5 w-5" />
                <span className="text-sm">System</span>
              </Button>
            </div>
          )}

          {/* Implementation */}
          <div>
            <h4 className="mb-2">Implementation</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// CSS Media Query
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0B1220;
    --surface: #0F172A;
    --text: #E5E7EB;
    /* ... dark mode tokens ... */
  }
}

// JavaScript Detection
const isDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

// React Hook
useEffect(() => {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}, []);`}
            </pre>
          </div>

          {/* Visual Examples */}
          <div>
            <h4 className="mb-3">Visual Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Light Mode Example */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="h-4 w-4 text-[#2563EB]" />
                    <Badge variant="secondary">Light Mode</Badge>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 space-y-2">
                    <div className="h-3 bg-[#2563EB] rounded w-3/4"></div>
                    <div className="h-3 bg-[#E5E7EB] rounded w-1/2"></div>
                    <div className="h-3 bg-[#E5E7EB] rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              {/* Dark Mode Example */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-[#0B1220] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="h-4 w-4 text-[#2563EB]" />
                    <Badge className="bg-[#111827] text-[#E5E7EB]">Dark Mode</Badge>
                  </div>
                  <div className="bg-[#0F172A] border border-[#273245] rounded-lg p-3 space-y-2">
                    <div className="h-3 bg-[#2563EB] rounded w-3/4"></div>
                    <div className="h-3 bg-[#1F2937] rounded w-1/2"></div>
                    <div className="h-3 bg-[#1F2937] rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reduced Motion Preference */}
      <Card>
        <CardHeader>
          <CardTitle>prefers-reduced-motion</CardTitle>
          <CardDescription>
            Respecting users who prefer minimal animation and motion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Detection */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              {reducedMotion ? <ZapOff className="h-5 w-5 text-muted-foreground" /> : <Zap className="h-5 w-5 text-primary" />}
              <div>
                <div className="text-sm">Reduced Motion Preference</div>
                <div className="text-xs text-muted-foreground">Current accessibility setting</div>
              </div>
            </div>
            <Badge variant={reducedMotion ? 'secondary' : 'default'}>
              {reducedMotion ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {/* Animation Demo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4>Animation Demo</h4>
              <div className="flex items-center gap-2">
                <Switch checked={showAnimation} onCheckedChange={setShowAnimation} />
                <span className="text-sm text-muted-foreground">
                  {showAnimation ? 'Playing' : 'Paused'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* With Animation */}
              <div className="space-y-2">
                <Badge variant="outline">Normal Motion</Badge>
                <div className="h-48 rounded-lg border border-border bg-muted/30 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {showAnimation && (
                      <motion.div
                        key="animated"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "reverse",
                          repeatDelay: 0.5
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-xs text-muted-foreground">
                  Smooth transitions, fade-ins, and motion effects
                </p>
              </div>

              {/* Without Animation */}
              <div className="space-y-2">
                <Badge variant="outline">Reduced Motion</Badge>
                <div className="h-48 rounded-lg border border-border bg-muted/30 relative">
                  {showAnimation && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                        <Pause className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Instant transitions, no motion effects
                </p>
              </div>
            </div>
          </div>

          {/* Implementation */}
          <div>
            <h4 className="mb-2">Implementation</h4>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// CSS Implementation (in globals.css)
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// JavaScript Detection
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// React Hook
const [reducedMotion, setReducedMotion] = useState(false);

useEffect(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReducedMotion(query.matches);
  
  const handler = (e) => setReducedMotion(e.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}, []);

// Conditional Animation
<motion.div
  animate={!reducedMotion ? { opacity: 1, x: 0 } : {}}
  transition={!reducedMotion ? { duration: 0.3 } : { duration: 0 }}
>
  Content
</motion.div>`}
            </pre>
          </div>

          {/* What Gets Affected */}
          <div>
            <h4 className="mb-3">What Gets Affected by Reduced Motion</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border">
                <div className="text-sm mb-1">Page Transitions</div>
                <div className="text-xs text-muted-foreground">Instant instead of animated</div>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <div className="text-sm mb-1">Modal Animations</div>
                <div className="text-xs text-muted-foreground">Appear without fade/scale</div>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <div className="text-sm mb-1">Hover Effects</div>
                <div className="text-xs text-muted-foreground">Immediate state changes</div>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <div className="text-sm mb-1">Scroll Animations</div>
                <div className="text-xs text-muted-foreground">Elements appear immediately</div>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <div className="text-sm mb-1">Loading Spinners</div>
                <div className="text-xs text-muted-foreground">Static or minimal motion</div>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <div className="text-sm mb-1">Drag & Drop</div>
                <div className="text-xs text-muted-foreground">Position updates only</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Badge variant="default" className="h-6">DO</Badge>
              <div className="flex-1">
                <p className="text-sm">Always provide a way to disable animations in your app settings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="default" className="h-6">DO</Badge>
              <div className="flex-1">
                <p className="text-sm">Test your application with reduced motion enabled</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="default" className="h-6">DO</Badge>
              <div className="flex-1">
                <p className="text-sm">Respect system preferences by default</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="destructive" className="h-6">DON'T</Badge>
              <div className="flex-1">
                <p className="text-sm">Force animations when user has indicated preference against them</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="destructive" className="h-6">DON'T</Badge>
              <div className="flex-1">
                <p className="text-sm">Use motion for critical functionality (ensure it works without)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge variant="destructive" className="h-6">DON'T</Badge>
              <div className="flex-1">
                <p className="text-sm">Ignore accessibility preferences to maintain "design vision"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Test */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test These Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">macOS</Badge>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Dark Mode:</strong> System Preferences → General → Appearance → Dark</li>
                <li><strong>Reduced Motion:</strong> System Preferences → Accessibility → Display → Reduce motion</li>
              </ul>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Windows</Badge>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Dark Mode:</strong> Settings → Personalization → Colors → Dark</li>
                <li><strong>Reduced Motion:</strong> Settings → Ease of Access → Display → Show animations</li>
              </ul>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Browser DevTools</Badge>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Chrome/Edge: DevTools → Rendering → Emulate CSS media feature prefers-color-scheme</li>
                <li>Chrome/Edge: DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion</li>
                <li>Firefox: DevTools → Inspector → :hov button → prefers-color-scheme / prefers-reduced-motion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
