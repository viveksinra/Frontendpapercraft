'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { listThreads, createThread } from '@/lib/discussion-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  AlertCircle,
  MessageCircle,
  Search,
  Plus,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

const CATEGORIES = ['General', 'Academic', 'Help', 'Off-Topic'];

export default function StudentDiscussionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [creating, setCreating] = useState(false);

  async function fetchThreads() {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      const data = await listThreads(companyId, params);
      setThreads(data.threads || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load discussions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchThreads();
  }, [companyId, category]);

  function handleSearch() {
    fetchThreads();
  }

  async function handleCreate() {
    if (!newTitle.trim() || !newBody.trim() || creating) return;
    setCreating(true);
    try {
      await createThread(companyId, {
        title: newTitle.trim(),
        body: newBody.trim(),
        category: newCategory,
      });
      setNewTitle('');
      setNewBody('');
      setShowCreate(false);
      fetchThreads();
    } catch (err: any) {
      setError(err.message || 'Failed to create thread.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discussions</h1>
          <p className="mt-1 text-muted-foreground">Join conversations with your peers.</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-2 h-4 w-4" />
          New Thread
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Thread title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="What do you want to discuss?"
              rows={3}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Post
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : threads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No discussions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {threads.map((thread: any) => (
            <Card
              key={thread.id || thread._id}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => router.push(`/student/discussions/${thread.id || thread._id}`)}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{thread.title}</span>
                    {thread.category && (
                      <Badge variant="secondary" className="text-xs">
                        {thread.category}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {thread.body}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      By {thread.author?.name || thread.author?.firstName || 'Anonymous'}
                    </span>
                    {thread.createdAt && (
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {thread.upvotes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {thread.replyCount || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
