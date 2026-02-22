'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { Award, Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function VerifyCertificatePage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [certNumber, setCertNumber] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!certNumber.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axiosInstance.get(`/api/v2/certificates/verify/${certNumber.trim()}`);
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Certificate not found.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Award className="h-12 w-12 mx-auto text-amber-600" />
          <h1 className="text-2xl font-bold tracking-tight">Verify Certificate</h1>
          <p className="text-sm text-muted-foreground">
            Enter a certificate number to verify its authenticity.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="Enter certificate number..."
              className="flex h-10 flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={loading || !certNumber.trim()}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Verify
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Certificate Not Found</p>
              <p className="text-xs text-muted-foreground mt-1">
                The certificate number you entered could not be verified.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Certificate Verified
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium">{result.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium">{result.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Institute</span>
                <span className="font-medium">{result.instituteName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {result.completedAt
                    ? new Date(result.completedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certificate #</span>
                <span className="font-mono text-xs">{result.certificateNumber}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Powered by PaperCraft
        </p>
      </div>
    </div>
  );
}
