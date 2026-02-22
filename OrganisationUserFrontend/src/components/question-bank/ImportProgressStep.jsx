'use client';

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ImportProgressStep({ job, onDone }) {
  if (!job) return null;

  const isComplete = job.status === 'completed' || job.status === 'failed';
  const progress = job.totalRows > 0
    ? Math.round(((job.importedCount + job.errorCount) / job.totalRows) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Import Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${job.status === 'failed' ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${isComplete ? 100 : progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{job.importedCount}</p>
              <p className="text-xs text-muted-foreground">Imported</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold">{job.errorCount}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{job.totalRows}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status message */}
      {isComplete && (
        <div className={`rounded-md p-4 text-sm ${
          job.status === 'failed' ? 'bg-red-50 text-red-800 border border-red-200' :
          job.errorCount > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
          'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {job.status === 'failed' ? (
            <p>Import failed. Please check your file and try again.</p>
          ) : job.errorCount > 0 ? (
            <p>Import completed with {job.errorCount} errors. {job.importedCount} questions were imported successfully.</p>
          ) : (
            <p>All {job.importedCount} questions were imported successfully!</p>
          )}
        </div>
      )}

      {/* Errors list */}
      {job.errors && job.errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Error Details</h4>
          <div className="max-h-[200px] overflow-auto border rounded-md">
            {job.errors.map((err, i) => (
              <div key={i} className="flex items-start gap-2 px-3 py-2 text-xs border-b last:border-b-0">
                <span className="text-muted-foreground shrink-0">Row {err.row}:</span>
                <span className="text-red-700">{err.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="flex justify-end">
          <Button onClick={onDone}>
            Go to Question Bank
          </Button>
        </div>
      )}
    </div>
  );
}
