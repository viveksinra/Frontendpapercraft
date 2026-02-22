'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrgCourseMetricsTableProps {
  data: any[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function OrgCourseMetricsTable({ data }: OrgCourseMetricsTableProps) {
  if (!data?.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No organization course data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Metrics by Organization</CardTitle>
        <CardDescription>Course counts, enrollments, and revenue per institute.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Courses</TableHead>
                <TableHead className="text-right">Published</TableHead>
                <TableHead className="text-right">Enrollments</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((org: any, i: number) => (
                <TableRow key={org.orgId || i}>
                  <TableCell className="font-medium">{org.orgName || org.organizationName || '—'}</TableCell>
                  <TableCell className="text-right">{org.totalCourses || 0}</TableCell>
                  <TableCell className="text-right">{org.publishedCourses || 0}</TableCell>
                  <TableCell className="text-right">{(org.totalEnrollments || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(org.revenue || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
