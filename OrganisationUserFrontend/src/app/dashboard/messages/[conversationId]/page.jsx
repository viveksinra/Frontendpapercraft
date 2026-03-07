'use client';

import { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Loader2, ArrowLeft } from 'lucide-react';

import { paths } from 'src/routes/paths';

import { getActiveCompanyIdFromCookie } from 'src/lib/company-api';
import {
  sendMessage,
  markConversationRead,
  getConversationMessages,
} from 'src/lib/message-api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

function formatMessageTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(date) {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
}

// ----------------------------------------------------------------------

export default function ConversationDetailPage() {
  const router = useRouter();
  const { conversationId } = useParams();
  const { user } = useAuthContext();
  const activeCompanyId = getActiveCompanyIdFromCookie();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    if (!activeCompanyId || !conversationId) {
      setError('Missing company or conversation');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getConversationMessages(activeCompanyId, conversationId);
        if (!cancelled) {
          setMessages(data?.messages || data || []);
          setOtherUser(data?.otherUser || null);
          // Mark conversation as read
          markConversationRead(activeCompanyId, conversationId).catch(() => {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load messages');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeCompanyId, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const result = await sendMessage(activeCompanyId, {
        recipientId: conversationId,
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, result?.message || result]);
      setNewMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  const displayName = otherUser?.displayName || otherUser?.email || 'Conversation';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group messages by date for date separators
  let lastDate = '';

  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex flex-col gap-4 h-[calc(100vh-200px)]">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(paths.dashboard.messages.root)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{displayName}</h1>
            {otherUser?.email && otherUser?.displayName && (
              <p className="text-xs text-muted-foreground">{otherUser.email}</p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No messages yet. Send the first message below.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const msgId = msg._id || msg.id || index;
              const isOwnMessage =
                msg.senderId === user?.id ||
                msg.senderId === user?._id ||
                msg.sender?.id === user?.id;
              const msgDate = formatDateSeparator(msg.createdAt);
              let showDateSep = false;
              if (msgDate !== lastDate) {
                lastDate = msgDate;
                showDateSep = true;
              }

              return (
                <div key={msgId}>
                  {showDateSep && (
                    <div className="flex items-center gap-2 my-4">
                      <div className="flex-1 border-t" />
                      <span className="text-xs text-muted-foreground px-2">{msgDate}</span>
                      <div className="flex-1 border-t" />
                    </div>
                  )}
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={`mt-1 text-[10px] ${
                          isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-4 border-t">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" disabled={!newMessage.trim() || sending} size="icon">
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
