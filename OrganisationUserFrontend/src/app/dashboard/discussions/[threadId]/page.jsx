'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Flag,
  Pin,
  Lock,
  CheckCircle,
} from 'lucide-react';

import { paths } from 'src/routes/paths';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  getThread,
  getReplies,
  createReply,
  upvoteThread,
  upvoteReply,
  flagThread,
  flagReply,
} from 'src/lib/discussion-api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

function formatTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ----------------------------------------------------------------------

export default function ThreadDetailPage() {
  const router = useRouter();
  const { threadId } = useParams();
  const { user } = useAuthContext();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (!activeCompanyId || !threadId) {
      setError('Missing company or thread');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [threadData, repliesData] = await Promise.all([
          getThread(activeCompanyId, threadId),
          getReplies(activeCompanyId, threadId),
        ]);
        if (!cancelled) {
          setThread(threadData?.thread || threadData);
          setReplies(repliesData?.replies || repliesData || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load thread');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeCompanyId, threadId]);

  async function handleUpvoteThread() {
    try {
      await upvoteThread(activeCompanyId, threadId);
      setThread((prev) => ({
        ...prev,
        upvoteCount: (prev.upvoteCount || 0) + 1,
      }));
    } catch (err) {
      setError(err.message || 'Failed to upvote');
    }
  }

  async function handleUpvoteReply(replyId) {
    try {
      await upvoteReply(activeCompanyId, replyId);
      setReplies((prev) =>
        prev.map((r) =>
          (r._id || r.id) === replyId
            ? { ...r, upvoteCount: (r.upvoteCount || 0) + 1 }
            : r
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to upvote reply');
    }
  }

  async function handleFlagThread() {
    try {
      await flagThread(activeCompanyId, threadId);
    } catch (err) {
      setError(err.message || 'Failed to flag thread');
    }
  }

  async function handleSubmitReply(e) {
    e.preventDefault();
    if (!replyContent.trim() || submittingReply) return;

    try {
      setSubmittingReply(true);
      const result = await createReply(activeCompanyId, threadId, {
        content: replyContent.trim(),
      });
      setReplies((prev) => [...prev, result?.reply || result]);
      setReplyContent('');
      setThread((prev) => ({
        ...prev,
        replyCount: (prev.replyCount || 0) + 1,
      }));
    } catch (err) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container max-w-screen-lg mx-auto px-4 py-6">
        <p className="text-sm text-muted-foreground">Thread not found.</p>
      </div>
    );
  }

  const authorName = thread.author?.displayName || thread.author?.email || 'Anonymous';

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Back button */}
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => router.push(paths.dashboard.discussions.root)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Discussions
        </Button>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Thread */}
        <div className="rounded-lg border p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {thread.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
              {thread.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              <h1 className="text-xl font-bold">{thread.title}</h1>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{authorName}</span>
              <span>{formatTimeAgo(thread.createdAt)}</span>
              {thread.category && (
                <Badge variant="outline">{thread.category}</Badge>
              )}
            </div>

            <div className="prose prose-sm max-w-none mt-2">
              <p className="whitespace-pre-wrap text-sm">{thread.body || thread.content || ''}</p>
            </div>

            {/* Thread actions */}
            <div className="flex items-center gap-2 pt-3 border-t mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUpvoteThread}
                className="text-muted-foreground"
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                {thread.upvoteCount || 0}
              </Button>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {thread.replyCount || replies.length} replies
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFlagThread}
                className="text-muted-foreground ml-auto"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Replies ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No replies yet. Be the first to respond.
            </p>
          ) : (
            replies.map((reply) => {
              const replyId = reply._id || reply.id;
              const replyAuthor = reply.author?.displayName || reply.author?.email || 'Anonymous';
              const isAccepted = reply.isAcceptedAnswer;

              return (
                <div
                  key={replyId}
                  className={`rounded-lg border p-4 ${
                    isAccepted ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground text-sm">{replyAuthor}</span>
                        <span>{formatTimeAgo(reply.createdAt)}</span>
                        {isAccepted && (
                          <Badge variant="outline" className="border-green-500 text-green-700 text-[10px] h-5">
                            <CheckCircle className="mr-1 h-3 w-3" /> Accepted Answer
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpvoteReply(replyId)}
                      className="text-muted-foreground"
                    >
                      <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                      {reply.upvoteCount || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => flagReply(activeCompanyId, replyId).catch(() => {})}
                      className="text-muted-foreground ml-auto"
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply form */}
        {!thread.isLocked && (
          <form onSubmit={handleSubmitReply} className="flex flex-col gap-3 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Post a Reply</h3>
            <textarea
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              disabled={submittingReply}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!replyContent.trim() || submittingReply}>
                {submittingReply ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                {submittingReply ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </form>
        )}

        {thread.isLocked && (
          <div className="rounded-lg border p-4 text-center">
            <Lock className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">This thread is locked. Replies are disabled.</p>
          </div>
        )}
      </div>
    </div>
  );
}
