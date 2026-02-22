'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Download, Trash2 } from 'lucide-react';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listReports, deleteReport, downloadReport } from 'src/lib/reports-api';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

// ----------------------------------------------------------------------

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  generating: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function ReportsListPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const companyId = getActiveCompanyIdFromCookie();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadReports = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const params = { page, pageSize: 20 };
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const data = await listReports(companyId, params);
      setReports(data?.reports || []);
      setTotal(data?.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [companyId, page, filterType, filterStatus]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDownload = async (reportId) => {
    try {
      const data = await downloadReport(companyId, reportId);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      setError(err.message || 'Failed to download report');
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteReport(companyId, reportId);
      loadReports();
    } catch (err) {
      setError(err.message || 'Failed to delete report');
    }
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Generate and manage PDF reports for students and classes.
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.reports.generate)}>
            <Plus className="h-4 w-4 mr-1" />
            Generate Report
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
            <button className="ml-4 font-medium hover:underline" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="progress_report">Progress Report</SelectItem>
              <SelectItem value="mock_analysis">Mock Analysis</SelectItem>
              <SelectItem value="class_summary">Class Summary</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No reports found. Generate your first report.
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 font-medium text-muted-foreground">Title</th>
                      <th className="p-3 font-medium text-muted-foreground">Type</th>
                      <th className="p-3 font-medium text-muted-foreground">Status</th>
                      <th className="p-3 font-medium text-muted-foreground">Generated</th>
                      <th className="p-3 font-medium text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{report.title}</td>
                        <td className="p-3 text-muted-foreground">
                          {report.type?.replace(/_/g, ' ')}
                        </td>
                        <td className="p-3">
                          <Badge className={statusColors[report.status] || ''}>
                            {report.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            {report.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(report._id)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(report._id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground flex items-center">
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / 20)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
