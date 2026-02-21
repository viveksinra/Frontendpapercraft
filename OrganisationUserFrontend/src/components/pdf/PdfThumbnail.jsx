'use client';

import { FileText } from 'lucide-react';

import { Card } from '@/components/ui/card';

export default function PdfThumbnail({ pdfType, onClick }) {
  const labels = {
    questionPaper: 'Question Paper',
    answerSheet: 'Answer Sheet',
    solutionPaper: 'Solution Paper',
  };

  return (
    <Card
      className="p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <FileText className="h-10 w-10 text-muted-foreground" />
      <span className="text-xs font-medium text-center">{labels[pdfType] || pdfType}</span>
    </Card>
  );
}
