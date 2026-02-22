'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { useAuthContext } from 'src/auth/hooks';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import StudentAnalyticsTab from 'src/components/analytics/StudentAnalyticsTab';
import ClassAnalyticsTab from 'src/components/analytics/ClassAnalyticsTab';
import InstituteAnalyticsTab from 'src/components/analytics/InstituteAnalyticsTab';
import QuestionAnalyticsTab from 'src/components/analytics/QuestionAnalyticsTab';

// ----------------------------------------------------------------------

export default function AnalyticsDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthContext();

  const defaultTab = searchParams.get('tab') || 'student';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const handleTabChange = (value) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Performance insights for students, classes, and your institute.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="class">Class</TabsTrigger>
            {isAdmin && <TabsTrigger value="institute">Institute</TabsTrigger>}
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <StudentAnalyticsTab />
          </TabsContent>

          <TabsContent value="class">
            <ClassAnalyticsTab />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="institute">
              <InstituteAnalyticsTab />
            </TabsContent>
          )}

          <TabsContent value="questions">
            <QuestionAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
