# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based **Stock Vesting Calculator** (Calculadora de Vesting de Acciones) - an interactive web application that calculates and visualizes stock vesting progress over time with a dynamic timeline. The application is written in Spanish and provides real-time visualization of stock grants, vesting schedules, and progress tracking.

## Common Development Commands

### Development Workflow
```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:3000)
npm start

# Build for production
npm build

# Run tests (if any are added)
npm test

# Eject from Create React App (irreversible)
npm eject
```

### Testing Single Components
Since this uses Create React App, you can test individual components by:
```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file (when tests exist)
npm test -- --testNamePattern="ComponentName"
```

## Architecture Overview

### Core Structure
- **React 18** application built with Create React App
- **Component-based architecture** with separation of concerns
- **Chart.js + react-chartjs-2** for interactive data visualization
- **date-fns** for date calculations
- **Responsive design** optimized for desktop and mobile

### Key Components

#### VestingCalculator (`src/utils/VestingCalculator.js`)
The central business logic class that handles:
- **Grant calculation**: Automatic stock grants in August of each year
- **Vesting logic**: Processes vesting in February and August (configurable)
- **State tracking**: Maintains stock batches per grant year with individual vesting schedules
- **Data generation**: Creates month-by-month data for visualization

**Key Algorithm**: Each grant year creates a separate batch that vests 1 stock per vesting period (Feb/Aug) until depleted.

#### Timeline Component (`src/components/Timeline.js`)
Interactive visualization component featuring:
- **Mixed chart display**: Line charts for cumulative data + bar charts for monthly events
- **Dual y-axis**: Left for total stocks, right for grants/vests per month
- **Interactive controls**: Clickable chart points, slider navigation, and button controls
- **Event indicators**: Visual markers for grant months and vest months
- **Progress tracking**: Real-time percentage calculation of vested stocks

#### App Component (`src/App.js`)
Main application coordinator that:
- **State management**: Handles configuration and timeline state
- **Data flow**: Coordinates between VestingCalculator and Timeline
- **UI layout**: Grid-based responsive design (configuration panel + timeline)
- **Configuration interface**: Real-time parameter adjustment

### Data Flow Architecture
1. **Config Change** → `VestingCalculator` → **Data Calculation**
2. **Calculated Data** → `Timeline` → **Chart Rendering**  
3. **User Interaction** → **Month Navigation** → **Data Update**

### Default Configuration Logic
- **Grant Schedule**: August of each year (month 8)
- **Vesting Schedule**: February (month 2) and August (month 8) 
- **Vesting Rule**: 1 stock vests per batch per vesting period
- **Default Term**: 5 years (60 months)
- **Default Grant Amount**: 10 stocks per August

## File Organization

```
src/
├── components/
│   ├── Timeline.js          # Main visualization component
│   └── Timeline.css         # Timeline-specific styling
├── utils/
│   └── VestingCalculator.js # Core business logic
├── App.js                   # Main application component
├── App.css                  # Application layout and styling
├── index.js                 # React entry point
└── index.css               # Global styles and CSS reset
```

## Key Dependencies and Their Roles

- **react**: ^18.2.0 - Core framework
- **chart.js**: ^4.4.0 - Charting engine for data visualization
- **react-chartjs-2**: ^5.2.0 - React wrapper for Chart.js
- **date-fns**: ^2.30.0 - Date manipulation utilities (currently minimal usage)

## Configuration Customization

### Modifying Vesting Logic
To change the vesting schedule, update the `VestingCalculator` constructor:
```javascript
this.mesesVest = [2, 8]; // Current: February and August
// Example alternatives:
// this.mesesVest = [6, 12]; // June and December
// this.mesesVest = [3, 6, 9, 12]; // Quarterly vesting
```

### Chart Color Customization
Chart colors are defined in `Timeline.js` within the `chartData.datasets` arrays:
- **Total Stocks**: Blue (`rgb(59, 130, 246)`)
- **Vested Stocks**: Green (`rgb(34, 197, 94)`)
- **Grants**: Purple (`rgba(168, 85, 247, 0.7)`)
- **Vests**: Red (`rgba(245, 101, 101, 0.7)`)

### Styling Architecture
- **App.css**: Global layout, gradient backgrounds, responsive grid system
- **Timeline.css**: Component-specific styling, chart container, controls
- **index.css**: CSS reset and base styles
- **Design System**: Uses consistent color palette and spacing scale

## Development Notes

### React Patterns Used
- **Functional components** with hooks (useState, useEffect, useRef)
- **Props drilling** for data flow (no context or state management library)
- **Controlled components** for form inputs
- **Effect synchronization** for chart updates

### Chart.js Integration
- **Mixed chart types** (line + bar) in single visualization  
- **Custom tooltips** with Spanish labels and event indicators
- **Interactive click handling** for month navigation
- **Responsive configuration** with maintainAspectRatio: false

### Responsive Design Strategy
- **CSS Grid** for main layout (2fr grid on desktop, single column on mobile)
- **Flexbox** for component internal layouts
- **Sticky positioning** for configuration panel (desktop only)
- **Viewport-based scaling** for fonts and spacing

### State Management Pattern
The app uses a simple state pattern:
- **Configuration state** drives all calculations
- **Current month state** controls timeline position
- **Calculated data** is derived and cached via useEffect
- **No external state management** (Redux, Zustand) needed due to simplicity

## Language and Localization

This application is built in **Spanish**:
- UI labels and messages are in Spanish
- Month names use Spanish formatting
- Comments in code mix Spanish variable names with English technical terms
- Consider this when making modifications or adding features

## Browser Compatibility

Optimized for modern browsers with the following browserslist configuration:
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Latest Chrome, Firefox, and Safari versions