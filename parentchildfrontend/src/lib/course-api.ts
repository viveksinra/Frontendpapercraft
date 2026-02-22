import axiosInstance, { endpoints } from './axios';

// ─── Catalog ──────────────────────────────────────────────────────────────────

export async function browseCourses(
  companyId: string,
  params?: {
    category?: string;
    level?: string;
    examType?: string;
    isFree?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }
) {
  const res = await axiosInstance.get(
    endpoints.courseCatalog.browse(companyId),
    { params }
  );
  return res.data;
}

export async function getCourseDetail(companyId: string, courseSlugOrId: string) {
  const res = await axiosInstance.get(
    endpoints.courseCatalog.detail(companyId, courseSlugOrId)
  );
  return res.data;
}

export async function getCourseReviews(
  companyId: string,
  courseSlugOrId: string,
  params?: { page?: number; limit?: number }
) {
  const res = await axiosInstance.get(
    endpoints.courseCatalog.reviews(companyId, courseSlugOrId),
    { params }
  );
  return res.data;
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export async function enrollInCourse(courseId: string, data?: { purchaseId?: string }) {
  const res = await axiosInstance.post(
    endpoints.courseEnrollment.enroll(courseId),
    data || {}
  );
  return res.data;
}

export async function getMyEnrollments(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const res = await axiosInstance.get(endpoints.courseEnrollment.myEnrollments, {
    params,
  });
  return res.data;
}

export async function getCourseProgress(courseId: string) {
  const res = await axiosInstance.get(
    endpoints.courseEnrollment.progress(courseId)
  );
  return res.data;
}

export async function dropCourse(courseId: string) {
  const res = await axiosInstance.post(
    endpoints.courseEnrollment.drop(courseId)
  );
  return res.data;
}

// ─── Learning ─────────────────────────────────────────────────────────────────

export async function getLessonContent(
  courseId: string,
  sectionId: string,
  lessonId: string
) {
  const res = await axiosInstance.get(
    endpoints.courseEnrollment.content(courseId, sectionId, lessonId)
  );
  return res.data;
}

export async function markLessonComplete(
  courseId: string,
  data: { sectionId: string; lessonId: string; quizScore?: number }
) {
  const res = await axiosInstance.post(
    endpoints.courseEnrollment.complete(courseId),
    data
  );
  return res.data;
}

export async function markLessonIncomplete(
  courseId: string,
  data: { sectionId: string; lessonId: string }
) {
  const res = await axiosInstance.post(
    endpoints.courseEnrollment.incomplete(courseId),
    data
  );
  return res.data;
}

export async function trackTimeSpent(
  courseId: string,
  data: { sectionId: string; lessonId: string; seconds: number }
) {
  const res = await axiosInstance.post(
    endpoints.courseEnrollment.trackTime(courseId),
    data
  );
  return res.data;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function rateCourse(
  courseId: string,
  data: { rating: number; reviewText?: string }
) {
  const res = await axiosInstance.post(
    endpoints.courseEnrollment.rate(courseId),
    data
  );
  return res.data;
}

export async function updateRating(
  courseId: string,
  data: { rating: number; reviewText?: string }
) {
  const res = await axiosInstance.patch(
    endpoints.courseEnrollment.rate(courseId),
    data
  );
  return res.data;
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export async function getMyCertificates(params?: {
  page?: number;
  pageSize?: number;
}) {
  const res = await axiosInstance.get(endpoints.certificates.myCertificates, {
    params,
  });
  return res.data;
}

export async function getCourseCertificate(enrollmentId: string) {
  const res = await axiosInstance.get(
    endpoints.certificates.get(enrollmentId)
  );
  return res.data;
}

export async function downloadCertificate(enrollmentId: string) {
  const res = await axiosInstance.get(
    endpoints.certificates.download(enrollmentId)
  );
  return res.data;
}

// ─── Parent ───────────────────────────────────────────────────────────────────

export async function getChildCourses(
  childId: string,
  params?: { status?: string; page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(
    endpoints.parentCourses.childCourses(childId),
    { params }
  );
  return res.data;
}

export async function getChildCourseProgress(childId: string, courseId: string) {
  const res = await axiosInstance.get(
    endpoints.parentCourses.childProgress(childId, courseId)
  );
  return res.data;
}

export async function enrollChildInCourse(
  childId: string,
  courseId: string,
  data?: { purchaseId?: string }
) {
  const res = await axiosInstance.post(
    endpoints.parentCourses.enrollChild(childId, courseId),
    data || {}
  );
  return res.data;
}

export async function getChildCertificates(
  childId: string,
  params?: { page?: number; pageSize?: number }
) {
  const res = await axiosInstance.get(
    endpoints.parentCourses.childCertificates(childId),
    { params }
  );
  return res.data;
}
