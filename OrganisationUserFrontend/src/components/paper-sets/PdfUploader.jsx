'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

export default function PdfUploader({ onUpload, uploading }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [paperIndex, setPaperIndex] = useState('0');
  const [pdfType, setPdfType] = useState('questionPaper');

  const handleUpload = () => {
    if (!file) return;
    onUpload?.(file, Number(paperIndex), pdfType);
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Upload PDF</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label>PDF File</Label>
          <Input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label>Paper Index</Label>
          <Input type="number" min={0} value={paperIndex} onChange={(e) => setPaperIndex(e.target.value)} />
        </div>
        <div>
          <Label>PDF Type</Label>
          <Select value={pdfType} onValueChange={setPdfType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="questionPaper">Question Paper</SelectItem>
              <SelectItem value="answerSheet">Answer Sheet</SelectItem>
              <SelectItem value="solutionPaper">Solution Paper</SelectItem>
              <SelectItem value="passageBooklet">Passage Booklet</SelectItem>
              <SelectItem value="markingGuide">Marking Guide</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleUpload} disabled={!file || uploading} variant="outline">
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
}
