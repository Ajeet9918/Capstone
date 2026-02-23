# TODO: Make Nova Dustbin App More Functional

## 1. Update common.js
- [x] Fix CSV newline escaping in downloadCsv function.
- [x] Implement theme toggle functionality (dark/light mode).
- [x] Add search functionality for topbar search input (search bins and alerts).
- [x] Implement bins page filters (zone select) and search (binSearch input).
- [x] Add settings save functionality (saveProfile button).
- [x] Implement login/signup persistence using localStorage.
- [x] Add logout functionality.
- [x] Make activity list dynamic (update periodically).
- [x] Add real-time fill level updates simulation.

## 2. Update style.css
- [x] Add dark mode CSS variables.
- [x] Implement dark mode styles for all components.

## 3. Update dashboard.html
- [x] Replace chart placeholder with a simple canvas-based bar chart.
- [x] Replace map placeholder with a simple embedded map (e.g., iframe to Google Maps or static image).

## 4. Add logout buttons to all pages
- [x] Add logout button to topbar on all pages (dashboard, bins, alerts, reports, settings).
- [x] Implement logout functionality for both sidebar and topbar buttons.

## 5. Testing and Verification
- [ ] Test navigation between pages.
- [ ] Verify theme toggle works.
- [ ] Check search and filters on bins page.
- [ ] Ensure CSV download works correctly.
- [ ] Test login/signup persistence and logout.
- [ ] Verify responsiveness on different screen sizes.

## 6. AI/ML Integration
- [x] Implement Predictive Fill Level Forecasting (simulate ML predictions for bin fill levels).
- [ ] Add Anomaly Detection (identify unusual bin fill patterns).
- [ ] Integrate Route Optimization (suggest efficient collection routes).
- [ ] Add Waste Classification (simulate image recognition for waste types).
- [ ] Implement Automated Alert Prioritization (prioritize alerts using simple scoring).
- [ ] Add Demand Forecasting (predict waste generation in zones).
