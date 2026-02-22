'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getPlatformRevenue, type PlatformRevenueOverview as PlatformRevenueData } from '@/lib/admin-api';
import { PlatformRevenueOverview } from '@/components/revenue/PlatformRevenueOverview';
import { OrgRevenueTable } from '@/components/revenue/OrgRevenueTable';
import { FailedPaymentsMonitor } from '@/components/revenue/FailedPaymentsMonitor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function PlatformRevenuePage() {
  const [data, setData] = useState<PlatformRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadRevenue = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const result: any = await getPlatformRevenue(params);
      setData(result.data || result);
    } catch (err: any) {
      if (err?.status === 404) {
        setData(null);
      } else {
        toast.error(err?.message || 'Failed to load platform revenue.');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Revenue</h2>
          <p className="text-muted-foreground">
            Cross-organisation revenue overview and payment monitoring.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadRevenue} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Date Range Filter - Toolbar style */}
      <Card>
        <CardContent className="flex items-end gap-4 pt-4 pb-4">
          <Calendar className="h-4 w-4 text-muted-foreground mb-2" />
          <div className="space-y-1">
            <Label htmlFor="startDate" className="text-xs">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40 h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="endDate" className="text-xs">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40 h-8 text-sm"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={loadRevenue} disabled={loading}>
            Apply
          </Button>
        </CardContent>
      </Card>

      {loading && !data && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-muted-foreground">Loading revenue data...</span>
        </div>
      )}

      {!loading && !data && (
        <div className="rounded-md border p-10 text-center text-muted-foreground">
          No revenue data available. The endpoint may not be configured yet.
        </div>
      )}

      {data && (
        <>
          <PlatformRevenueOverview data={data} />
          <OrgRevenueTable data={data.revenueByOrg} currency={data.currency} />
        </>
      )}

      <FailedPaymentsMonitor />
    </div>
  );
}
