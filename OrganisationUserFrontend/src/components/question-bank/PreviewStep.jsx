'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

export default function PreviewStep({ questions = [], onEdit }) {
  const validCount = questions.filter((q) => q.isValid).length;
  const errorCount = questions.filter((q) => !q.isValid).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-green-700">
          <CheckCircle className="h-4 w-4" />
          {validCount} valid
        </span>
        {errorCount > 0 && (
          <span className="flex items-center gap-1 text-red-700">
            <AlertCircle className="h-4 w-4" />
            {errorCount} errors
          </span>
        )}
        <span className="text-muted-foreground">Total: {questions.length} questions</span>
      </div>

      <div className="border rounded-md overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="min-w-[200px]">Question</TableHead>
              <TableHead className="w-[80px]">Options</TableHead>
              <TableHead className="w-[80px]">Answer</TableHead>
              <TableHead className="w-[80px]">Difficulty</TableHead>
              <TableHead className="w-[60px]">Marks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q, i) => (
              <TableRow key={i} className={q.isValid ? '' : 'bg-red-50'}>
                <TableCell className="text-xs">{q.rowIndex}</TableCell>
                <TableCell>
                  {q.isValid ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-0 text-xs">OK</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-0 text-xs" title={q.error}>Error</Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs">{q.type}</TableCell>
                <TableCell className="text-xs max-w-[300px] truncate">{q.body}</TableCell>
                <TableCell className="text-xs">{q.options?.length || 0}</TableCell>
                <TableCell className="text-xs">{q.correctAnswer || '-'}</TableCell>
                <TableCell className="text-xs">{q.difficulty || '-'}</TableCell>
                <TableCell className="text-xs">{q.marks || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {errorCount > 0 && (
        <div className="text-sm text-muted-foreground">
          Questions with errors will be skipped during import. Fix them in the source file and re-upload, or proceed with valid questions only.
        </div>
      )}
    </div>
  );
}
