# Nova Dustbin - Smart Waste Management System

## Overview
Nova Dustbin is a dashboard for monitoring smart waste bins. It visualizes fill levels, alerts, and report generation in a responsive web interface. The application simulates a real-time IoT environment with mock data and AI/ML predictions.

## Features
- **Dashboard**: Real-time overview of bin stats, fill levels (chart), recent activity, and map.
- **Bins Management**: View, filter, and search bins. Add new bins and manage zones.
- **Alerts System**: Monitor critical and high-priority bin statuses with acknowledge/dismiss actions.
- **Reports**: Generate CSV/JSON reports for bins, alerts, and activity logs.
- **Settings**: Configure admin profile, notification preferences, and system settings.
- **Theme Support**: Toggle between Light and Dark modes.
- **Mock AI Integration**: 
  - Predictive fill time forecasting.
  - Anomaly detection simulation.
  - Route optimization logic.

## Technical Details
- **Stack**: Pure HTML5, CSS3, and Vanilla JavaScript.
- **Data Persistence**: Uses `localStorage` to save settings, login state, and theme preference.
- **Single Script Architecture**: `common.js` handles logic for all pages, initializing components based on the current page context.

## How to Run
1. Open `login.html` in any modern web browser.
2. **Login**: 
   - Email: `any@example.com` (or use the default placeholder)
   - Password: `any`
   - *Note: Login is simulated.*
3. Navigate using the sidebar to explore different modules.

## File Structure
- `login.html`: Entry point.
- `dashboard.html`: Main analytics view.
- `bins.html`: Inventory management.
- `alerts.html`: Notification center.
- `reports.html`: Data export.
- `settings.html`: User configuration.
- `common.js`: Core application logic.
- `style.css`: Global styles and themes.
- `common.js`: Contains logic for all pages (charts, filtering, modals).
