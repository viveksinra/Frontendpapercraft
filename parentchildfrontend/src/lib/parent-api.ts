import axiosInstance, { endpoints } from './axios';

export async function linkChild(studentCode: string, relationship: string = 'guardian') {
  const res = await axiosInstance.post(endpoints.parent.linkChild, {
    studentCode,
    relationship,
  });
  return res.data;
}

export async function unlinkChild(studentUserId: string) {
  const res = await axiosInstance.post(`${endpoints.parent.unlinkChild}/${studentUserId}`);
  return res.data;
}

export async function getChildren() {
  const res = await axiosInstance.get(endpoints.parent.children);
  return res.data;
}

export async function getDashboard() {
  const res = await axiosInstance.get(endpoints.parent.dashboard);
  return res.data;
}

export async function getChildTests(
  childId: string,
  params?: {
    status?: string;
    mode?: string;
    orgId?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const res = await axiosInstance.get(
    `${endpoints.parent.children}/${childId}/tests`,
    { params }
  );
  return res.data;
}

export async function getChildResults(
  childId: string,
  params?: {
    orgId?: string;
    from?: string;
    to?: string;
    subject?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const res = await axiosInstance.get(
    `${endpoints.parent.children}/${childId}/results`,
    { params }
  );
  return res.data;
}

export async function getChildResultDetail(childId: string, testId: string) {
  const res = await axiosInstance.get(
    `${endpoints.parent.children}/${childId}/results/${testId}`
  );
  return res.data;
}

export async function getChildPerformance(childId: string, orgId?: string) {
  const url = orgId
    ? `${endpoints.parent.children}/${childId}/performance/${orgId}`
    : `${endpoints.parent.children}/${childId}/performance`;
  const res = await axiosInstance.get(url);
  return res.data;
}

// Phase 5: Homework & Fees for children

export async function getChildHomework(childId: string) {
  const res = await axiosInstance.get(
    `${endpoints.parent.children}/${childId}/homework`
  );
  return res.data;
}

export async function getChildHomeworkDetail(childId: string, homeworkId: string) {
  const res = await axiosInstance.get(
    `${endpoints.parent.children}/${childId}/homework/${homeworkId}`
  );
  return res.data;
}

export async function getChildFees(childId: string) {
  const res = await axiosInstance.get(
    `${endpoints.parent.children}/${childId}/fees`
  );
  return res.data;
}
