'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function UploadStep({ onUpload }) {
  const [tab, setTab] = useState('file');
  const [pasteContent, setPasteContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    let source = 'csv';
    if (extension === 'docx' || extension === 'doc') source = 'docx';

    const text = await file.text();
    onUpload({ source, fileName: file.name, fileContent: text });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handlePaste = () => {
    if (!pasteContent.trim()) return;
    onUpload({ source: 'paste', fileName: 'pasted-content.csv', fileContent: pasteContent });
  };

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="file">
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="paste">
            <Clipboard className="mr-1.5 h-3.5 w-3.5" />
            Paste Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-4">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Drop your file here</p>
            <p className="text-sm text-muted-foreground mb-4">Supports CSV and DOCX files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.docx,.doc"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
          </div>

          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p><strong>CSV format:</strong> Headers should include: question, option_a, option_b, option_c, option_d, answer, explanation, difficulty, marks, tags</p>
            <p><strong>DOCX format:</strong> Number questions (1. 2. 3...) with options labeled A) B) C) D) and answers on a separate line</p>
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-4">
          <Textarea
            placeholder={'Paste CSV content here...\n\nExample:\nquestion,option_a,option_b,option_c,option_d,answer\n"What is 2+2?","1","2","3","4","D"'}
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            rows={12}
            className="font-mono text-xs"
          />
          <div className="flex justify-end mt-3">
            <Button onClick={handlePaste} disabled={!pasteContent.trim()}>
              Parse Content
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
