import React, { useState, useEffect } from 'react';
import { AppShell } from './components/app-shell';
import { DashboardPage } from './components/pages/dashboard';
import { CalendarPage } from './components/pages/calendar';
import { ReservationsPage } from './components/pages/reservations';
import { SettingsPage } from './components/pages/settings';
import { ChannelsPage } from './components/pages/channels';
import { PaymentsPage } from './components/pages/payments';
import { HousekeepingPage } from './components/pages/housekeeping';
import { MaintenancePage } from './components/pages/maintenance';
import { ReportsPage } from './components/pages/reports';
import { QAReservationVariantsPage } from './components/pages/qa-reservation-variants';
import { FormExamplePage } from './components/pages/form-example';
import { IconsElevationPage } from './components/pages/icons-elevation';
import { QADatePickerPage } from './components/pages/qa-date-picker';
import { SystemPreferencesPage } from './components/pages/system-preferences';
import { DesignTokensPage } from './components/pages/design-tokens';
import {
  AnalyticsModulePage,
  GovernanceModulePage,
  ObservabilityModulePage,
  AgentsModulePage,
  PlaybooksModulePage,
  RecommendationsModulePage,
  MarketplaceModulePage,
  ExtensionsModulePage,
  GuestExperienceModulePage,
  OwnersModulePage,
  SupportModulePage,
  OnboardingModulePage
} from './components/pages/modules';
import { DensityProvider } from './components/density-context';

export default function App() {
  const [currentPage, setCurrentPage] = useState('calendar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from system preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'settings':
        return <SettingsPage theme={theme} onThemeToggle={handleThemeToggle} />;
      case 'qa-variants':
        return <QAReservationVariantsPage />;
      case 'qa-date-picker':
        return <QADatePickerPage />;
      case 'icons-elevation':
        return <IconsElevationPage />;
      case 'system-preferences':
        return <SystemPreferencesPage />;
      case 'channels':
        return <ChannelsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'housekeeping':
        return <HousekeepingPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'reports':
        return <ReportsPage />;
      case 'form-example':
        return <FormExamplePage />;
      case 'design-tokens':
        return <DesignTokensPage />;
      case 'analytics':
        return <AnalyticsModulePage />;
      case 'governanca':
        return <GovernanceModulePage />;
      case 'observabilidade':
        return <ObservabilityModulePage />;
      case 'agentes':
        return <AgentsModulePage />;
      case 'playbooks':
        return <PlaybooksModulePage />;
      case 'recommendations':
        return <RecommendationsModulePage />;
      case 'marketplace':
        return <MarketplaceModulePage />;
      case 'extensions':
        return <ExtensionsModulePage />;
      case 'guest-experience':
        return <GuestExperienceModulePage />;
      case 'owners':
        return <OwnersModulePage />;
      case 'support':
        return <SupportModulePage />;
      case 'onboarding':
        return <OnboardingModulePage />;
      default:
        return <CalendarPage />;
    }
  };

  return (
    <DensityProvider>
      <AppShell
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      >
        {renderPage()}
      </AppShell>
    </DensityProvider>
  );
}
