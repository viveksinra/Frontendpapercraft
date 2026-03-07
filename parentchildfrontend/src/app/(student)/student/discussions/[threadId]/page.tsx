'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getThread, getReplies, createReply, upvoteThread, upvoteReply } from '@/lib/discussion-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  ThumbsUp,
  Send,
  MessageSquare,
} from 'lucide-react';

export default function StudentThreadDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const threadId = params.threadId as string;
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    if (!companyId || !threadId) return;
    setLoading(true);
    setError(null);
    try {
      const [threadData, repliesData] = await Promise.all([
        getThread(companyId, threadId),
        getReplies(companyId, threadId),
      ]);
      setThread(threadData.thread || threadData);
      setReplies(repliesData.replies || repliesData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load thread.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [companyId, threadId]);

  async function handleReply() {
    if (!replyBody.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createReply(companyId, threadId, { body: replyBody.trim() });
      setReplyBody('');
      const data = await getReplies(companyId, threadId);
      setReplies(data.replies || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to post reply.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvoteThread() {
    try {
      await upvoteThread(companyId, threadId);
      loadData();
    } catch {}
  }

  async function handleUpvoteReply(replyId: string) {
    try {
      await upvoteReply(companyId, replyId);
      const data = await getReplies(companyId, threadId);
      setReplies(data.replies || data || []);
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm text-destructive">{error || 'Thread not found.'}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/student/discussions')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discussions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/student/discussions')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Discussions
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{thread.title}</CardTitle>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  By {thread.author?.name || thread.author?.firstName || 'Anonymous'}
                </span>
                {thread.createdAt && (
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                )}
                {thread.category && (
                  <Badge variant="secondary">{thread.category}</Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" aria-label="Upvote thread" onClick={handleUpvoteThread}>
              <ThumbsUp className="mr-1 h-4 w-4" />
              {thread.upvotes || 0}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{thread.body}</p>
          {thread.tags && thread.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {thread.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-5 w-5" />
          Replies ({replies.length})
        </h2>

        <div className="space-y-3">
          {replies.map((reply: any) => (
            <Card key={reply.id || reply._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {reply.author?.name || reply.author?.firstName || 'Anonymous'}
                      </span>
                      {reply.createdAt && (
                        <span className="text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{reply.body}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Upvote reply"
                    onClick={() => handleUpvoteReply(reply.id || reply._id)}
                  >
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {reply.upvotes || 0}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <textarea
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Write a reply..."
            aria-label="Reply to discussion"
            rows={3}
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={handleReply} disabled={submitting || !replyBody.trim()}>
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
