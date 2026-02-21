import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function listPapers(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.papers.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getPaper(companyId, paperId) {
  const url = backendUrl(v2Endpoints.papers.detail(companyId, paperId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createPaper(companyId, data) {
  const url = backendUrl(v2Endpoints.papers.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updatePaper(companyId, paperId, data) {
  const url = backendUrl(v2Endpoints.papers.update(companyId, paperId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deletePaper(companyId, paperId) {
  const url = backendUrl(v2Endpoints.papers.delete(companyId, paperId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function autoGeneratePaper(companyId, data) {
  const url = backendUrl(v2Endpoints.papers.autoGenerate(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function getPaperStats(companyId) {
  const url = backendUrl(v2Endpoints.papers.stats(companyId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function addQuestionsToSection(companyId, paperId, sectionIndex, questionIds) {
  const url = backendUrl(v2Endpoints.papers.addQuestions(companyId, paperId, sectionIndex));
  const res = await axios.post(url, { questionIds }, { headers: headers(companyId) });
  return res.data;
}

export async function removeQuestionFromSection(companyId, paperId, sectionIndex, questionNumber) {
  const url = backendUrl(v2Endpoints.papers.removeQuestion(companyId, paperId, sectionIndex));
  const res = await axios.delete(url, { data: { questionNumber }, headers: headers(companyId) });
  return res.data;
}

export async function reorderQuestionsInSection(companyId, paperId, sectionIndex, orderedQuestionIds) {
  const url = backendUrl(v2Endpoints.papers.reorderQuestions(companyId, paperId, sectionIndex));
  const res = await axios.patch(url, { orderedQuestionIds }, { headers: headers(companyId) });
  return res.data;
}

export async function getSuggestedSwaps(companyId, paperId, sectionIndex, questionNumber) {
  const url = backendUrl(v2Endpoints.papers.suggestedSwaps(companyId, paperId, sectionIndex, questionNumber));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function swapQuestion(companyId, paperId, data) {
  const url = backendUrl(v2Endpoints.papers.swapQuestion(companyId, paperId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function finalizePaper(companyId, paperId) {
  const url = backendUrl(v2Endpoints.papers.finalize(companyId, paperId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function publishPaper(companyId, paperId) {
  const url = backendUrl(v2Endpoints.papers.publish(companyId, paperId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function unfinalizePaper(companyId, paperId) {
  const url = backendUrl(v2Endpoints.papers.unfinalize(companyId, paperId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function regeneratePdf(companyId, paperId) {
  const url = backendUrl(v2Endpoints.papers.generatePdf(companyId, paperId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function downloadPdf(companyId, paperId, pdfType) {
  const url = backendUrl(v2Endpoints.papers.download(companyId, paperId, pdfType));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}
