'use client';

import { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { generateReport, bulkGenerateReports } from 'src/lib/reports-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

// ----------------------------------------------------------------------

export default function ReportGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [reportType, setReportType] = useState(searchParams.get('type') || 'progress_report');
  const [studentUserId, setStudentUserId] = useState(searchParams.get('studentId') || '');
  const [classId, setClassId] = useState(searchParams.get('classId') || '');
  const [templateId, setTemplateId] = useState('standard');
  const [title, setTitle] = useState('');
  const [bulkMode, setBulkMode] = useState(false);

  const needsStudent = reportType === 'progress_report' || reportType === 'mock_analysis';
  const needsClass = reportType === 'class_summary';

  const handleGenerate = async () => {
    if (!companyId) return undefined;
    try {
      setLoading(true);
      setError(null);

      if (bulkMode && classId) {
        await bulkGenerateReports(companyId, { classId, templateId });
      } else {
        const data = {
          type: reportType,
          templateId: reportType === 'mock_analysis' ? 'eleven_plus' : templateId,
          title: title || undefined,
        };
        if (needsStudent && studentUserId) data.studentUserId = studentUserId;
        if (needsClass && classId) data.classId = classId;

        await generateReport(companyId, data);
      }

      router.push(paths.dashboard.reports.root);
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-screen-lg mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Generate Report</h1>
            <p className="text-sm text-muted-foreground">
              Create PDF reports for students or classes.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Report Type */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress_report">Standard Progress Report</SelectItem>
                  <SelectItem value="mock_analysis">11+ Mock Analysis</SelectItem>
                  <SelectItem value="class_summary">Class Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title (optional)</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Auto-generated if left blank"
              />
            </div>

            {/* Student ID (for student reports) */}
            {needsStudent && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Student User ID</label>
                <Input
                  value={studentUserId}
                  onChange={(e) => setStudentUserId(e.target.value)}
                  placeholder="Enter student user ID"
                />
              </div>
            )}

            {/* Class ID (for class summary or bulk) */}
            {(needsClass || bulkMode) && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Class ID</label>
                <Input
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  placeholder="Enter class ID"
                />
              </div>
            )}

            {/* Bulk mode toggle */}
            {!needsClass && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bulkMode"
                  checked={bulkMode}
                  onChange={(e) => setBulkMode(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="bulkMode" className="text-sm">
                  Bulk generate for entire class
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate PDF'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
