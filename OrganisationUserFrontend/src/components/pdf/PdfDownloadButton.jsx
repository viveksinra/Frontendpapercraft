'use client';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

const PDF_TYPES = [
  { value: 'questionPaper', label: 'Question Paper' },
  { value: 'answerSheet', label: 'Answer Sheet' },
  { value: 'solutionPaper', label: 'Solution Paper' },
];

export default function PdfDownloadButton({ onDownload, disabled }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {PDF_TYPES.map((type) => (
          <DropdownMenuItem key={type.value} onClick={() => onDownload?.(type.value)}>
            {type.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
