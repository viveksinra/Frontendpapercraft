import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

// ─── Class CRUD ────────────────────────────────────────────────────────────

export async function listClasses(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.classes.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getClass(companyId, classId) {
  const url = backendUrl(v2Endpoints.classes.detail(companyId, classId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createClass(companyId, data) {
  const url = backendUrl(v2Endpoints.classes.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updateClass(companyId, classId, data) {
  const url = backendUrl(v2Endpoints.classes.update(companyId, classId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deleteClass(companyId, classId) {
  const url = backendUrl(v2Endpoints.classes.delete(companyId, classId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Students ──────────────────────────────────────────────────────────────

export async function getClassStudents(companyId, classId) {
  const url = backendUrl(v2Endpoints.classes.students(companyId, classId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function addStudentsToClass(companyId, classId, studentUserIds) {
  const url = backendUrl(v2Endpoints.classes.students(companyId, classId));
  const res = await axios.post(url, { studentUserIds }, { headers: headers(companyId) });
  return res.data;
}

export async function removeStudentFromClass(companyId, classId, studentId) {
  const url = backendUrl(v2Endpoints.classes.removeStudent(companyId, classId, studentId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Teachers ──────────────────────────────────────────────────────────────

export async function addTeacherToClass(companyId, classId, teacherUserId) {
  const url = backendUrl(v2Endpoints.classes.teachers(companyId, classId));
  const res = await axios.post(url, { teacherUserId }, { headers: headers(companyId) });
  return res.data;
}

export async function removeTeacherFromClass(companyId, classId, teacherId) {
  const url = backendUrl(v2Endpoints.classes.removeTeacher(companyId, classId, teacherId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

// ─── Performance ───────────────────────────────────────────────────────────

export async function getClassPerformance(companyId, classId) {
  const url = backendUrl(v2Endpoints.classes.performance(companyId, classId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}
