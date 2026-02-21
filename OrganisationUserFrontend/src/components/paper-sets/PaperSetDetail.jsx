'use client';

import { useState } from 'react';
import { Globe, Archive, Download, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

import PaperSetPaperList from './PaperSetPaperList';
import PaperSetPricingForm from './PaperSetPricingForm';
import PdfUploader from './PdfUploader';

const STATUS_BADGE = {
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  published: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function PaperSetDetail({
  paperSet,
  availablePapers = [],
  onAddPaper,
  onRemovePaper,
  onReorderPapers,
  onPublish,
  onArchive,
  onDownloadZip,
  onUploadPdf,
  onUpdatePricing,
  uploading,
}) {
  const [selectedPaperId, setSelectedPaperId] = useState('');

  if (!paperSet) return null;

  const handleAddPaper = () => {
    if (selectedPaperId) {
      onAddPaper?.(selectedPaperId);
      setSelectedPaperId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header info */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{paperSet.title || 'Untitled Set'}</h2>
                <Badge variant="outline" className={STATUS_BADGE[paperSet.status]}>
                  {paperSet.status}
                </Badge>
              </div>
              {paperSet.description && (
                <p className="text-sm text-muted-foreground mt-1">{paperSet.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {paperSet.examType || 'General'} &middot; {paperSet.papers?.length || 0} papers
              </p>
            </div>
            <div className="flex gap-2">
              {paperSet.status === 'draft' && (
                <Button onClick={onPublish}>
                  <Globe className="mr-2 h-4 w-4" /> Publish
                </Button>
              )}
              {paperSet.status === 'published' && (
                <Button variant="outline" onClick={onArchive}>
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </Button>
              )}
              <Button variant="outline" onClick={onDownloadZip}>
                <Download className="mr-2 h-4 w-4" /> Download ZIP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers in set */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Papers in Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaperSetPaperList
            papers={paperSet.papers || []}
            onRemove={onRemovePaper}
            onReorder={onReorderPapers}
          />
          {paperSet.status === 'draft' && (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select value={selectedPaperId} onValueChange={setSelectedPaperId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a paper to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePapers.map((p) => (
                      <SelectItem key={p._id || p.id} value={p._id || p.id}>
                        {p.title || 'Untitled'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddPaper} disabled={!selectedPaperId}>
                <Plus className="mr-1.5 h-4 w-4" /> Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Upload */}
      {paperSet.status === 'draft' && (
        <Card>
          <CardContent className="p-5">
            <PdfUploader onUpload={onUploadPdf} uploading={uploading} />
          </CardContent>
        </Card>
      )}

      {/* Pricing */}
      <Card>
        <CardContent className="p-5">
          <PaperSetPricingForm pricing={paperSet.pricing} onChange={onUpdatePricing} />
        </CardContent>
      </Card>
    </div>
  );
}
