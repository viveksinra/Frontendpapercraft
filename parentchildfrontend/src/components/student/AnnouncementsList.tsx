'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone, Pin } from 'lucide-react';
import { getStudentAnnouncements } from '@/lib/student-homework-api';

interface AnnouncementItem {
  _id: string;
  title: string;
  body: string;
  audience: string;
  isPinned: boolean;
  publishedAt: string;
  expiresAt: string | null;
}

export function AnnouncementsList() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStudentAnnouncements();
        setItems(data?.announcements || data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="mt-1 text-muted-foreground">Stay up to date with your organisation</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="mt-1 text-muted-foreground">Stay up to date with your organisation</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4">
              <Megaphone className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Announcements</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are no announcements at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.isPinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.publishedAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
