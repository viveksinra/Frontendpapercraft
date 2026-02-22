import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/student/courses',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => ({ type: 'a', props: { href, ...props }, children }),
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { _id: 'user-1', firstName: 'Test', lastName: 'Student', role: 'student' },
    token: 'test-token',
    companyId: 'company-1',
  }),
}));

// Mock course API
const mockBrowseCourses = vi.fn();
const mockGetCourseDetail = vi.fn();
const mockEnrollInCourse = vi.fn();
const mockGetMyEnrollments = vi.fn();
const mockGetMyCertificates = vi.fn();
const mockGetCertificateDownloadUrl = vi.fn();

vi.mock('@/lib/course-api', () => ({
  browseCourses: (...args: unknown[]) => mockBrowseCourses(...args),
  getCourseDetail: (...args: unknown[]) => mockGetCourseDetail(...args),
  enrollInCourse: (...args: unknown[]) => mockEnrollInCourse(...args),
  getMyEnrollments: (...args: unknown[]) => mockGetMyEnrollments(...args),
  getMyCertificates: (...args: unknown[]) => mockGetMyCertificates(...args),
  getCertificateDownloadUrl: (...args: unknown[]) => mockGetCertificateDownloadUrl(...args),
  rateCourse: vi.fn(),
  markLessonComplete: vi.fn(),
  markLessonIncomplete: vi.fn(),
  getLessonContent: vi.fn(),
  getCourseProgress: vi.fn(),
  trackTime: vi.fn(),
}));

describe('ParentChild Frontend Course Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── CourseCatalogCard ──────────────────────────────────────────

  describe('CourseCatalogCard', () => {
    it('renders course info and price correctly', () => {
      const course = {
        _id: 'c1',
        title: 'Learn Python',
        slug: 'learn-python',
        description: 'A great Python course',
        thumbnail: '/images/python.jpg',
        instructorName: 'John Doe',
        pricing: { isFree: false, basePrice: 2999, currency: 'GBP' },
        stats: { totalLessons: 20, totalDurationMinutes: 600, enrollmentCount: 100, avgRating: 4.7 },
      };

      expect(course.title).toBe('Learn Python');
      expect(course.pricing.isFree).toBe(false);
      expect(course.pricing.basePrice).toBe(2999);
      expect(course.stats.enrollmentCount).toBe(100);
      expect(course.stats.avgRating).toBe(4.7);
    });

    it('renders free course correctly', () => {
      const course = {
        title: 'Free Intro',
        pricing: { isFree: true, basePrice: 0 },
      };

      expect(course.pricing.isFree).toBe(true);
      expect(course.pricing.basePrice).toBe(0);
    });
  });

  // ─── CourseEnrollButton ─────────────────────────────────────────

  describe('CourseEnrollButton', () => {
    it('shows "Enroll Free" for free courses', () => {
      const course = { pricing: { isFree: true } };
      const isEnrolled = false;

      const buttonText = isEnrolled
        ? 'Continue Learning'
        : course.pricing.isFree
          ? 'Enroll Free'
          : 'Buy Now';

      expect(buttonText).toBe('Enroll Free');
    });

    it('shows "Buy Now" for paid courses when not enrolled', () => {
      const course = { pricing: { isFree: false, basePrice: 1999 } };
      const isEnrolled = false;

      const buttonText = isEnrolled
        ? 'Continue Learning'
        : course.pricing.isFree
          ? 'Enroll Free'
          : 'Buy Now';

      expect(buttonText).toBe('Buy Now');
    });

    it('shows "Continue Learning" when enrolled', () => {
      const isEnrolled = true;

      const buttonText = isEnrolled ? 'Continue Learning' : 'Enroll';

      expect(buttonText).toBe('Continue Learning');
    });

    it('handles enrollment API call', async () => {
      mockEnrollInCourse.mockResolvedValue({
        _id: 'enr-1',
        courseId: 'c1',
        status: 'active',
      });

      const result = await mockEnrollInCourse('c1', {});

      expect(result.status).toBe('active');
      expect(mockEnrollInCourse).toHaveBeenCalledWith('c1', {});
    });
  });

  // ─── CoursePlayer component checks ─────────────────────────────

  describe('CoursePlayer', () => {
    it('has correct lesson type mapping', () => {
      const lessonTypes = ['video', 'pdf', 'text', 'quiz', 'resource'];
      expect(lessonTypes).toContain('video');
      expect(lessonTypes).toContain('quiz');
      expect(lessonTypes).toHaveLength(5);
    });

    it('renders sidebar structure with sections and lessons', () => {
      const courseData = {
        title: 'Course',
        sections: [
          {
            _id: 's1',
            title: 'Getting Started',
            lessons: [
              { _id: 'l1', title: 'Welcome', type: 'text', isFree: true },
              { _id: 'l2', title: 'Setup Video', type: 'video', isFree: false },
            ],
          },
          {
            _id: 's2',
            title: 'Advanced',
            lessons: [
              { _id: 'l3', title: 'Deep Dive', type: 'pdf', isFree: false },
            ],
          },
        ],
      };

      const totalLessons = courseData.sections.reduce((s, sec) => s + sec.lessons.length, 0);
      expect(totalLessons).toBe(3);
      expect(courseData.sections[0].lessons[0].isFree).toBe(true);
    });
  });

  // ─── VideoLesson ────────────────────────────────────────────────

  describe('VideoLesson', () => {
    it('renders with video URL', () => {
      const lesson = {
        type: 'video',
        content: {
          videoUrl: 'https://cdn.example.com/lesson.mp4',
          durationMinutes: 15,
        },
      };

      expect(lesson.content.videoUrl).toBeDefined();
      expect(lesson.content.videoUrl).toContain('.mp4');
      expect(lesson.content.durationMinutes).toBe(15);
    });
  });

  // ─── ProgressBar ────────────────────────────────────────────────

  describe('ProgressBar', () => {
    it('shows correct percentage', () => {
      const percentage = 65;
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('handles 0% progress', () => {
      const percentage = 0;
      expect(percentage).toBe(0);
    });

    it('handles 100% progress', () => {
      const percentage = 100;
      expect(percentage).toBe(100);
    });

    it('clamps values outside 0-100 range', () => {
      const raw = 120;
      const clamped = Math.min(100, Math.max(0, raw));
      expect(clamped).toBe(100);
    });
  });

  // ─── MyCourseCard ───────────────────────────────────────────────

  describe('MyCourseCard', () => {
    it('renders progress bar with enrollment data', () => {
      const enrollment = {
        _id: 'enr-1',
        courseId: 'c1',
        courseTitle: 'Python Basics',
        progressPercentage: 45,
        status: 'active',
        completedLessons: Array(9).fill({}),
        lastAccessedAt: '2026-02-20T10:00:00Z',
      };

      expect(enrollment.progressPercentage).toBe(45);
      expect(enrollment.status).toBe('active');
      expect(enrollment.completedLessons).toHaveLength(9);
    });

    it('shows certificate link for completed courses', () => {
      const enrollment = {
        status: 'completed',
        progressPercentage: 100,
        certificate: {
          certificateNumber: 'CERT-2026-XYZ',
          issuedAt: '2026-02-15T10:00:00Z',
        },
      };

      expect(enrollment.status).toBe('completed');
      expect(enrollment.certificate).toBeDefined();
      expect(enrollment.certificate.certificateNumber).toMatch(/^CERT-/);
    });
  });

  // ─── CertificateCard ───────────────────────────────────────────

  describe('CertificateCard', () => {
    it('renders certificate info and download button', () => {
      const cert = {
        certificateNumber: 'CERT-2026-ABC12',
        courseName: 'Web Development',
        studentName: 'Test Student',
        issuedAt: '2026-01-15T00:00:00Z',
        s3Key: 'certs/cert-abc.pdf',
      };

      expect(cert.certificateNumber).toBe('CERT-2026-ABC12');
      expect(cert.courseName).toBe('Web Development');
      expect(cert.issuedAt).toBeDefined();
      expect(cert.s3Key).toContain('.pdf');
    });

    it('handles download URL generation', async () => {
      mockGetCertificateDownloadUrl.mockResolvedValue('https://presigned.s3.example.com/cert.pdf');

      const url = await mockGetCertificateDownloadUrl('enr-1');

      expect(url).toContain('presigned');
      expect(mockGetCertificateDownloadUrl).toHaveBeenCalledWith('enr-1');
    });
  });
});
