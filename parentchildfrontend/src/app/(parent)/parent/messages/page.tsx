'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getConversations, getUnreadMessageCount } from '@/lib/message-api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, MessageSquare, Search } from 'lucide-react';

export default function ParentMessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [conversations, setConversations] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!companyId) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [convData, unreadData] = await Promise.all([
          getConversations(companyId),
          getUnreadMessageCount(companyId),
        ]);
        setConversations(convData.conversations || convData || []);
        setUnreadCount(unreadData.count || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId]);

  const filtered = conversations.filter((c: any) => {
    if (!search) return true;
    const name = c.otherUser?.name || c.otherUser?.firstName || '';
    const subject = c.lastMessage?.subject || '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      subject.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-muted-foreground">
            Your conversations{unreadCount > 0 && ` - ${unreadCount} unread`}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          aria-label="Search conversations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
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
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No conversations yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((conv: any) => {
            const other = conv.otherUser || {};
            const name = other.name || `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'Unknown';
            const lastMsg = conv.lastMessage || {};
            const isUnread = conv.unreadCount > 0;
            const otherId = other.id || other._id || conv.otherUserId;

            return (
              <Card
                key={otherId}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${isUnread ? 'border-primary/30 bg-primary/5' : ''}`}
                onClick={() => router.push(`/parent/messages/${otherId}`)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                        {name}
                      </span>
                      {other.role && (
                        <Badge variant="outline" className="ml-2 text-xs capitalize">
                          {other.role}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {lastMsg.body || lastMsg.subject || 'No messages'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {lastMsg.createdAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(lastMsg.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {isUnread && (
                      <Badge variant="default" className="text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
