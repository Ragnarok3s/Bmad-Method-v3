# Bmad Method v3 - Hotel Management System

A comprehensive hotel management application with a complete Design System supporting Light and Dark modes.

## 🎨 Design System Features

### ✅ Implemented

- **Typography System**: Inter font with semantic type scale
- **Color Tokens**: Full Light/Dark mode support with semantic colors
- **Responsive Design**: Mobile (375px), Tablet (768px), Desktop (1024px+)
- **Iconography**: Lucide icons with 24px grid, 2px stroke
- **Elevation & Z-Index**: Consistent shadow and layering system
- **Form Validation**: Inline validation with helpful error messages
- **Input Masks**: Phone, date, currency formatting
- **Date Range Picker**: Preset ranges, custom selection, disabled dates
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Accessibility**: WCAG 2.1 AA compliant (contrast ≥ 4.5:1)

## 🚀 Key Components

### AppShell
- Fixed sidebar (240px) with collapsible mobile view
- TopBar with search and theme toggle
- Responsive navigation with hamburger menu

### ReservationBar & ReservationTile
- Timeline and grid views
- Status variants: confirmed, pending, checked-in, checked-out, cancelled
- Overbooking indicators
- Compact/comfortable density modes

### FormField
- Built-in validation (email, phone, length, pattern)
- Input masking (phone, date, currency)
- Accessible error messages
- Help text tooltips
- Visual validation states (valid/invalid)

### DateRangePicker
- Preset ranges (7/14/30 days, month, year)
- Dual calendar view
- Disabled dates support
- Timezone display
- Keyboard navigation

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Fixed sidebar visible
- Full table layouts
- Comfortable spacing

### Tablet (768px - 1023px)
- Sidebar collapses to hamburger menu
- Optimized grid layouts
- Medium spacing

### Mobile (<768px)
- Hamburger menu
- Single column layouts
- Compact spacing
- Card-based lists

## ⌨️ Keyboard Shortcuts

### Global
- `Cmd/Ctrl + K` - Open search
- `Esc` - Close modals/drawers
- `Tab` / `Shift + Tab` - Navigate focus

### Calendar
- `←` / `→` - Previous/next day
- `↑` / `↓` - Previous/next week
- `Page Up` / `Page Down` - Previous/next month
- `Enter` - Select date
- `Shift + ?` - Show keyboard shortcuts

## 🎨 Theme System

### Light Mode
- Background: #F8FAFC
- Surface: #FFFFFF
- Primary: #2563EB (Blue)
- Text: #111827

### Dark Mode
- Background: #0B1220
- Surface: #0F172A
- Primary: #2563EB (Blue)
- Text: #E5E7EB

### Contrast Requirements
- Text on background: ≥ 4.5:1
- Interactive elements: ≥ 3:1
- Focus indicators: ≥ 3:1

## 📊 Data Visualization

### Chart Colors
Accessible color palette for both themes:
- chart-1: Primary blue
- chart-2: Cyan/Teal
- chart-3: Green
- chart-4: Amber
- chart-5: Red/Rose

### Chart Types
- Line charts: Trends over time
- Bar charts: Comparisons
- Area charts: Volume/magnitude
- Pie/Donut: Parts of whole

## 🔧 CSS Tokens

### Breakpoints
```css
--breakpoint-mobile: 375px
--breakpoint-tablet: 768px
--breakpoint-desktop: 1024px
--breakpoint-wide: 1440px
```

### Layout
```css
--sidebar-width: 240px
--sidebar-collapsed: 64px
--topbar-height: 64px
```

### Elevation
```css
--elevation-0: none
--elevation-1 through --elevation-5
```

### Z-Index
```css
--z-base: 0
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-drawer: 1040
--z-modal-backdrop: 1050
--z-modal: 1060
--z-popover: 1070
--z-tooltip: 1080
--z-toast: 1090
```

## 📚 Documentation

Comprehensive guidelines available at `/guidelines/Guidelines.md` covering:
- Typography rules
- Color system
- Responsive patterns
- Icon specifications
- Form validation
- Keyboard accessibility
- Date picker usage
- Data visualization best practices

## 🧪 Testing Pages

### QA Pages (accessible via user menu)
1. **QA - Component Variants**: All reservation component states
2. **QA - Form Components**: Form validation and input masks demo

## 🛠️ Development

### File Structure
```
/
├── App.tsx                 # Main application
├── components/
│   ├── app-shell.tsx       # Main layout
│   ├── form-field.tsx      # Validated form inputs
│   ├── date-range-picker.tsx
│   ├── use-keyboard-navigation.tsx
│   ├── reservation-bar.tsx
│   ├── reservation-tile.tsx
│   ├── pages/              # Page components
│   └── ui/                 # ShadCN components
├── styles/
│   └── globals.css         # Design tokens & base styles
└── guidelines/
    └── Guidelines.md       # Full design system docs
```

### Key Libraries
- React
- Tailwind CSS v4
- Lucide Icons
- ShadCN/UI components
- date-fns (date utilities)

## 🎯 Best Practices

### DO ✅
- Use semantic HTML elements
- Follow keyboard navigation patterns
- Test in both Light and Dark modes
- Use defined tokens and variables
- Maintain consistent spacing (multiples of 4px)
- Provide alt text for images
- Include loading and error states

### DON'T ❌
- Use arbitrary colors (use tokens)
- Override typography without reason
- Create custom breakpoints
- Skip keyboard accessibility
- Forget contrast ratio testing

## 📖 Usage Examples

### Form with Validation
```tsx
import { FormField, ValidationRules } from './components/form-field';

<FormField
  id="email"
  label="Email"
  value={email}
  onChange={setEmail}
  required
  validationRules={[ValidationRules.email]}
/>
```

### Date Range Selection
```tsx
import { DateRangePicker } from './components/date-range-picker';

<DateRangePicker
  value={range}
  onChange={setRange}
  disabledDates={(date) => date < new Date()}
/>
```

### Keyboard Shortcuts
```tsx
import { useKeyboardShortcuts } from './components/use-keyboard-navigation';

useKeyboardShortcuts([
  {
    key: 'Escape',
    action: () => closeModal(),
    description: 'Close modal',
  },
], isModalOpen);
```

## 🔄 Version

**Version**: 3.0  
**Last Updated**: November 1, 2025  
**Status**: Complete Design System Implementation

## 📄 License

Proprietary - Bmad Method Team

---

For detailed design system guidelines, see `/guidelines/Guidelines.md`
