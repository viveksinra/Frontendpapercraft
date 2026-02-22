'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enrollInCourse } from '@/lib/course-api';
import { Loader2 } from 'lucide-react';

interface CourseEnrollButtonProps {
  course: any;
  isEnrolled: boolean;
  courseSlug: string;
  isParent?: boolean;
  children?: any[];
  onEnrolled?: () => void;
}

export default function CourseEnrollButton({
  course,
  isEnrolled,
  courseSlug,
  isParent = false,
  children: linkedChildren,
  onEnrolled,
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const pricing = course.pricing || {};
  const isFree = pricing.isFree;

  if (isEnrolled && !isParent) {
    return (
      <button
        className="w-full py-3 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        onClick={() => router.push(`/student/courses/${courseSlug}/learn`)}
      >
        Continue Learning
      </button>
    );
  }

  async function handleEnroll() {
    setLoading(true);
    try {
      if (isParent && selectedChild) {
        const { enrollChildInCourse } = await import('@/lib/course-api');
        await enrollChildInCourse(selectedChild, course._id || course.id);
      } else {
        await enrollInCourse(course._id || course.id);
      }
      onEnrolled?.();
      if (!isParent) {
        router.push(`/student/courses/${courseSlug}/learn`);
      }
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  function handlePaidEnroll() {
    const checkoutPath = isParent
      ? `/checkout?type=course&courseId=${course._id || course.id}&childId=${selectedChild}`
      : `/student/checkout?type=course&courseId=${course._id || course.id}`;
    router.push(checkoutPath);
  }

  return (
    <div className="space-y-3">
      {isParent && linkedChildren && linkedChildren.length > 0 && (
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="">Select child...</option>
          {linkedChildren.map((child: any) => (
            <option key={child.id || child._id} value={child.id || child._id}>
              {child.name || child.firstName || 'Child'}
            </option>
          ))}
        </select>
      )}

      {isFree ? (
        <button
          className="w-full py-3 px-4 rounded-md bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
          onClick={handleEnroll}
          disabled={loading || (isParent && !selectedChild)}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            'Enroll Free'
          )}
        </button>
      ) : (
        <button
          className="w-full py-3 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          onClick={handlePaidEnroll}
          disabled={isParent && !selectedChild}
        >
          Buy &amp; Enroll — {pricing.currency === 'INR' ? '₹' : '£'}
          {(pricing.basePrice || 0).toFixed(2)}
        </button>
      )}
    </div>
  );
}
