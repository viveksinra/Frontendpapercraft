'use client';

import { useState } from 'react';
import { Send, XCircle, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ReviewActionPanel({ question, onSubmitForReview, onApprove, onReject }) {
  const [notes, setNotes] = useState('');
  const status = question?.review?.status || 'draft';

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        <h3 className="text-sm font-semibold">Review Actions</h3>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Current Status:</span>
          <StatusLabel status={status} />
        </div>

        {question?.review?.rejectionReason && (
          <div className="text-sm bg-red-50 border border-red-200 rounded p-2">
            <strong>Rejection Reason:</strong> {question.review.rejectionReason}
          </div>
        )}

        {question?.review?.notes && (
          <div className="text-sm bg-blue-50 border border-blue-200 rounded p-2">
            <strong>Notes:</strong> {question.review.notes}
          </div>
        )}

        <Textarea
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="flex gap-2">
          {(status === 'draft' || status === 'rejected') && (
            <Button size="sm" variant="outline" onClick={() => onSubmitForReview?.(notes)}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Submit for Review
            </Button>
          )}
          {status === 'pending_review' && (
            <>
              <Button size="sm" onClick={() => onApprove?.(notes)}>
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onReject?.(notes)}>
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                Reject
              </Button>
            </>
          )}
        </div>

        {/* Review History */}
        {question?.review?.reviewedAt && (
          <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
            Reviewed by {question.review.reviewedBy || 'unknown'} on{' '}
            {new Date(question.review.reviewedAt).toLocaleDateString()}
          </div>
        )}
        {question?.review?.submittedAt && (
          <div className="text-xs text-muted-foreground">
            Submitted by {question.review.submittedBy || 'unknown'} on{' '}
            {new Date(question.review.submittedAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusLabel({ status }) {
  const config = {
    draft: { label: 'Draft', className: 'text-gray-700 bg-gray-100' },
    pending_review: { label: 'Pending Review', className: 'text-amber-800 bg-amber-100' },
    approved: { label: 'Approved', className: 'text-green-800 bg-green-100' },
    rejected: { label: 'Rejected', className: 'text-red-800 bg-red-100' },
  };
  const c = config[status] || config.draft;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}
