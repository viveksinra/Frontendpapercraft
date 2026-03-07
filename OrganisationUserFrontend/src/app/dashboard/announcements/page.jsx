'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pin, Plus, Trash2, Loader2, Megaphone } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import { pinAnnouncement, listAnnouncements, deleteAnnouncement } from 'src/lib/announcement-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ----------------------------------------------------------------------

export default function AnnouncementsListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const activeCompanyId = getActiveCompanyIdFromCookie();

  async function load() {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await listAnnouncements(activeCompanyId);
      const list = data?.announcements || data;
      setAnnouncements(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompanyId]);

  async function handleDelete(id) {
    if (!confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(activeCompanyId, id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete announcement');
    }
  }

  async function handlePin(id) {
    try {
      await pinAnnouncement(activeCompanyId, id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to pin/unpin announcement');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
            <p className="text-sm text-muted-foreground">
              Post announcements for your classes or entire organisation.
            </p>
          </div>
          <Button onClick={() => router.push(paths.dashboard.announcements.create)}>
            <Plus className="mr-2 h-4 w-4" /> Create Announcement
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {announcements?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Megaphone className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {announcements?.map((a) => {
              const id = a._id || a.id;
              return (
                <div
                  key={id}
                  className="rounded-lg border p-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {a.isPinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                        <h3 className="font-semibold text-sm">{a.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">
                          {a.audience === 'organization' ? 'Org-wide' : 'Class'}
                        </Badge>
                        <span>{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB') : ''}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" aria-label={a.isPinned ? 'Unpin' : 'Pin'} onClick={() => handlePin(id)} title={a.isPinned ? 'Unpin' : 'Pin'}>
                        <Pin className={`h-4 w-4 ${a.isPinned ? 'text-amber-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete announcement" onClick={() => handleDelete(id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{a.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
