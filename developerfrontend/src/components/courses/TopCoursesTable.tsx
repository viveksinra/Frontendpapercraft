'use client';

import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TopCoursesTableProps {
  data: any[];
}

export function TopCoursesTable({ data }: TopCoursesTableProps) {
  if (!data?.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No course data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Courses by Enrollment</CardTitle>
        <CardDescription>Most popular courses across all institutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Enrollments</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((course: any, i: number) => (
                <TableRow key={course.courseId || i}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {course.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {course.orgName || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {(course.enrollmentCount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {course.avgRating > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.avgRating.toFixed(1)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.status === 'published' ? 'success' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
