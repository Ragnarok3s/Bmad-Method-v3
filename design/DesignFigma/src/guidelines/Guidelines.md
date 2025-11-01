# Bmad Method v3 - Design System Guidelines

## Table of Contents

1. [Overview](#overview)
2. [Typography](#typography)
3. [Color System](#color-system)
4. [Responsive Design](#responsive-design)
5. [Iconography](#iconography)
6. [Elevation & Z-Index](#elevation--z-index)
7. [Forms & Validation](#forms--validation)
8. [Keyboard Accessibility](#keyboard-accessibility)
9. [Date Range Picker](#date-range-picker)
10. [Data Visualization](#data-visualization)
11. [Component Guidelines](#component-guidelines)

---

## Overview

Bmad Method v3 is a comprehensive hotel management application with a robust Design System supporting both Light and Dark modes. The system prioritizes accessibility (WCAG 2.1 AA compliance with contrast ≥ 4.5:1), responsiveness, and usability.

### Core Principles

- **Consistency**: All components follow the same patterns and tokens
- **Accessibility**: Keyboard navigation, screen reader support, focus management
- **Responsiveness**: Mobile-first approach with tablet and desktop breakpoints
- **Theme Support**: Seamless Light/Dark mode switching

---

## Typography

### Font Family

**Inter** is the primary typeface for the entire application.

```css
font-family: Inter, system-ui, -apple-system, sans-serif;
```

### Type Scale

Base font size: **16px**

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| h1 | var(--text-2xl) | 500 | 1.5 | Page titles |
| h2 | var(--text-xl) | 500 | 1.5 | Section headers |
| h3 | var(--text-lg) | 500 | 1.5 | Subsection headers |
| h4 | var(--text-base) | 500 | 1.5 | Card titles |
| p, body | var(--text-base) | 400 | 1.5 | Body text |
| label | var(--text-base) | 500 | 1.5 | Form labels |
| button | var(--text-base) | 500 | 1.5 | Button text |

### Guidelines

- **DO NOT** use Tailwind font size classes (text-2xl, text-lg, etc.) unless specifically changing typography
- Typography is automatically applied via `globals.css`
- Use semantic HTML elements (h1, h2, p) instead of styled divs

---

## Color System

### Semantic Tokens

All colors are defined as CSS custom properties with automatic theme switching.

#### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | #F8FAFC | Page background |
| `--surface` | #FFFFFF | Cards, panels |
| `--surface-2` | #F1F5F9 | Hover states |
| `--border` | #E5E7EB | Borders, dividers |
| `--text` | #111827 | Primary text |
| `--text-muted` | #6B7280 | Secondary text |
| `--primary` | #2563EB | Brand color |
| `--accent` | #0EA5E9 | Accent actions |
| `--success` | #10B981 | Success states |
| `--warning` | #F59E0B | Warning states |
| `--danger` | #EF4444 | Error/destructive |
| `--info` | #60A5FA | Info messages |

#### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | #0B1220 | Page background |
| `--surface` | #0F172A | Cards, panels |
| `--surface-2` | #111827 | Hover states |
| `--border` | #1F2937 | Borders |
| `--border-strong` | #273245 | Strong borders |
| `--text` | #E5E7EB | Primary text |
| `--text-muted` | #9CA3AF | Secondary text |
| `--primary` | #2563EB | Brand color |
| `--accent` | #14B8A6 | Accent (teal) |
| `--danger` | #F43F5E | Error (adjusted) |

### Contrast Requirements

- **Text on background**: Minimum 4.5:1
- **Interactive elements**: Minimum 3:1
- **Focus indicators**: Minimum 3:1

### Chart Colors

For data visualization:

**Light Mode:**
- chart-1: #2563EB (Primary blue)
- chart-2: #0EA5E9 (Cyan)
- chart-3: #10B981 (Green)
- chart-4: #F59E0B (Amber)
- chart-5: #EF4444 (Red)

**Dark Mode:**
- chart-1: #2563EB (Primary blue)
- chart-2: #14B8A6 (Teal)
- chart-3: #10B981 (Green)
- chart-4: #F59E0B (Amber)
- chart-5: #F43F5E (Rose)

---

## Responsive Design

### Breakpoints

```css
--breakpoint-mobile: 375px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1440px;
```

### Responsive Patterns

#### Sidebar Behavior

- **Desktop (≥1024px)**: Fixed sidebar at 240px width
- **Tablet/Mobile (<1024px)**: 
  - Collapsed by default
  - Slides in from left with overlay
  - Hamburger menu in TopBar

#### Content Density

- **Desktop**: Comfortable spacing (gap-6, p-6)
- **Tablet**: Compact spacing (gap-4, p-4)
- **Mobile**: Minimal spacing (gap-3, p-3)

#### Grid Layouts

```tsx
// Dashboard KPIs
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

// Two-column layouts
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// Calendar timeline
<div className="hidden lg:block"> // Desktop only
<div className="lg:hidden"> // Mobile only
```

#### Table Responsiveness

- **Desktop**: Full table with all columns
- **Tablet**: Hide less important columns
- **Mobile**: Card-based list view

### Layout Tokens

```css
--sidebar-width: 240px;
--sidebar-collapsed: 64px;
--topbar-height: 64px;
```

---

## Iconography

### Icon System

**Library**: Lucide React (`lucide-react`)

### Icon Specifications

- **Grid**: 24×24px base grid
- **Stroke Width**: 2px (consistent across all icons)
- **Size Scale**:
  - Small: 16px (`h-4 w-4`)
  - Medium: 20px (`h-5 w-5`)
  - Large: 24px (`h-6 w-6`)
  - Extra Large: 32px (`h-8 w-8`)

### Color Application

Icons inherit text color by default:

```tsx
// On primary backgrounds
<Calendar className="h-5 w-5 text-primary-foreground" />

// On surface backgrounds
<Calendar className="h-5 w-5 text-foreground" />

// Muted/secondary
<Calendar className="h-5 w-5 text-muted-foreground" />

// Semantic colors
<Check className="h-4 w-4 text-success" />
<AlertCircle className="h-4 w-4 text-danger" />
```

### Usage Guidelines

- **DO**: Use semantic icons that clearly communicate their purpose
- **DO**: Maintain consistent stroke width (2px)
- **DO**: Pair with labels for accessibility
- **DON'T**: Mix icon styles from different libraries
- **DON'T**: Use icons smaller than 16px

### Common Icons

| Icon | Component | Usage |
|------|-----------|-------|
| LayoutDashboard | `<LayoutDashboard />` | Dashboard navigation |
| Calendar | `<Calendar />` | Calendar, dates |
| FileText | `<FileText />` | Reservations |
| DollarSign | `<DollarSign />` | Payments |
| Users | `<Users />` | Housekeeping |
| Settings | `<Settings />` | Settings |
| Search | `<Search />` | Search functionality |
| Bell | `<Bell />` | Notifications |
| Check | `<Check />` | Success, confirmation |
| AlertCircle | `<AlertCircle />` | Warnings, errors |
| X | `<X />` | Close, cancel |

---

## Elevation & Z-Index

### Shadow System (Elevation)

Defined for both Light and Dark modes:

```css
--elevation-0: none;
--elevation-1: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--elevation-2: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--elevation-3: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--elevation-4: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--elevation-5: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

#### Elevation Usage

| Level | Usage | Example |
|-------|-------|---------|
| 0 | Flat surfaces | Page background |
| 1 | Subtle depth | Card hover states |
| 2 | Cards, panels | Default cards |
| 3 | Raised components | Dropdown menus |
| 4 | Overlays | Modals, dialogs |
| 5 | Highest elements | Tooltips |

### Z-Index Scale

```css
--z-base: 0;           // Default
--z-dropdown: 1000;    // Dropdown menus
--z-sticky: 1020;      // Sticky headers
--z-fixed: 1030;       // Fixed positioning
--z-drawer: 1040;      // Side drawers
--z-modal-backdrop: 1050;  // Modal overlay
--z-modal: 1060;       // Modal content
--z-popover: 1070;     // Popovers
--z-tooltip: 1080;     // Tooltips
--z-toast: 1090;       // Toast notifications
```

#### Z-Index Guidelines

- **Always** use defined tokens, never arbitrary values
- **Layer order**: Base → Dropdowns → Sticky → Fixed → Drawer → Modal → Popover → Tooltip → Toast
- **Backdrop pattern**: Modal backdrop at z-1050, content at z-1060

### Implementation

```tsx
// Using elevation
<div className="shadow-[var(--elevation-2)] rounded-lg">

// Using z-index
<div className="fixed z-[var(--z-modal)]">
```

---

## Forms & Validation

### Form Field Component

Use `<FormField>` for all form inputs with built-in validation.

```tsx
import { FormField, ValidationRules } from './components/form-field';

<FormField
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  required
  helpText="We'll never share your email"
  validationRules={[ValidationRules.email]}
/>
```

### Validation States

| State | Visual | Behavior |
|-------|--------|----------|
| **Default** | Normal border | Before user interaction |
| **Focused** | Primary ring | Active input |
| **Touched** | None | After blur |
| **Valid** | Green border + check icon | Valid input after touch |
| **Invalid** | Red border + error icon | Invalid after touch |
| **Disabled** | Grayed out | Not interactive |

### Validation Patterns

#### Inline Validation

- Validates **on blur** (after user leaves field)
- Shows **immediate feedback** once touched
- Provides **specific error messages**

```tsx
validationRules={[
  ValidationRules.required,
  ValidationRules.email,
  ValidationRules.minLength(8)
]}
```

#### Common Validation Rules

```tsx
// Email
ValidationRules.email

// Phone
ValidationRules.phone

// Length
ValidationRules.minLength(8)
ValidationRules.maxLength(50)

// Pattern
ValidationRules.pattern(/^[A-Z]{2}\d{4}$/, 'Invalid format')
```

### Input Masks

For formatted inputs:

```tsx
import { InputMasks } from './components/form-field';

// Date mask: MM/DD/YYYY
<FormField mask={InputMasks.date} />

// Phone mask: (XXX) XXX-XXXX
<FormField mask={InputMasks.phone} />

// Currency mask: 0.00
<FormField mask={InputMasks.currency} />
```

### Error Display

#### Inline Errors

```tsx
{errors.map((error, index) => (
  <p key={index} className="text-sm text-danger flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    {error}
  </p>
))}
```

#### Form-Level Summary

```tsx
{formErrors.length > 0 && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Please fix the following errors:</AlertTitle>
    <AlertDescription>
      <ul className="list-disc list-inside">
        {formErrors.map((error, i) => (
          <li key={i}>{error}</li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
)}
```

### Help Text & Context

```tsx
<FormField
  helpText="Your password must be at least 8 characters and include a number"
/>
```

Help text appears in a tooltip next to the label.

### Accessibility

- All fields have proper `label` elements
- Error messages use `aria-describedby`
- Invalid fields have `aria-invalid="true"`
- Required fields marked with `*` and `aria-required`

---

## Keyboard Accessibility

### Focus Management

#### Focus Indicators

All focusable elements must have visible focus:

```css
outline-ring/50  /* Defined in base styles */
```

- **Minimum**: 2px ring
- **Color**: Primary color
- **Offset**: 2px from element

#### Focus Order

Tab order follows visual layout:
1. Header actions (search, theme, notifications)
2. Sidebar navigation
3. Main content (top to bottom, left to right)
4. Modals/dialogs (trapped within)

### Keyboard Shortcuts

#### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open global search |
| `Esc` | Close modal/drawer |
| `Tab` | Next focusable element |
| `Shift + Tab` | Previous focusable element |

#### Calendar Navigation

| Shortcut | Action |
|----------|--------|
| `←` | Previous day |
| `→` | Next day |
| `↑` | Previous week |
| `↓` | Next week |
| `Page Up` | Previous month |
| `Page Down` | Next month |
| `Home` | Start of week |
| `End` | End of week |
| `Enter` | Select date |
| `Space` | Select date |

#### Modal/Dialog

| Shortcut | Action |
|----------|--------|
| `Esc` | Close |
| `Tab` | Cycle forward (trapped) |
| `Shift + Tab` | Cycle backward (trapped) |
| `Enter` | Confirm (primary action) |

### Implementation

```tsx
import { useKeyboardShortcuts, KeyboardNavigationPatterns } from './components/use-keyboard-navigation';

// In a modal component
useKeyboardShortcuts([
  KeyboardNavigationPatterns.closeOnEscape(onClose),
  KeyboardNavigationPatterns.confirmOnEnter(onConfirm),
], isOpen);
```

### Focus Trap

For modals and drawers:

```tsx
import { useFocusTrap } from './components/use-keyboard-navigation';

const modalRef = useRef<HTMLDivElement>(null);
useFocusTrap(modalRef, isOpen);
```

---

## Date Range Picker

### Component

```tsx
import { DateRangePicker } from './components/date-range-picker';

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  placeholder="Select date range"
  disabledDates={(date) => date < new Date()}
/>
```

### Features

#### Presets

- **Last 7 days**
- **Last 14 days**
- **Last 30 days**
- **This month**
- **This year**

#### Custom Range

- Dual calendar view (2 months)
- Click to select start date
- Click again to select end date
- Hover shows range preview

#### Visual States

| State | Visual |
|-------|--------|
| **Normal day** | Default text |
| **Hover day** | Background highlight |
| **Selected start/end** | Primary background |
| **In range** | Primary/10 background |
| **Today** | Border highlight |
| **Disabled** | Grayed out, not clickable |
| **Outside month** | Muted text |

#### Timezone Display

Shows current timezone at bottom:
```
Timezone: America/New_York
```

### Keyboard Support

- `Tab` / `Shift+Tab`: Navigate between presets and calendar
- `←` `→` `↑` `↓`: Navigate days
- `Page Up` / `Page Down`: Navigate months
- `Enter` / `Space`: Select date
- `Esc`: Close picker

---

## Data Visualization

### Chart Types

#### Line Charts

**Usage**: Trends over time (occupancy, revenue)

```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis dataKey="date" stroke="var(--text-muted)" />
    <YAxis stroke="var(--text-muted)" />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: 'var(--surface)', 
        border: '1px solid var(--border)' 
      }} 
    />
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke="var(--chart-1)" 
      strokeWidth={2}
    />
  </LineChart>
</ResponsiveContainer>
```

**Guidelines**:
- Line width: 2-3px
- Smooth curves for continuous data
- Straight lines for discrete data
- Show data points on hover

#### Bar Charts

**Usage**: Comparisons (room types, revenue by channel)

```tsx
<BarChart data={data}>
  <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
</BarChart>
```

**Guidelines**:
- Bar spacing: 20% of bar width
- Rounded top corners (4px)
- Start Y-axis at 0 (never truncate)

#### Area Charts

**Usage**: Volume over time with context

```tsx
<AreaChart data={data}>
  <Area 
    type="monotone" 
    dataKey="value" 
    stroke="var(--chart-1)" 
    fill="var(--chart-1)" 
    fillOpacity={0.2}
  />
</AreaChart>
```

**Guidelines**:
- Fill opacity: 10-20%
- Stroke: Full opacity
- Use for showing volume/magnitude

#### Pie/Donut Charts

**Usage**: Parts of a whole (booking sources)

```tsx
<PieChart>
  <Pie 
    data={data} 
    cx="50%" 
    cy="50%" 
    innerRadius={60}  // For donut
    outerRadius={80}
    fill="var(--chart-1)"
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={`var(--chart-${index + 1})`} />
    ))}
  </Pie>
</PieChart>
```

**Guidelines**:
- Max 5-6 segments (group "Others")
- Use donut for cleaner center space
- Show percentages in legend

### Chart Tokens

#### Colors

Use semantic chart colors in order:

```tsx
const chartColors = [
  'var(--chart-1)',  // Primary (blue)
  'var(--chart-2)',  // Secondary (cyan/teal)
  'var(--chart-3)',  // Success (green)
  'var(--chart-4)',  // Warning (amber)
  'var(--chart-5)',  // Danger (red)
];
```

#### Typography

- **Axis labels**: 12px, text-muted-foreground
- **Values**: 14px, text-foreground
- **Legends**: 12px, text-foreground

#### Spacing

- **Chart padding**: 16px
- **Legend gap**: 24px
- **Grid stroke**: 1px dashed

### Tooltips

```tsx
<Tooltip
  contentStyle={{
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: 'var(--elevation-3)',
  }}
  labelStyle={{ color: 'var(--text)', fontWeight: 500 }}
  itemStyle={{ color: 'var(--text-muted)' }}
/>
```

### Contrast in Dark Mode

All chart colors maintain ≥ 4.5:1 contrast against dark backgrounds:
- Adjust opacity if needed
- Use strokes for better visibility
- Test hover states

### Responsive Charts

```tsx
// Always use ResponsiveContainer
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    {/* ... */}
  </LineChart>
</ResponsiveContainer>

// Mobile: Reduce height
<ResponsiveContainer 
  width="100%" 
  height={window.innerWidth < 768 ? 200 : 300}
>
```

---

## Component Guidelines

### ReservationBar

**Usage**: Timeline view in calendar

**Variants**:
- `confirmed`: Primary background
- `pending`: Warning background
- `checked-in`: Success background
- `checked-out`: Muted background
- `cancelled`: Danger background

**Overbooking**:
```tsx
<ReservationBar
  status="confirmed"
  overbooked
  overbookingCount={3}
/>
```

Shows danger badge with count overlay.

### ReservationTile

**Usage**: Grid view in calendar, list items

**Density**:
- `compact`: Minimal padding, smaller text
- `comfortable`: Default spacing

```tsx
<ReservationTile
  density="compact"
  status="confirmed"
/>
```

### Sidebar Navigation

**States**:
- Active: Primary background
- Hover: Accent background
- Default: Transparent

**Badges**:
```tsx
<NavItem badge={5} />  // Shows notification count
```

### Buttons

**Variants**:
- `default`: Primary filled
- `secondary`: Secondary background
- `outline`: Border only
- `ghost`: Transparent
- `destructive`: Danger color

**Sizes**:
- `sm`: Compact (32px height)
- `default`: Standard (40px height)
- `lg`: Large (48px height)
- `icon`: Square (40×40px)

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

### Badges

```tsx
<Badge variant="default">Confirmed</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Overbooked</Badge>
<Badge variant="outline">Guest</Badge>
```

---

## Best Practices

### DO

✅ Use semantic HTML elements  
✅ Follow keyboard navigation patterns  
✅ Maintain consistent spacing (multiples of 4px)  
✅ Test in both Light and Dark modes  
✅ Use defined tokens and variables  
✅ Provide alt text for images  
✅ Include loading and error states  
✅ Make interactive elements ≥ 44×44px  

### DON'T

❌ Use arbitrary colors (use tokens)  
❌ Override typography without reason  
❌ Create custom breakpoints  
❌ Mix icon libraries  
❌ Skip keyboard accessibility  
❌ Use images for text  
❌ Create modal without Esc handler  
❌ Forget to test contrast ratios  

---

## Testing Checklist

- [ ] Component works in Light mode
- [ ] Component works in Dark mode
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1024px+)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader accessible
- [ ] All interactive elements ≥ 44px
- [ ] Text contrast ≥ 4.5:1
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Empty states designed

---

## Resources

- **Figma Design**: [Link to design file]
- **Icons**: [Lucide Icons](https://lucide.dev)
- **Colors**: [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility**: [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version**: 3.0  
**Last Updated**: November 1, 2025  
**Maintained by**: Bmad Method Team
