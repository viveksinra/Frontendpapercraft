'use client';

import { Bell, FileCheck, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ParentAlertsListProps {
  alerts: any[];
}

function getAlertConfig(type?: string) {
  switch (type) {
    case 'new_result':
    case 'result':
      return {
        icon: FileCheck,
        color: 'text-green-600',
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
      };
    case 'overdue':
    case 'overdue_homework':
      return {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-200 dark:border-orange-800',
      };
    case 'upcoming_test':
    case 'upcoming':
      return {
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
      };
    default:
      return {
        icon: Bell,
        color: 'text-muted-foreground',
        bg: 'bg-muted/50',
        border: 'border-border',
      };
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function ParentAlertsList({ alerts }: ParentAlertsListProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center">
        <Bell className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No alerts at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert: any, index: number) => {
        const config = getAlertConfig(alert.type);
        const Icon = config.icon;

        return (
          <Card key={alert.id || index} className={cn('border', config.border, config.bg)}>
            <CardContent className="flex items-start gap-3 p-3">
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.title || alert.message}</p>
                {alert.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {alert.description}
                  </p>
                )}
                {alert.childName && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {alert.childName}
                  </p>
                )}
              </div>
              {alert.date && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(alert.date)}
                </span>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
