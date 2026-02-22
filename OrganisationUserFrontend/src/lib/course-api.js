import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Course CRUD ──────────────────────────────────────────────────────────────

export async function listCourses(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.courses.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function createCourse(companyId, data) {
  const url = backendUrl(v2Endpoints.courses.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getCourse(companyId, courseId) {
  const url = backendUrl(v2Endpoints.courses.detail(companyId, courseId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function updateCourse(companyId, courseId, data) {
  const url = backendUrl(v2Endpoints.courses.update(companyId, courseId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteCourse(companyId, courseId) {
  const url = backendUrl(v2Endpoints.courses.delete(companyId, courseId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Publish / Unpublish / Archive / Duplicate ────────────────────────────────

export async function publishCourse(companyId, courseId) {
  const url = backendUrl(v2Endpoints.courses.publish(companyId, courseId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function unpublishCourse(companyId, courseId) {
  const url = backendUrl(v2Endpoints.courses.unpublish(companyId, courseId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function archiveCourse(companyId, courseId) {
  const url = backendUrl(v2Endpoints.courses.archive(companyId, courseId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function duplicateCourse(companyId, courseId) {
  const url = backendUrl(v2Endpoints.courses.duplicate(companyId, courseId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

// ─── Course Content: Sections ─────────────────────────────────────────────────

export async function addSection(companyId, courseId, data) {
  const url = backendUrl(v2Endpoints.courseContent.addSection(companyId, courseId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateSection(companyId, courseId, sectionId, data) {
  const url = backendUrl(v2Endpoints.courseContent.updateSection(companyId, courseId, sectionId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteSection(companyId, courseId, sectionId) {
  const url = backendUrl(v2Endpoints.courseContent.deleteSection(companyId, courseId, sectionId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function reorderSections(companyId, courseId, data) {
  const url = backendUrl(v2Endpoints.courseContent.reorderSections(companyId, courseId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}

// ─── Course Content: Lessons ──────────────────────────────────────────────────

export async function addLesson(companyId, courseId, sectionId, data) {
  const url = backendUrl(v2Endpoints.courseContent.addLesson(companyId, courseId, sectionId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateLesson(companyId, courseId, sectionId, lessonId, data) {
  const url = backendUrl(v2Endpoints.courseContent.updateLesson(companyId, courseId, sectionId, lessonId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteLesson(companyId, courseId, sectionId, lessonId) {
  const url = backendUrl(v2Endpoints.courseContent.deleteLesson(companyId, courseId, sectionId, lessonId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function reorderLessons(companyId, courseId, sectionId, data) {
  const url = backendUrl(v2Endpoints.courseContent.reorderLessons(companyId, courseId, sectionId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function moveLesson(companyId, courseId, lessonId, data) {
  const url = backendUrl(v2Endpoints.courseContent.moveLesson(companyId, courseId, lessonId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function setLessonContent(companyId, courseId, sectionId, lessonId, data) {
  const url = backendUrl(v2Endpoints.courseContent.setContent(companyId, courseId, sectionId, lessonId));
  const res = await axios.put(url, data, { headers: headers(companyId) });
  return res.data;
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export async function getUploadUrl(companyId, courseId, type, data) {
  const endpoints = {
    video: v2Endpoints.courseUpload.video,
    pdf: v2Endpoints.courseUpload.pdf,
    resource: v2Endpoints.courseUpload.resource,
    thumbnail: v2Endpoints.courseUpload.thumbnail,
  };
  const endpointFn = endpoints[type];
  if (!endpointFn) throw new Error(`Unknown upload type: ${type}`);
  const url = backendUrl(endpointFn(companyId, courseId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function confirmUpload(companyId, courseId, data) {
  const url = backendUrl(v2Endpoints.courseUpload.confirm(companyId, courseId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getCourseAnalytics(companyId, courseId, params = {}) {
  const url = backendUrl(v2Endpoints.courseAnalytics.overview(companyId, courseId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getCourseEnrollments(companyId, courseId, params = {}) {
  const url = backendUrl(v2Endpoints.courseAnalytics.enrollments(companyId, courseId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getCourseFunnel(companyId, courseId, params = {}) {
  const url = backendUrl(v2Endpoints.courseAnalytics.funnel(companyId, courseId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getLessonAnalytics(companyId, courseId, lessonId, params = {}) {
  const url = backendUrl(v2Endpoints.courseAnalytics.lessonAnalytics(companyId, courseId, lessonId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getCourseReviews(companyId, courseId, params = {}) {
  const url = backendUrl(v2Endpoints.courseAnalytics.reviews(companyId, courseId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function toggleReviewVisibility(companyId, courseId, enrollmentId) {
  const url = backendUrl(v2Endpoints.courseAnalytics.toggleVisibility(companyId, courseId, enrollmentId));
  const res = await axios.patch(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function getInstituteCourseAnalytics(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.courseAnalytics.institute(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}
