'use client';

import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';

export default function QuestionSwapDialog({
  open,
  onOpenChange,
  currentQuestion,
  alternatives = [],
  loading,
  onSwap,
}) {
  const [selectedAlt, setSelectedAlt] = useState(null);

  useEffect(() => {
    if (open) setSelectedAlt(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Swap Question</DialogTitle>
        </DialogHeader>

        {/* Current question */}
        {currentQuestion && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Current Question</p>
            <Card>
              <CardContent className="p-3">
                <p className="text-sm">{currentQuestion.content?.text || currentQuestion.title || 'Question'}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {currentQuestion.type && <Badge variant="outline" className="text-[10px]">{currentQuestion.type}</Badge>}
                  {currentQuestion.difficulty && <Badge variant="outline" className="text-[10px]">{currentQuestion.difficulty}</Badge>}
                  {currentQuestion.marks && <Badge variant="secondary" className="text-[10px]">{currentQuestion.marks}m</Badge>}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alternatives */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Alternatives</p>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : alternatives.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground text-sm">No alternatives available.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {alternatives.map((alt) => {
                const id = alt._id || alt.id;
                const isSelected = selectedAlt === id;
                return (
                  <Card
                    key={id}
                    className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                    onClick={() => setSelectedAlt(id)}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm">{alt.content?.text || alt.title || 'Question'}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {alt.type && <Badge variant="outline" className="text-[10px]">{alt.type}</Badge>}
                        {alt.difficulty && <Badge variant="outline" className="text-[10px]">{alt.difficulty}</Badge>}
                        {alt.marks && <Badge variant="secondary" className="text-[10px]">{alt.marks}m</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!selectedAlt} onClick={() => onSwap?.(selectedAlt)}>
            Swap Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
