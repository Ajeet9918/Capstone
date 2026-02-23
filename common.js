// Navigation: menu buttons redirect to pages
document.querySelectorAll('.menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = btn.dataset.page + '.html';
    window.location.href = p;
  });
});

// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const main = document.querySelector('.main');
if (sidebarToggle && sidebar && main) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('sidebar-collapsed');
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

// Mock data generation (for bins/alerts/activity)
const mockBins = Array.from({ length: 20 }).map((_, i) => {
  const fill = Math.floor(Math.random() * 100);
  const fillRate = Math.random() * 5 + 1; // Fill rate per hour (1-6%)
  const predictedFullTime = fill >= 100 ? 0 : Math.max(1, Math.floor((100 - fill) / fillRate));

  // Anomaly detection: simulate unusual patterns
  const isAnomaly = Math.random() < 0.15; // 15% chance of anomaly
  let anomalyType = null;
  if (isAnomaly) {
    const types = ['sudden_spike', 'rapid_drop', 'irregular_pattern', 'sensor_malfunction'];
    anomalyType = types[Math.floor(Math.random() * types.length)];
  }

  // Route optimization: add coordinates and priority
  const coordinates = [
    [40.7128, -74.0060], // Sector 1
    [40.7589, -73.9851], // Sector 2
    [40.7505, -73.9934], // Park Ave
    [40.7282, -73.7949]  // Market Rd
  ][i % 4];
  const priority = fill > 85 ? 3 : fill > 70 ? 2 : 1; // 1=low, 2=medium, 3=high

  return {
    id: 'BIN-' + (1000 + i),
    location: ['Sector 1', 'Sector 2', 'Park Ave', 'Market Rd'][i % 4],
    fill, status: fill > 85 ? 'Critical' : fill > 70 ? 'High' : 'Normal',
    updated: new Date(Date.now() - Math.floor(Math.random() * 7200000)).toLocaleString(),
    fillRate,
    predictedFullTime,
    predictedFullDate: new Date(Date.now() + predictedFullTime * 60 * 60 * 1000).toLocaleString(),
    isAnomaly,
    anomalyType,
    coordinates,
    priority
  }
});

// Zone management
let zones = ['Sector 1', 'Sector 2', 'Park Ave', 'Market Rd'];
const zoneList = document.getElementById('zoneList');
const newZoneName = document.getElementById('newZoneName');
const addZone = document.getElementById('addZone');

function renderZones() {
  if (zoneList) {
    zoneList.innerHTML = '';
    zones.forEach(zone => {
      const tag = document.createElement('div');
      tag.className = 'zone-tag';
      tag.innerHTML = `${zone}<span class="remove" data-zone="${zone}">×</span>`;
      zoneList.appendChild(tag);
    });
  }
}

if (addZone && newZoneName) {
  addZone.addEventListener('click', () => {
    const zoneName = newZoneName.value.trim();
    if (zoneName && !zones.includes(zoneName)) {
      zones.push(zoneName);
      newZoneName.value = '';
      renderZones();
      updateZoneFilter();
      alert('Zone added successfully!');
    } else if (zones.includes(zoneName)) {
      alert('Zone already exists!');
    } else {
      alert('Please enter a zone name!');
    }
  });

  newZoneName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addZone.click();
  });
}

if (zoneList) {
  zoneList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
      const zoneName = e.target.dataset.zone;
      if (confirm(`Remove zone "${zoneName}"?`)) {
        zones = zones.filter(z => z !== zoneName);
        renderZones();
        updateZoneFilter();
      }
    }
  });
}

function updateZoneFilter() {
  const filterZone = document.getElementById('filterZone');
  if (filterZone) {
    const currentValue = filterZone.value;
    filterZone.innerHTML = '<option value="">All Zones</option>';
    zones.forEach(zone => {
      const option = document.createElement('option');
      option.value = zone;
      option.textContent = zone;
      filterZone.appendChild(option);
    });
    filterZone.value = currentValue;
  }
}

// Populate bins table if present
const tbody = document.getElementById('binsTbody');
if (tbody) {
  function renderBins(bins = mockBins) {
    tbody.innerHTML = '';
    bins.forEach(b => {
      const tr = document.createElement('tr');
      const predictionText = b.fill >= 100 ? 'Full' : `${b.predictedFullTime}h (${b.predictedFullDate})`;
      const anomalyText = b.isAnomaly ? `<span class="badge anomaly">${b.anomalyType.replace('_', ' ')}</span>` : 'Normal';
      tr.innerHTML = `<td>${b.id}</td><td>${b.location}</td><td>${b.fill}%</td><td><span class="badge">${b.status}</span></td><td>${b.updated}</td><td>${predictionText}</td><td>${anomalyText}</td><td><div class="bin-actions"><button class="edit" data-id="${b.id}">✏️</button><button class="delete" data-id="${b.id}">🗑️</button></div></td>`;
      tbody.appendChild(tr);
    });
  }
  renderBins();

  // Bins search and filter
  const filterZone = document.getElementById('filterZone');
  const binSearch = document.getElementById('binSearch');
  if (filterZone && binSearch) {
    function filterBins() {
      let filtered = mockBins;
      if (filterZone.value) {
        filtered = filtered.filter(b => b.location.includes(filterZone.value));
      }
      if (binSearch.value) {
        filtered = filtered.filter(b => b.id.toLowerCase().includes(binSearch.value.toLowerCase()) || b.location.toLowerCase().includes(binSearch.value.toLowerCase()));
      }
      renderBins(filtered);
    }
    filterZone.addEventListener('change', filterBins);
    binSearch.addEventListener('input', filterBins);
  }

  // Bin actions
  tbody.addEventListener('click', (e) => {
    const binId = e.target.dataset.id;
    if (e.target.classList.contains('edit')) {
      showBinModal('edit', binId);
    } else if (e.target.classList.contains('delete')) {
      if (confirm(`Delete bin ${binId}?`)) {
        // In a real app, this would make an API call
        alert(`Bin ${binId} deleted (demo)`);
      }
    }
  });
}

// Add bin functionality
const addBin = document.getElementById('addBin');
if (addBin) {
  addBin.addEventListener('click', () => {
    showBinModal('add');
  });
}

// Modal functionality
function showBinModal(mode, binId = null) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('binModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'binModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Add Bin</h3>
          <span class="modal-close">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="binId">Bin ID</label>
            <input type="text" id="binId" placeholder="e.g., BIN-1020">
          </div>
          <div class="form-group">
            <label for="binLocation">Location/Zone</label>
            <select id="binLocation">
              <option value="">Select Zone</option>
            </select>
          </div>
          <div class="form-group">
            <label for="binFill">Fill Level (%)</label>
            <input type="number" id="binFill" min="0" max="100" placeholder="0-100">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancelBin">Cancel</button>
          <button class="btn-primary" id="saveBin">Save Bin</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Populate zones in modal
    const binLocation = document.getElementById('binLocation');
    zones.forEach(zone => {
      const option = document.createElement('option');
      option.value = zone;
      option.textContent = zone;
      binLocation.appendChild(option);
    });

    // Modal event listeners
    const modalClose = document.getElementById('modal-close');
    if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('show'));
    const cancelBin = document.getElementById('cancelBin');
    if (cancelBin) cancelBin.addEventListener('click', () => modal.classList.remove('show'));
    document.getElementById('saveBin').addEventListener('click', () => {
      const id = document.getElementById('binId').value;
      const location = document.getElementById('binLocation').value;
      const fill = parseInt(document.getElementById('binFill').value) || 0;

      if (!id || !location) {
        alert('Please fill in all fields!');
        return;
      }

      // In a real app, this would make an API call
      alert(`${mode === 'add' ? 'Added' : 'Updated'} bin ${id} (demo)`);
      modal.classList.remove('show');
    });
  }

  // Set modal title and populate fields for edit
  const modalTitle = document.getElementById('modalTitle');
  if (mode === 'edit' && binId) {
    modalTitle.textContent = 'Edit Bin';
    const bin = mockBins.find(b => b.id === binId);
    if (bin) {
      document.getElementById('binId').value = bin.id;
      document.getElementById('binLocation').value = bin.location;
      document.getElementById('binFill').value = bin.fill;
    }
  } else {
    modalTitle.textContent = 'Add Bin';
    document.getElementById('binId').value = '';
    document.getElementById('binLocation').value = '';
    document.getElementById('binFill').value = '';
  }

  modal.classList.add('show');
}

// Initialize zones on page load
if (zoneList) {
  renderZones();
  updateZoneFilter();
}

// Populate alerts container
const alertsContainer = document.getElementById('alertsContainer');
if (alertsContainer) {
  renderAlerts();
}

// Populate activity list
const act = document.getElementById('activityList');
if (act) {
  ['User A acknowledged BIN-1001', 'BIN-1004 level changed to 62%', 'Scheduled emptying for BIN-1007'].forEach(x => { const li = document.createElement('li'); li.textContent = x; act.appendChild(li) });
}

// CSV download on reports page
const dl = document.getElementById('downloadCsv');
if (dl) {
  dl.addEventListener('click', () => {
    let csv = 'id,location,fill,status,updated,predicted_full_time,predicted_full_date\n';
    mockBins.forEach(b => csv += `${b.id},${b.location},${b.fill},${b.status},${b.updated},${b.predictedFullTime}h,${b.predictedFullDate}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bins-report.csv'; a.click(); URL.revokeObjectURL(a.href);
  });
}

// Settings save functions
const saveProfile = document.getElementById('saveProfile');
if (saveProfile) {
  const adminName = document.getElementById('adminName');
  const adminEmail = document.getElementById('adminEmail');
  const adminPhone = document.getElementById('adminPhone');
  const adminRole = document.getElementById('adminRole');
  if (adminName && adminEmail) {
    adminName.value = localStorage.getItem('adminName') || 'Ajeet Kumar';
    adminEmail.value = localStorage.getItem('adminEmail') || 'you@example.com';
    adminPhone.value = localStorage.getItem('adminPhone') || '';
    adminRole.value = localStorage.getItem('adminRole') || 'admin';
    saveProfile.addEventListener('click', () => {
      localStorage.setItem('adminName', adminName.value);
      localStorage.setItem('adminEmail', adminEmail.value);
      localStorage.setItem('adminPhone', adminPhone.value);
      localStorage.setItem('adminRole', adminRole.value);
      alert('Profile saved successfully!');
    });
  }
}

const saveNotifications = document.getElementById('saveNotifications');
if (saveNotifications) {
  const emailAlerts = document.getElementById('emailAlerts');
  const smsAlerts = document.getElementById('smsAlerts');
  const pushAlerts = document.getElementById('pushAlerts');
  const alertThreshold = document.getElementById('alertThreshold');
  if (emailAlerts && smsAlerts && pushAlerts && alertThreshold) {
    emailAlerts.checked = localStorage.getItem('emailAlerts') !== 'false';
    smsAlerts.checked = localStorage.getItem('smsAlerts') === 'true';
    pushAlerts.checked = localStorage.getItem('pushAlerts') !== 'false';
    alertThreshold.value = localStorage.getItem('alertThreshold') || '85';
    saveNotifications.addEventListener('click', () => {
      localStorage.setItem('emailAlerts', emailAlerts.checked);
      localStorage.setItem('smsAlerts', smsAlerts.checked);
      localStorage.setItem('pushAlerts', pushAlerts.checked);
      localStorage.setItem('alertThreshold', alertThreshold.value);
      alert('Notification settings saved!');
    });
  }
}

const saveSystem = document.getElementById('saveSystem');
if (saveSystem) {
  const refreshInterval = document.getElementById('refreshInterval');
  const timezone = document.getElementById('timezone');
  const autoBackup = document.getElementById('autoBackup');
  if (refreshInterval && timezone && autoBackup) {
    refreshInterval.value = localStorage.getItem('refreshInterval') || '10';
    timezone.value = localStorage.getItem('timezone') || 'PST';
    autoBackup.checked = localStorage.getItem('autoBackup') !== 'false';
    saveSystem.addEventListener('click', () => {
      localStorage.setItem('refreshInterval', refreshInterval.value);
      localStorage.setItem('timezone', timezone.value);
      localStorage.setItem('autoBackup', autoBackup.checked);
      alert('System settings saved!');
    });
  }
}

// Account actions
const changePassword = document.getElementById('changePassword');
if (changePassword) {
  changePassword.addEventListener('click', () => {
    alert('Change password functionality would open a modal or redirect to password change page.');
  });
}

const exportData = document.getElementById('exportData');
if (exportData) {
  exportData.addEventListener('click', () => {
    alert('Data export functionality would generate and download user data.');
  });
}

const deleteAccount = document.getElementById('deleteAccount');
if (deleteAccount) {
  deleteAccount.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion would require additional confirmation and processing.');
    }
  });
}

// Logout
const logout = document.getElementById('logout');
if (logout) {
  logout.addEventListener('click', () => {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
  });
}

// Top logout button
const logoutTop = document.getElementById('logoutTop');
if (logoutTop) {
  logoutTop.addEventListener('click', () => {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
  });
}

// Login/signup persistence
const doLogin = document.getElementById('doLogin');
if (doLogin) doLogin.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  if (email && pass) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);
    alert('Demo login successful');
    window.location.href = 'dashboard.html';
  } else {
    alert('Please enter email and password');
  }
});
const doSignup = document.getElementById('doSignup');
if (doSignup) doSignup.addEventListener('click', () => {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;
  if (name && email && pass) {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    alert('Demo signup complete');
    window.location.href = 'login.html';
  } else {
    alert('Please fill all fields');
  }
});

// Check login on dashboard
if (window.location.pathname.includes('dashboard.html') && !localStorage.getItem('loggedIn')) {
  window.location.href = 'login.html';
}

// Topbar search
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    // Simple search: highlight bins or alerts matching query
    // For demo, just log or alert
    if (query) {
      const matchingBins = mockBins.filter(b => b.id.toLowerCase().includes(query) || b.location.toLowerCase().includes(query));
      if (matchingBins.length) {
        alert(`Found ${matchingBins.length} bins matching "${query}"`);
      }
    }
  });
}

// Simple chart for fill levels
const fillChartCanvas = document.getElementById('fillChart');
if (fillChartCanvas) {
  const ctx = fillChartCanvas.getContext('2d');
  const fillLevels = mockBins.map(b => b.fill);
  const labels = mockBins.map(b => b.id);
  // Simple bar chart
  const barWidth = 20;
  const gap = 10;
  const startX = 20;
  let x = startX;
  fillLevels.forEach((fill, i) => {
    const height = (fill / 100) * 140;
    ctx.fillStyle = fill > 85 ? '#dc2626' : fill > 70 ? '#f59e0b' : '#10b981';
    ctx.fillRect(x, 160 - height, barWidth, height);
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.fillText(labels[i], x, 175);
    x += barWidth + gap;
  });
}

// Dynamic activity updates
setInterval(() => {
  const act = document.getElementById('activityList');
  if (act) {
    const activities = [
      'User A acknowledged BIN-1001',
      'BIN-1004 level changed to 62%',
      'Scheduled emptying for BIN-1007',
      'New bin BIN-1020 added',
      'Alert resolved for BIN-1002'
    ];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const li = document.createElement('li');
    li.textContent = randomActivity;
    act.appendChild(li);
    if (act.children.length > 5) act.removeChild(act.firstChild);
  }
}, 10000); // Update every 10 seconds

// Alerts page functionality
const alertFilter = document.getElementById('alertFilter');
const alertSearch = document.getElementById('alertSearch');
const refreshAlerts = document.getElementById('refreshAlerts');
const clearAllAlerts = document.getElementById('clearAllAlerts');
const criticalCount = document.getElementById('criticalCount');
const highCount = document.getElementById('highCount');
const normalCount = document.getElementById('normalCount');
const totalAlerts = document.getElementById('totalAlerts');

function renderAlerts(filter = 'all', search = '') {
  if (!alertsContainer) return;
  const allAlerts = mockBins.filter(b => b.status !== 'Normal');
  let filtered = allAlerts;
  if (filter === 'critical') filtered = filtered.filter(b => b.status === 'Critical');
  else if (filter === 'high') filtered = filtered.filter(b => b.status === 'High');
  else if (filter === 'normal') filtered = filtered.filter(b => b.status === 'Normal');
  if (search) {
    filtered = filtered.filter(b => b.id.toLowerCase().includes(search.toLowerCase()) || b.location.toLowerCase().includes(search.toLowerCase()));
  }
  alertsContainer.innerHTML = '';
  if (filtered.length === 0) {
    alertsContainer.innerHTML = '<div class="card">No alerts matching criteria</div>';
  } else {
    filtered.forEach(c => {
      const div = document.createElement('div');
      div.className = `alert-item ${c.status.toLowerCase()}`;
      div.innerHTML = `
        <div class="alert-content">
          <div class="alert-title">${c.id} at ${c.location}</div>
          <div class="alert-details">Fill level: ${c.fill}% — ${c.updated}</div>
        </div>
        <div class="alert-actions">
          <button class="acknowledge">Acknowledge</button>
          <button class="dismiss">Dismiss</button>
        </div>
      `;
      alertsContainer.appendChild(div);
    });
  }
  // Update counts
  if (criticalCount) criticalCount.textContent = mockBins.filter(b => b.status === 'Critical').length;
  if (highCount) highCount.textContent = mockBins.filter(b => b.status === 'High').length;
  if (normalCount) normalCount.textContent = mockBins.filter(b => b.status === 'Normal').length;
  if (totalAlerts) totalAlerts.textContent = allAlerts.length;
}

if (alertFilter && alertSearch) {
  function filterAlerts() {
    renderAlerts(alertFilter.value, alertSearch.value);
  }
  alertFilter.addEventListener('change', filterAlerts);
  alertSearch.addEventListener('input', filterAlerts);
}

if (refreshAlerts) {
  refreshAlerts.addEventListener('click', () => {
    renderAlerts(alertFilter ? alertFilter.value : 'all', alertSearch ? alertSearch.value : '');
  });
}

if (clearAllAlerts) {
  clearAllAlerts.addEventListener('click', () => {
    if (confirm('Clear all alerts?')) {
      // In a real app, clear alerts
      alert('Alerts cleared (demo)');
      renderAlerts();
    }
  });
}

// Reports page functionality
const reportType = document.getElementById('reportType');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const reportFormat = document.getElementById('reportFormat');
const zoneFilter = document.getElementById('zoneFilter');
const generateReport = document.getElementById('generateReport');
const emailReport = document.getElementById('emailReport');
const scheduleReport = document.getElementById('scheduleReport');
const viewScheduled = document.getElementById('viewScheduled');
const reportPreview = document.getElementById('reportPreview');

if (generateReport) {
  generateReport.addEventListener('click', () => {
    if (!reportPreview) return;
    let content = '<div class="report-summary"><h4>Report Generated</h4><p>Type: ' + (reportType ? reportType.value : 'Bins') + '</p><p>Format: ' + (reportFormat ? reportFormat.value : 'CSV') + '</p></div>';
    content += '<table class="report-table"><thead><tr><th>ID</th><th>Location</th><th>Fill</th><th>Status</th><th>Predicted Full</th></tr></thead><tbody>';
    mockBins.forEach(b => {
      const predictionText = b.fill >= 100 ? 'Full' : `${b.predictedFullTime}h`;
      content += `<tr><td>${b.id}</td><td>${b.location}</td><td>${b.fill}%</td><td>${b.status}</td><td>${predictionText}</td></tr>`;
    });
    content += '</tbody></table>';
    reportPreview.innerHTML = content;
  });
}

if (emailReport) {
  emailReport.addEventListener('click', () => {
    alert('Report emailed (demo)');
  });
}

if (scheduleReport) {
  scheduleReport.addEventListener('click', () => {
    alert('Report scheduled (demo)');
  });
}

if (viewScheduled) {
  viewScheduled.addEventListener('click', () => {
    alert('Viewing scheduled reports (demo)');
  });
}

// Update zone filter in reports
if (zoneFilter) {
  zoneFilter.innerHTML = '<option value="all">All Zones</option>';
  zones.forEach(zone => {
    const option = document.createElement('option');
    option.value = zone;
    option.textContent = zone;
    zoneFilter.appendChild(option);
  });
}

// Route optimization function
function optimizeRoute(bins) {
  // Simple priority-based sorting simulation
  const highPriority = bins.filter(b => b.priority === 3).sort((a, b) => b.fill - a.fill);
  const mediumPriority = bins.filter(b => b.priority === 2).sort((a, b) => b.fill - a.fill);
  const lowPriority = bins.filter(b => b.priority === 1).sort((a, b) => b.fill - a.fill);

  return [...highPriority, ...mediumPriority, ...lowPriority];
}

// Populate prediction summary on dashboard
const predictionSummary = document.getElementById('predictionSummary');
if (predictionSummary) {
  const criticalBins = mockBins.filter(b => b.status === 'Critical').length;
  const highBins = mockBins.filter(b => b.status === 'High').length;
  const urgentBins = mockBins.filter(b => b.predictedFullTime <= 24 && b.predictedFullTime > 0).length;
  const anomalyBins = mockBins.filter(b => b.isAnomaly).length;
  const optimizedRoute = optimizeRoute(mockBins.filter(b => b.fill > 50)); // Only bins needing attention

  predictionSummary.innerHTML = `
    <p><strong>Critical Bins:</strong> ${criticalBins}</p>
    <p><strong>High Priority Bins:</strong> ${highBins}</p>
    <p><strong>Bins filling within 24h:</strong> ${urgentBins}</p>
    <p><strong>Anomalous Bins:</strong> ${anomalyBins}</p>
    <p><strong>Optimized Route:</strong> ${optimizedRoute.slice(0, 5).map(b => b.id).join(' → ')}${optimizedRoute.length > 5 ? '...' : ''}</p>
  `;
}
