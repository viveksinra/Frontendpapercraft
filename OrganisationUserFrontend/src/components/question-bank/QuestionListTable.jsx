'use client';

import { useRouter } from 'next/navigation';
import { Eye, Copy, Send, Pencil, Archive, RotateCcw, MoreHorizontal } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import QuestionTypeBadge from './QuestionTypeBadge';
import SubjectBreadcrumb from './SubjectBreadcrumb';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';

function truncateHtml(text, maxLen = 80) {
  if (!text) return '';
  const stripped = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen) + '...' : stripped;
}

export default function QuestionListTable({
  questions = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onArchive,
  onDuplicate,
  onSubmitForReview,
}) {
  const router = useRouter();

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No questions found. Create your first question to get started.
      </div>
    );
  }

  const allSelected = questions.length > 0 && questions.every((q) => selectedIds.includes(q._id || q.id));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]">
            <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
          </TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="min-w-[250px]">Question</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Marks</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => {
          const qId = question._id || question.id;
          const isSelected = selectedIds.includes(qId);
          const status = question.review?.status || 'draft';

          return (
            <TableRow key={qId} className={isSelected ? 'bg-accent/50' : ''}>
              <TableCell>
                <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect?.(qId)} />
              </TableCell>
              <TableCell>
                <QuestionTypeBadge type={question.type} />
              </TableCell>
              <TableCell className="max-w-[300px]">
                <span className="text-sm truncate block">{truncateHtml(question.content?.body)}</span>
              </TableCell>
              <TableCell>
                <SubjectBreadcrumb question={question} />
              </TableCell>
              <TableCell>
                <QuestionDifficultyBadge difficulty={question.metadata?.difficulty} />
              </TableCell>
              <TableCell className="text-right">{question.metadata?.marks ?? 1}</TableCell>
              <TableCell>
                <StatusBadge status={status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : '\u2014'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Actions menu">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(paths.dashboard.questionBank.detail(qId))}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    {status === 'draft' && (
                      <DropdownMenuItem onClick={() => router.push(paths.dashboard.questionBank.edit(qId))}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDuplicate?.(qId)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {status === 'draft' && (
                      <DropdownMenuItem onClick={() => onSubmitForReview?.(qId)}>
                        <Send className="mr-2 h-4 w-4" /> Submit for Review
                      </DropdownMenuItem>
                    )}
                    {!question.isArchived ? (
                      <DropdownMenuItem variant="destructive" onClick={() => onArchive?.(qId)}>
                        <Archive className="mr-2 h-4 w-4" /> Archive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onArchive?.(qId)}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Restore
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ status }) {
  const config = {
    draft: 'bg-gray-100 text-gray-700',
    pending_review: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const labels = {
    draft: 'Draft',
    pending_review: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config[status] || config.draft}`}>
      {labels[status] || status}
    </span>
  );
}
