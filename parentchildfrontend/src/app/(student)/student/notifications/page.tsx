'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
} from '@/lib/notification-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Bell,
  CheckCheck,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'academic', label: 'Academic' },
  { value: 'message', label: 'Messages' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'gamification', label: 'Gamification' },
  { value: 'system', label: 'System' },
];

const CATEGORY_ICONS: Record<string, any> = {
  academic: CheckCircle,
  message: MessageSquare,
  announcement: Info,
  gamification: CheckCircle,
  system: AlertTriangle,
};

export default function StudentNotificationsPage() {
  const { user } = useAuth();
  const companyId = user?.organizations?.[0]?.companyId || '';

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');

  async function loadNotifications() {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (category && category !== 'all') params.category = category;
      const data = await getNotifications(companyId, params);
      setNotifications(data.notifications || data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [companyId, category]);

  async function handleMarkRead(notificationId: string) {
    try {
      await markNotificationAsRead(companyId, notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          (n.id || n._id) === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch {}
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead(companyId, category !== 'all' ? category : undefined);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  }

  async function handleArchive(notificationId: string) {
    try {
      await archiveNotification(companyId, notificationId);
      setNotifications((prev) =>
        prev.filter((n) => (n.id || n._id) !== notificationId)
      );
    } catch {}
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-sm text-destructive">{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No notifications.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif: any) => {
            const id = notif.id || notif._id;
            const IconComp = CATEGORY_ICONS[notif.category] || Bell;
            return (
              <Card
                key={id}
                className={`transition-colors ${!notif.isRead ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    !notif.isRead ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <IconComp className={`h-4 w-4 ${!notif.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${!notif.isRead ? 'font-semibold' : ''}`}>
                        {notif.title || 'Notification'}
                      </span>
                      {notif.category && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {notif.category}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{notif.body || notif.message}</p>
                    {notif.createdAt && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!notif.isRead && (
                      <Button variant="ghost" size="sm" aria-label="Mark as read" onClick={() => handleMarkRead(id)}>
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" aria-label="Archive notification" onClick={() => handleArchive(id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
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
