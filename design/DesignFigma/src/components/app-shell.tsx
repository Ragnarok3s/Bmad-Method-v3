import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  DollarSign, 
  Users, 
  Wrench, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Moon,
  Sun,
  Home,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
        ${active 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
        }
      `}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge className="h-5 px-1.5 text-xs">{badge}</Badge>
      )}
    </button>
  );
}

interface AppShellProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function AppShell({ currentPage, onNavigate, children, theme, onThemeToggle }: AppShellProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on navigation in mobile
  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'reservations', icon: FileText, label: 'Reservations', badge: 3 },
    { id: 'channels', icon: Home, label: 'Channels' },
    { id: 'payments', icon: DollarSign, label: 'Payments' },
    { id: 'housekeeping', icon: Users, label: 'Housekeeping', badge: 5 },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance', badge: 2 },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-screen flex bg-bg">
      {/* Mobile overlay with blur */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[var(--z-drawer)] transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-60 bg-surface/95 backdrop-blur-md border-r border-border flex flex-col
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:bg-surface lg:backdrop-blur-none
        ${isMobile ? 'fixed inset-y-0 left-0 z-[calc(var(--z-drawer)+10)] shadow-[var(--elevation-4)]' : ''}
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground">B</span>
            </div>
            <span className="font-semibold">Bmad Method</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentPage === item.id}
              badge={item.badge}
              onClick={() => handleNavigate(item.id)}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm">John Doe</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('qa-variants')}>
                QA - Component Variants
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('form-example')}>
                QA - Form Components
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('qa-date-picker')}>
                QA - Date Range Picker
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('design-tokens')}>
                Design Tokens
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('icons-elevation')}>
                Icons & Elevation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('system-preferences')}>
                System Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-surface border-b border-border flex items-center px-4 lg:px-6 gap-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reservations, guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-bg hidden sm:block"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="sm:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onThemeToggle}>
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
