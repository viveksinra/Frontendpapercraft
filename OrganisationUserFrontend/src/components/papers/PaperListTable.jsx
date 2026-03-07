'use client';

import { useRouter } from 'next/navigation';
import { Eye, Globe, Pencil, Trash2, Download, CheckCircle, MoreHorizontal } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { Button } from '@/components/ui/button';
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

import PaperStatusBadge from './PaperStatusBadge';

export default function PaperListTable({ papers = [], onFinalize, onPublish, onDelete, onDownload }) {
  const router = useRouter();

  if (papers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No papers found. Create your first paper to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Sections</TableHead>
          <TableHead className="text-right">Questions</TableHead>
          <TableHead className="text-right">Marks</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {papers.map((paper) => {
          const totalQuestions = (paper.sections || []).reduce(
            (sum, s) => sum + (s.questions?.length || 0),
            0
          );
          const totalMarks = (paper.sections || []).reduce(
            (sum, s) =>
              sum + (s.questions || []).reduce((qs, q) => qs + (q.marks || 0), 0),
            0
          );

          return (
            <TableRow key={paper._id || paper.id}>
              <TableCell className="font-medium max-w-[250px] truncate">
                {paper.title || 'Untitled Paper'}
              </TableCell>
              <TableCell>
                <PaperStatusBadge status={paper.status} />
              </TableCell>
              <TableCell className="text-right">{(paper.sections || []).length}</TableCell>
              <TableCell className="text-right">{totalQuestions}</TableCell>
              <TableCell className="text-right">{totalMarks}</TableCell>
              <TableCell className="text-muted-foreground">
                {paper.createdAt ? new Date(paper.createdAt).toLocaleDateString() : '\u2014'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Actions menu">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(paths.dashboard.papers.detail(paper._id || paper.id))}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    {paper.status === 'draft' && (
                      <DropdownMenuItem onClick={() => router.push(paths.dashboard.papers.edit(paper._id || paper.id))}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                    )}
                    {(paper.pdfs?.length > 0) && (
                      <DropdownMenuItem onClick={() => onDownload?.(paper._id || paper.id, 'questionPaper')}>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {paper.status === 'draft' && (
                      <DropdownMenuItem onClick={() => onFinalize?.(paper._id || paper.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Finalize
                      </DropdownMenuItem>
                    )}
                    {paper.status === 'finalized' && (
                      <DropdownMenuItem onClick={() => onPublish?.(paper._id || paper.id)}>
                        <Globe className="mr-2 h-4 w-4" /> Publish
                      </DropdownMenuItem>
                    )}
                    {paper.status === 'draft' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete?.(paper._id || paper.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </>
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
