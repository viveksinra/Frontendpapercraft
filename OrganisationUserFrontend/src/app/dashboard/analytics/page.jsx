'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

function MetricCard({ title, value, subtitle, color = 'primary' }) {
  const colorMap = {
    primary: 'text-blue-600',
    success: 'text-green-600',
    info: 'text-sky-600',
    secondary: 'text-purple-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  };

  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colorMap[color] || colorMap.primary}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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

  const handleAlertSelectChange = (field) => (value) => {
    setAlertForm((prev) => ({
      ...prev,
      [field]: value,
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
  const avgCtr =
    metrics.length > 0
      ? (metrics.reduce((sum, m) => sum + (parseFloat(m.ctr) || 0), 0) / metrics.length).toFixed(2)
      : '0.00';
  const avgPosition =
    metrics.length > 0
      ? (
          metrics.reduce((sum, m) => sum + (parseFloat(m.position) || 0), 0) / metrics.length
        ).toFixed(1)
      : '0.0';

  const latestMetric = metrics[metrics.length - 1] || {};
  const indexedPages = latestMetric.indexedPages || 0;
  const excludedPages = latestMetric.excludedPages || 0;

  if (loading) {
    return (
      <div className="container max-w-screen-lg mx-auto px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor drafts, QA pass rate, indexed pages, traffic trends, and proactive alerts per
            tenant.
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            <span>Analytics configuration saved successfully!</span>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="ml-4 text-green-500 hover:text-green-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {isMockData && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            Displaying mock data. Configure GA4 and GSC to see real analytics.
          </div>
        )}

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="flex flex-col gap-6 py-6">
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <MetricCard
                    title="Drafts"
                    value={(summary.drafts?.draft || 0).toLocaleString()}
                    subtitle="Total drafts"
                    color="info"
                  />
                  <MetricCard
                    title="Ready"
                    value={(summary.drafts?.ready_for_publish || 0).toLocaleString()}
                    subtitle="Ready to ship"
                    color="success"
                  />
                  <MetricCard
                    title="QA Pass %"
                    value={`${summary.qaPassRate?.toFixed?.(1) ?? summary.qaPassRate ?? 0}%`}
                    subtitle="Pass rate"
                    color="secondary"
                  />
                  <MetricCard
                    title="Indexed pages"
                    value={(summary.indexedPages || 0).toLocaleString()}
                    subtitle="Reported by GSC"
                    color="primary"
                  />
                  <Card className="p-6">
                    <p className="text-sm font-medium text-muted-foreground">Core Web Vitals</p>
                    <p className="text-sm mt-1">LCP: {summary.cwvSnapshot?.lcp ?? '\u2014'}s</p>
                    <p className="text-sm">CLS: {summary.cwvSnapshot?.cls ?? '\u2014'}</p>
                    <p className="text-sm">FID: {summary.cwvSnapshot?.fid ?? '\u2014'}ms</p>
                  </Card>
                </div>
              )}

              {/* Date Range Selector */}
              <div className="flex gap-2">
                <Button
                  variant={dateRange === 7 ? 'default' : 'outline'}
                  onClick={() => handleDateRangeChange(7)}
                >
                  Last 7 Days
                </Button>
                <Button
                  variant={dateRange === 30 ? 'default' : 'outline'}
                  onClick={() => handleDateRangeChange(30)}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant={dateRange === 90 ? 'default' : 'outline'}
                  onClick={() => handleDateRangeChange(90)}
                >
                  Last 90 Days
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Impressions"
                  value={totalImpressions.toLocaleString()}
                  subtitle={`Last ${dateRange} days`}
                  color="primary"
                />
                <MetricCard
                  title="Total Clicks"
                  value={totalClicks.toLocaleString()}
                  subtitle={`Last ${dateRange} days`}
                  color="success"
                />
                <MetricCard
                  title="Average CTR"
                  value={`${avgCtr}%`}
                  subtitle="Click-through rate"
                  color="info"
                />
                <MetricCard
                  title="Avg Position"
                  value={avgPosition}
                  subtitle="Search ranking"
                  color="warning"
                />
              </div>

              {/* Metrics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Metrics</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Impressions</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                        <TableHead className="text-right">Position</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        metrics.map((metric, index) => (
                          <TableRow key={index}>
                            <TableCell>{metric.date}</TableCell>
                            <TableCell className="text-right">
                              {metric.impressions.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {metric.clicks.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">{metric.ctr}%</TableCell>
                            <TableCell className="text-right">{metric.position}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Index Coverage */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Index Coverage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Indexed Pages</p>
                    <p className="text-3xl font-bold text-green-600">{indexedPages}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Excluded Pages</p>
                    <p className="text-3xl font-bold text-red-600">{excludedPages}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="flex flex-col gap-6 py-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Alert Rules</h3>
                {alerts.length === 0 ? (
                  <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
                    No alerts yet. Create one below.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {alerts.map((rule) => (
                      <Card
                        key={rule._id || rule.id}
                        className="p-4 flex flex-col gap-2 border"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-base font-medium">{rule.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {rule.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant={rule.active ? 'default' : 'outline'}>
                              {rule.active ? 'Active' : 'Paused'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Threshold: {rule.threshold} | Window: {rule.windowDays}d | Channel:{' '}
                          {rule.channel}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAlert(rule)}
                          >
                            {rule.active ? 'Pause' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAlert(rule._id || rule.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">New Alert</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <Input
                      value={alertForm.name}
                      onChange={handleAlertFormChange('name')}
                    />
                  </div>
                  <div className="md:col-span-1.5 md:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">Type</label>
                    <Select
                      value={alertForm.type}
                      onValueChange={handleAlertSelectChange('type')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traffic_drop">Traffic drop</SelectItem>
                        <SelectItem value="qa_drop">QA drop</SelectItem>
                        <SelectItem value="cwv_fail">CWV fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium mb-1.5 block">Channel</label>
                    <Select
                      value={alertForm.channel}
                      onValueChange={handleAlertSelectChange('channel')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_app">In-app</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium mb-1.5 block">Threshold</label>
                    <Input
                      type="number"
                      value={alertForm.threshold}
                      onChange={handleAlertFormChange('threshold')}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium mb-1.5 block">Window (days)</label>
                    <Input
                      type="number"
                      value={alertForm.windowDays}
                      onChange={handleAlertFormChange('windowDays')}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={handleTestAlert} disabled={alertLoading}>
                    {alertLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Test'
                    )}
                  </Button>
                  <Button onClick={handleCreateAlert} disabled={alertLoading}>
                    {alertLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Create alert'
                    )}
                  </Button>
                </div>
                {alertTestResult && (
                  <div
                    className={`mt-4 rounded-md border px-4 py-3 text-sm ${
                      alertTestResult.triggered
                        ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'
                        : 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    }`}
                  >
                    {alertTestResult.triggered
                      ? `Would trigger: ${alertTestResult.preview?.message || 'Threshold met'}`
                      : 'No trigger based on current data.'}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Alert History</h3>
                {alertEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No alert events logged yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertEvents.map((event) => (
                        <TableRow key={event._id || event.id}>
                          <TableCell>{event.ruleId}</TableCell>
                          <TableCell>{event.status}</TableCell>
                          <TableCell>{event.message}</TableCell>
                          <TableCell>
                            {event.createdAt ? fDateTime(event.createdAt) : '\u2014'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <div className="py-6">
              <Card className="p-6">
                <form onSubmit={handleSaveConfig}>
                  <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-semibold">Analytics Configuration</h3>

                    <div>
                      <label className="text-base font-medium mb-1.5 block">
                        Google Analytics 4 Property ID
                      </label>
                      <Input
                        value={config.ga4PropertyId}
                        onChange={handleConfigChange('ga4PropertyId')}
                        placeholder="G-XXXXXXXXXX"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Enter your GA4 measurement ID
                      </p>
                    </div>

                    <div>
                      <label className="text-base font-medium mb-1.5 block">
                        Google Search Console Site URL
                      </label>
                      <Input
                        value={config.gscSiteUrl}
                        onChange={handleConfigChange('gscSiteUrl')}
                        placeholder="https://example.com"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Enter your verified site URL from Google Search Console
                      </p>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
                      After configuring these settings, our system will sync data nightly from your
                      analytics sources. Initial sync may take up to 24 hours.
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Configuration'
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
