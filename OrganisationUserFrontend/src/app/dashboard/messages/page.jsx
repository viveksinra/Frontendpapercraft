'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Search, Loader2 } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getConversations } from 'src/lib/message-api';
import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

function formatTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-GB');
}

// ----------------------------------------------------------------------

export default function MessagesInboxPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeMessage, setComposeMessage] = useState('');

  useEffect(() => {
    if (!activeCompanyId) {
      setError('No active company selected');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getConversations(activeCompanyId);
        if (!cancelled) {
          setConversations(data?.conversations || data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load conversations');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeCompanyId]);

  const filtered = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (conv.otherUser?.displayName || conv.otherUser?.email || '').toLowerCase();
    const lastMsg = (conv.lastMessage?.content || '').toLowerCase();
    return name.includes(q) || lastMsg.includes(q);
  });

  function handleOpenConversation(conv) {
    const otherId = conv.otherUser?._id || conv.otherUser?.id || conv.otherUserId;
    if (otherId) {
      router.push(paths.dashboard.messages.conversation(otherId));
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-sm text-muted-foreground">
              Your conversations and direct messages.
            </p>
          </div>
          <Button onClick={() => setComposeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Compose
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Conversations list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {conversations.length === 0
                ? 'No conversations yet. Start one by clicking Compose.'
                : 'No conversations match your search.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-md border">
            {filtered.map((conv, index) => {
              const otherId = conv.otherUser?._id || conv.otherUser?.id || conv.otherUserId;
              const displayName = conv.otherUser?.displayName || conv.otherUser?.email || 'Unknown User';
              const lastMsg = conv.lastMessage?.content || '';
              const lastTime = conv.lastMessage?.createdAt || conv.updatedAt;
              const unread = conv.unreadCount > 0;

              return (
                <button
                  type="button"
                  key={otherId || index}
                  onClick={() => handleOpenConversation(conv)}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    index > 0 ? 'border-t' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${unread ? 'font-semibold' : 'font-medium'}`}>
                        {displayName}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatTimeAgo(lastTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`truncate text-xs ${unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {lastMsg || 'No messages yet'}
                      </p>
                      {unread && (
                        <Badge variant="default" className="h-5 min-w-[20px] justify-center rounded-full px-1.5 text-[10px]">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Recipient</label>
              <Input
                placeholder="Enter email or name..."
                value={composeRecipient}
                onChange={(e) => setComposeRecipient(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Message</label>
              <textarea
                rows={4}
                value={composeMessage}
                onChange={(e) => setComposeMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!composeRecipient.trim() || !composeMessage.trim()}
              onClick={() => {
                // For now, close dialog. Integration with sendMessage API
                // requires recipient lookup to resolve userId.
                setComposeOpen(false);
                setComposeRecipient('');
                setComposeMessage('');
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
