'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  MenuItem,
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import {
  saveConfig,
  getConfig,
  getOverview,
  getSummary,
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  testAlert,
} from 'src/lib/analytics-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

// ----------------------------------------------------------------------

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function MetricCard({ title, value, subtitle, color = 'primary' }) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" color={`${color}.main`}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState(7);
  
  const [config, setConfig] = useState({
    ga4PropertyId: '',
    gscSiteUrl: '',
  });

  const [metrics, setMetrics] = useState([]);
  const [isMockData, setIsMockData] = useState(true);
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [alertEvents, setAlertEvents] = useState([]);
  const [alertForm, setAlertForm] = useState({
    name: 'Traffic drop alert',
    type: 'traffic_drop',
    threshold: 30,
    windowDays: 7,
    channel: 'in_app',
    active: true,
  });
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertTestResult, setAlertTestResult] = useState(null);

  const activeCompanyId = getActiveCompanyIdFromCookie();

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }

    loadData();
  }, [activeCompanyId, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configData, overviewData, summaryData, alertsPayload] = await Promise.all([
        getConfig(activeCompanyId),
        getOverview(activeCompanyId, dateRange),
        getSummary(activeCompanyId),
        listAlerts(activeCompanyId),
      ]);
      
      if (configData) {
        setConfig({
          ga4PropertyId: configData.ga4PropertyId || '',
          gscSiteUrl: configData.gscSiteUrl || '',
        });
      }

      setMetrics(overviewData.metrics || []);
      setIsMockData(overviewData.isMockData || false);
      setSummary(summaryData || null);
      setAlerts(alertsPayload.rules || []);
      setAlertEvents(alertsPayload.events || []);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field) => (event) => {
    setConfig((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setSuccess(false);
  };

  const handleSaveConfig = async (event) => {
    event.preventDefault();
    
    if (!activeCompanyId) {
      setError('No active company selected');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await saveConfig(activeCompanyId, config);
      
      setSuccess(true);
    } catch (err) {
      console.error('Failed to save config:', err);
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleAlertFormChange = (field) => (event) => {
    setAlertForm((prev) => ({
      ...prev,
      [field]:
        field === 'threshold' || field === 'windowDays'
          ? Number(event.target.value)
          : event.target.value,
    }));
    setAlertTestResult(null);
  };

  const handleCreateAlert = async () => {
    if (!activeCompanyId) return;
    try {
      setAlertLoading(true);
      await createAlert(activeCompanyId, alertForm);
      const payload = await listAlerts(activeCompanyId);
      setAlerts(payload.rules || []);
      setAlertEvents(payload.events || []);
      setAlertTestResult(null);
      setAlertForm((prev) => ({ ...prev, name: `${prev.name} (copy)` }));
    } catch (err) {
      setError(err.message || 'Failed to create alert');
    } finally {
      setAlertLoading(false);
    }
  };

  const handleToggleAlert = async (rule) => {
    if (!activeCompanyId) return;
    try {
      await updateAlert(activeCompanyId, rule._id || rule.id, { active: !rule.active });
      const payload = await listAlerts(activeCompanyId);
      setAlerts(payload.rules || []);
      setAlertEvents(payload.events || []);
    } catch (err) {
      setError(err.message || 'Failed to update alert');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!activeCompanyId) return;
    try {
      await deleteAlert(activeCompanyId, alertId);
      const payload = await listAlerts(activeCompanyId);
      setAlerts(payload.rules || []);
      setAlertEvents(payload.events || []);
    } catch (err) {
      setError(err.message || 'Failed to delete alert');
    }
  };

  const handleTestAlert = async () => {
    if (!activeCompanyId) return;
    try {
      setAlertLoading(true);
      const result = await testAlert(activeCompanyId, alertForm);
      setAlertTestResult(result);
    } catch (err) {
      setAlertTestResult({ triggered: false, preview: null, error: err.message });
    } finally {
      setAlertLoading(false);
    }
  };

  // Calculate summary metrics
  const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
  const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
  const avgCtr = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + (parseFloat(m.ctr) || 0), 0) / metrics.length).toFixed(2)
    : '0.00';
  const avgPosition = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + (parseFloat(m.position) || 0), 0) / metrics.length).toFixed(1)
    : '0.0';

  const latestMetric = metrics[metrics.length - 1] || {};
  const indexedPages = latestMetric.indexedPages || 0;
  const excludedPages = latestMetric.excludedPages || 0;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3} sx={{ py: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h4">Analytics Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor drafts, QA pass rate, indexed pages, traffic trends, and proactive alerts per tenant.
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Analytics configuration saved successfully!
          </Alert>
        )}

        {isMockData && (
          <Alert severity="info">
            Displaying mock data. Configure GA4 and GSC to see real analytics.
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Alerts" />
            <Tab label="Integrations" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={3}>
            {summary && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Drafts"
                    value={(summary.drafts?.draft || 0).toLocaleString()}
                    subtitle="Total drafts"
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Ready"
                    value={(summary.drafts?.ready_for_publish || 0).toLocaleString()}
                    subtitle="Ready to ship"
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="QA Pass %"
                    value={`${summary.qaPassRate?.toFixed?.(1) ?? summary.qaPassRate ?? 0}%`}
                    subtitle="Pass rate"
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Indexed pages"
                    value={(summary.indexedPages || 0).toLocaleString()}
                    subtitle="Reported by GSC"
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Core Web Vitals
                    </Typography>
                    <Typography variant="body2">
                      LCP: {summary.cwvSnapshot?.lcp ?? '—'}s
                    </Typography>
                    <Typography variant="body2">
                      CLS: {summary.cwvSnapshot?.cls ?? '—'}
                    </Typography>
                    <Typography variant="body2">
                      FID: {summary.cwvSnapshot?.fid ?? '—'}ms
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Date Range Selector */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={dateRange === 7 ? 'contained' : 'outlined'}
                onClick={() => handleDateRangeChange(7)}
              >
                Last 7 Days
              </Button>
              <Button
                variant={dateRange === 30 ? 'contained' : 'outlined'}
                onClick={() => handleDateRangeChange(30)}
              >
                Last 30 Days
              </Button>
              <Button
                variant={dateRange === 90 ? 'contained' : 'outlined'}
                onClick={() => handleDateRangeChange(90)}
              >
                Last 90 Days
              </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Total Impressions"
                  value={totalImpressions.toLocaleString()}
                  subtitle={`Last ${dateRange} days`}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Total Clicks"
                  value={totalClicks.toLocaleString()}
                  subtitle={`Last ${dateRange} days`}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Average CTR"
                  value={`${avgCtr}%`}
                  subtitle="Click-through rate"
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Avg Position"
                  value={avgPosition}
                  subtitle="Search ranking"
                  color="warning"
                />
              </Grid>
            </Grid>

            {/* Metrics Table */}
            <Card>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">Daily Metrics</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Impressions</TableCell>
                      <TableCell align="right">Clicks</TableCell>
                      <TableCell align="right">CTR</TableCell>
                      <TableCell align="right">Position</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      metrics.map((metric, index) => (
                        <TableRow key={index}>
                          <TableCell>{metric.date}</TableCell>
                          <TableCell align="right">{metric.impressions.toLocaleString()}</TableCell>
                          <TableCell align="right">{metric.clicks.toLocaleString()}</TableCell>
                          <TableCell align="right">{metric.ctr}%</TableCell>
                          <TableCell align="right">{metric.position}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Index Coverage */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Index Coverage
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Indexed Pages
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {indexedPages}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Excluded Pages
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {excludedPages}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alert Rules
              </Typography>
              {alerts.length === 0 ? (
                <Alert severity="info">No alerts yet. Create one below.</Alert>
              ) : (
                <Stack spacing={2}>
                  {alerts.map((rule) => (
                    <Card
                      key={rule._id || rule.id}
                      variant="outlined"
                      sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">{rule.name}</Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={rule.type.replace('_', ' ')}
                            size="small"
                            color="primary"
                          />
                          <Chip
                            label={rule.active ? 'Active' : 'Paused'}
                            size="small"
                            color={rule.active ? 'success' : 'default'}
                          />
                        </Stack>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Threshold: {rule.threshold} | Window: {rule.windowDays}d | Channel:{' '}
                        {rule.channel}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleToggleAlert(rule)}
                        >
                          {rule.active ? 'Pause' : 'Activate'}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteAlert(rule._id || rule.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                New Alert
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={alertForm.name}
                    onChange={handleAlertFormChange('name')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Type"
                    select
                    fullWidth
                    value={alertForm.type}
                    onChange={handleAlertFormChange('type')}
                  >
                    <MenuItem value="traffic_drop">Traffic drop</MenuItem>
                    <MenuItem value="qa_drop">QA drop</MenuItem>
                    <MenuItem value="cwv_fail">CWV fail</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Channel"
                    select
                    fullWidth
                    value={alertForm.channel}
                    onChange={handleAlertFormChange('channel')}
                  >
                    <MenuItem value="in_app">In-app</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Threshold"
                    type="number"
                    fullWidth
                    value={alertForm.threshold}
                    onChange={handleAlertFormChange('threshold')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Window (days)"
                    type="number"
                    fullWidth
                    value={alertForm.windowDays}
                    onChange={handleAlertFormChange('windowDays')}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleTestAlert} disabled={alertLoading}>
                  {alertLoading ? 'Testing…' : 'Test'}
                </Button>
                <Button variant="contained" onClick={handleCreateAlert} disabled={alertLoading}>
                  {alertLoading ? 'Saving…' : 'Create alert'}
                </Button>
              </Stack>
              {alertTestResult && (
                <Alert severity={alertTestResult.triggered ? 'success' : 'info'} sx={{ mt: 2 }}>
                  {alertTestResult.triggered
                    ? `Would trigger: ${alertTestResult.preview?.message || 'Threshold met'}`
                    : 'No trigger based on current data.'}
                </Alert>
              )}
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alert History
              </Typography>
              {alertEvents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No alert events logged yet.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rule</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alertEvents.map((event) => (
                      <TableRow key={event._id || event.id}>
                        <TableCell>{event.ruleId}</TableCell>
                        <TableCell>{event.status}</TableCell>
                        <TableCell>{event.message}</TableCell>
                        <TableCell>{event.createdAt ? fDateTime(event.createdAt) : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card sx={{ p: 3 }}>
            <form onSubmit={handleSaveConfig}>
              <Stack spacing={3}>
                <Typography variant="h6">Analytics Configuration</Typography>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Google Analytics 4 Property ID
                  </Typography>
                  <TextField
                    fullWidth
                    value={config.ga4PropertyId}
                    onChange={handleConfigChange('ga4PropertyId')}
                    placeholder="G-XXXXXXXXXX"
                    helperText="Enter your GA4 measurement ID"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Google Search Console Site URL
                  </Typography>
                  <TextField
                    fullWidth
                    value={config.gscSiteUrl}
                    onChange={handleConfigChange('gscSiteUrl')}
                    placeholder="https://example.com"
                    helperText="Enter your verified site URL from Google Search Console"
                  />
                </Box>

                <Alert severity="info">
                  After configuring these settings, our system will sync data nightly from your analytics sources. Initial sync may take up to 24 hours.
                </Alert>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving && <CircularProgress size={20} />}
                  >
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Card>
        </TabPanel>
      </Stack>
    </Container>
  );
}

