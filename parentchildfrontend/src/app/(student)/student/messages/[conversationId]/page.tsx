'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  getConversationMessages,
  sendMessage,
  markConversationRead,
} from '@/lib/message-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function StudentConversationPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;
  const companyId = user?.organizations?.[0]?.companyId || '';
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!companyId || !conversationId) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getConversationMessages(companyId, conversationId);
        setMessages(data.messages || data || []);
        await markConversationRead(companyId, conversationId).catch(() => {});
      } catch (err: any) {
        setError(err.message || 'Failed to load messages.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [companyId, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(companyId, {
        recipientId: conversationId,
        recipientRole: 'teacher',
        body: newMessage.trim(),
      });
      setNewMessage('');
      const data = await getConversationMessages(companyId, conversationId);
      setMessages(data.messages || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/student/messages')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-lg font-semibold">Conversation</h1>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-card p-4">
            {messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No messages yet. Start the conversation below.
              </p>
            ) : (
              messages.map((msg: any, idx: number) => {
                const isMine = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id || msg._id || idx}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                        isMine
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.subject && (
                        <p className="mb-1 text-xs font-semibold opacity-80">{msg.subject}</p>
                      )}
                      <p>{msg.body}</p>
                      {msg.createdAt && (
                        <p className={`mt-1 text-xs ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              aria-label="Message text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={sending}
            />
            <Button aria-label="Send message" onClick={handleSend} disabled={sending || !newMessage.trim()}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
