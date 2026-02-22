'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, Bell, BellOff, Save } from 'lucide-react';
import axiosInstance, { endpoints } from '@/lib/axios';

export function ParentProfileForm() {
  const { user, checkUserSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [notifications, setNotifications] = useState({
    emailResults: true,
    emailUpcoming: true,
    emailWeeklyReport: false,
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.patch('/api/v2/parent/profile', {
        firstName,
        lastName,
        notificationPreferences: notifications,
      });
      await checkUserSession();
      toast.success('Profile updated successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">New Results</p>
              <p className="text-xs text-muted-foreground">
                Get notified when your child completes a test
              </p>
            </div>
            <Button
              variant={notifications.emailResults ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setNotifications((prev) => ({
                  ...prev,
                  emailResults: !prev.emailResults,
                }))
              }
              disabled={loading}
            >
              {notifications.emailResults ? (
                <Bell className="mr-1 h-3 w-3" />
              ) : (
                <BellOff className="mr-1 h-3 w-3" />
              )}
              {notifications.emailResults ? 'On' : 'Off'}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Upcoming Tests</p>
              <p className="text-xs text-muted-foreground">
                Reminders about scheduled tests
              </p>
            </div>
            <Button
              variant={notifications.emailUpcoming ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setNotifications((prev) => ({
                  ...prev,
                  emailUpcoming: !prev.emailUpcoming,
                }))
              }
              disabled={loading}
            >
              {notifications.emailUpcoming ? (
                <Bell className="mr-1 h-3 w-3" />
              ) : (
                <BellOff className="mr-1 h-3 w-3" />
              )}
              {notifications.emailUpcoming ? 'On' : 'Off'}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly Report</p>
              <p className="text-xs text-muted-foreground">
                Weekly summary of your child&apos;s progress
              </p>
            </div>
            <Button
              variant={notifications.emailWeeklyReport ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setNotifications((prev) => ({
                  ...prev,
                  emailWeeklyReport: !prev.emailWeeklyReport,
                }))
              }
              disabled={loading}
            >
              {notifications.emailWeeklyReport ? (
                <Bell className="mr-1 h-3 w-3" />
              ) : (
                <BellOff className="mr-1 h-3 w-3" />
              )}
              {notifications.emailWeeklyReport ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
