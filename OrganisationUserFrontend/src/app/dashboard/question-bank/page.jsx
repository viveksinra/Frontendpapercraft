'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, Upload, Loader2, XCircle, BookOpen, CheckCircle } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getSubjectTree } from 'src/lib/subject-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { listQuestions, archiveQuestion, submitForReview, getQuestionStats, duplicateQuestion } from 'src/lib/question-api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BulkActionBar from 'src/components/question-bank/BulkActionBar';
import QuestionListTable from 'src/components/question-bank/QuestionListTable';
import QuestionFilterBar from 'src/components/question-bank/QuestionFilterBar';
import QuestionStatusTabs from 'src/components/question-bank/QuestionStatusTabs';
import SubjectTreeSidebar from 'src/components/question-bank/SubjectTreeSidebar';

export default function QuestionBankPage() {
  const router = useRouter();
  const companyId = getActiveCompanyIdFromCookie();

  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStatus, setActiveStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedIds, setSelectedIds] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!companyId) return undefined;
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (activeStatus !== 'all') params.status = activeStatus;
      if (search) params.search = search;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      if (selectedSubjectId) params.subjectId = selectedSubjectId;

      const data = await listQuestions(companyId, params);
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / 20) || 1);
    } catch (err) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [companyId, page, activeStatus, search, typeFilter, difficultyFilter, selectedSubjectId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (!companyId) return undefined;
    getSubjectTree(companyId).then((data) => {
      setSubjects(data.subjects || []);
    }).catch(() => {});
    getQuestionStats(companyId).then((data) => {
      setStats(data.stats || null);
    }).catch(() => {});
    return undefined;
  }, [companyId]);

  const handleArchive = async (questionId) => {
    try {
      await archiveQuestion(companyId, questionId);
      fetchQuestions();
    } catch (err) {
      setError(err.message || 'Failed to archive question');
    }
  };

  const handleDuplicate = async (questionId) => {
    try {
      await duplicateQuestion(companyId, questionId);
      fetchQuestions();
    } catch (err) {
      setError(err.message || 'Failed to duplicate question');
    }
  };

  const handleSubmitForReview = async (questionId) => {
    try {
      await submitForReview(companyId, questionId);
      fetchQuestions();
    } catch (err) {
      setError(err.message || 'Failed to submit for review');
    }
  };

  const handleBulkArchive = async () => {
    for (const id of selectedIds) {
      try { await archiveQuestion(companyId, id); } catch { /* ignore individual failures */ }
    }
    setSelectedIds([]);
    fetchQuestions();
  };

  const handleBulkSubmitForReview = async () => {
    for (const id of selectedIds) {
      try { await submitForReview(companyId, id); } catch { /* ignore individual failures */ }
    }
    setSelectedIds([]);
    fetchQuestions();
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q._id || q.id));
    }
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleDifficultyFilterChange = (value) => {
    setDifficultyFilter(value);
    setPage(1);
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setPage(1);
  };

  // Compute status counts from stats
  const counts = {
    all: stats?.total || total,
    draft: stats?.byStatus?.find((s) => s.status === 'draft')?.count || 0,
    pending_review: stats?.byStatus?.find((s) => s.status === 'pending_review')?.count || 0,
    approved: stats?.byStatus?.find((s) => s.status === 'approved')?.count || 0,
    rejected: stats?.byStatus?.find((s) => s.status === 'rejected')?.count || 0,
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
            <h1 className="text-2xl font-bold tracking-tight">Question Bank</h1>
            <p className="text-sm text-muted-foreground">
              Create, manage, and organize your question library
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(paths.dashboard.questionBank.import)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
            <Button onClick={() => router.push(paths.dashboard.questionBank.create)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Question
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard title="Total Questions" value={counts.all} icon={BookOpen} />
          <SummaryCard title="Draft" value={counts.draft} icon={Clock} />
          <SummaryCard title="Approved" value={counts.approved} icon={CheckCircle} />
          <SummaryCard title="Rejected" value={counts.rejected} icon={XCircle} />
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
        <QuestionStatusTabs activeStatus={activeStatus} onStatusChange={handleStatusChange} counts={counts} />

        {/* Filter Bar */}
        <QuestionFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          difficultyFilter={difficultyFilter}
          onDifficultyFilterChange={handleDifficultyFilterChange}
        />

        {/* Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          onArchive={handleBulkArchive}
          onSubmitForReview={handleBulkSubmitForReview}
          onClearSelection={() => setSelectedIds([])}
        />

        {/* Main Content: Sidebar + Table */}
        <div className="flex gap-6">
          <SubjectTreeSidebar
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSubjectSelect={handleSubjectSelect}
          />
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <QuestionListTable
                    questions={questions}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    onArchive={handleArchive}
                    onDuplicate={handleDuplicate}
                    onSubmitForReview={handleSubmitForReview}
                  />
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
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
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
