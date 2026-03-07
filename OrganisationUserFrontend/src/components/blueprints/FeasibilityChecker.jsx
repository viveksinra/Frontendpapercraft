'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FeasibilityChecker({ companyId, blueprintId, onCheck }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    try {
      setLoading(true);
      const data = await onCheck(companyId, blueprintId);
      setResult(data);
    } catch {
      setResult({ feasible: false, error: 'Failed to check feasibility' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button variant="outline" onClick={handleCheck} disabled={loading || !blueprintId}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          'Check Feasibility'
        )}
      </Button>

      {result && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            {result.feasible ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Feasible</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-semibold text-red-600">Not Feasible</span>
              </>
            )}
          </div>
          {result.sections && (
            <div className="space-y-2">
              {result.sections.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name || `Section ${i + 1}`}</span>
                  <div className="flex items-center gap-3">
                    <span>Need: {s.required}</span>
                    <span>Available: {s.available}</span>
                    {s.shortfall > 0 && (
                      <span className="text-red-600 font-medium">Shortfall: {s.shortfall}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {result.error && <p className="text-sm text-red-600">{result.error}</p>}
        </Card>
      )}
    </div>
  );
}
