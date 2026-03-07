'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Globe, Loader2, Sparkles, FileText, CheckCircle } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { listTemplates } from 'src/lib/paper-template-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listPapers, deletePaper, downloadPdf, publishPaper, finalizePaper } from 'src/lib/paper-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PaperListTable from 'src/components/papers/PaperListTable';
import PaperFilterBar from 'src/components/papers/PaperFilterBar';
import PaperStatusTabs from 'src/components/papers/PaperStatusTabs';
import PaperSummaryCard from 'src/components/papers/PaperSummaryCard';

export default function PapersPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [papers, setPapers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStatus, setActiveStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPapers = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (activeStatus !== 'all') params.status = activeStatus;
      if (search) params.search = search;
      if (templateFilter !== 'all') params.templateId = templateFilter;

      const data = await listPapers(companyId, params);
      setPapers(data.papers || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load papers');
    } finally {
      setLoading(false);
    }
  }, [companyId, page, activeStatus, search, templateFilter]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  useEffect(() => {
    if (!companyId) return;
    listTemplates(companyId).then((data) => {
      setTemplates(data.templates || data.data || []);
    }).catch(() => {});
  }, [companyId]);

  const handleFinalize = async (paperId) => {
    try {
      await finalizePaper(companyId, paperId);
      fetchPapers();
    } catch (err) {
      setError(err.message || 'Failed to finalize paper');
    }
  };

  const handlePublish = async (paperId) => {
    try {
      await publishPaper(companyId, paperId);
      fetchPapers();
    } catch (err) {
      setError(err.message || 'Failed to publish paper');
    }
  };

  const handleDelete = async (paperId) => {
    try {
      await deletePaper(companyId, paperId);
      fetchPapers();
    } catch (err) {
      setError(err.message || 'Failed to delete paper');
    }
  };

  const handleDownload = async (paperId, pdfType) => {
    try {
      const data = await downloadPdf(companyId, paperId, pdfType);
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      setError(err.message || 'Failed to download PDF');
    }
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleTemplateFilterChange = (value) => {
    setTemplateFilter(value);
    setPage(1);
  };

  // Compute status counts from loaded papers for tab display
  const counts = {
    all: papers.length,
    draft: papers.filter((p) => p.status === 'draft').length,
    finalized: papers.filter((p) => p.status === 'finalized').length,
    published: papers.filter((p) => p.status === 'published').length,
  };

  if (!companyId) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">No active company selected.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Papers</h1>
            <p className="text-sm text-muted-foreground">
              Create, manage, and publish exam papers
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(paths.dashboard.papers.autoGenerate)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Auto-Generate
            </Button>
            <Button onClick={() => router.push(paths.dashboard.papers.create)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Paper
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PaperSummaryCard title="Draft Papers" value={counts.draft} icon={FileText} />
          <PaperSummaryCard title="Finalized" value={counts.finalized} icon={CheckCircle} />
          <PaperSummaryCard title="Published" value={counts.published} icon={Globe} />
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}

        {/* Status Tabs */}
        <PaperStatusTabs activeStatus={activeStatus} onStatusChange={handleStatusChange} counts={counts} />

        {/* Filter Bar */}
        <PaperFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          templateFilter={templateFilter}
          onTemplateFilterChange={handleTemplateFilterChange}
          templates={templates}
        />

        {/* Papers Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <PaperListTable
                papers={papers}
                onFinalize={handleFinalize}
                onPublish={handlePublish}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
