import axios from 'src/lib/axios';
import { backendUrl, v2Endpoints } from 'src/lib/v2-endpoints';

function headers(companyId) {
  return { 'X-Company-ID': companyId };
}

export async function listPaperSets(companyId, params = {}) {
  const url = backendUrl(v2Endpoints.paperSets.list(companyId));
  const res = await axios.get(url, { params, headers: headers(companyId) });
  return res.data;
}

export async function getPaperSet(companyId, paperSetId) {
  const url = backendUrl(v2Endpoints.paperSets.detail(companyId, paperSetId));
  const res = await axios.get(url, { headers: headers(companyId) });
  return res.data;
}

export async function createPaperSet(companyId, data) {
  const url = backendUrl(v2Endpoints.paperSets.create(companyId));
  const res = await axios.post(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function updatePaperSet(companyId, paperSetId, data) {
  const url = backendUrl(v2Endpoints.paperSets.update(companyId, paperSetId));
  const res = await axios.patch(url, data, { headers: headers(companyId) });
  return res.data;
}

export async function deletePaperSet(companyId, paperSetId) {
  const url = backendUrl(v2Endpoints.paperSets.delete(companyId, paperSetId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function addPaperToSet(companyId, paperSetId, paperId) {
  const url = backendUrl(v2Endpoints.paperSets.addPaper(companyId, paperSetId));
  const res = await axios.post(url, { paperId }, { headers: headers(companyId) });
  return res.data;
}

export async function removePaperFromSet(companyId, paperSetId, paperId) {
  const url = backendUrl(v2Endpoints.paperSets.removePaper(companyId, paperSetId, paperId));
  const res = await axios.delete(url, { headers: headers(companyId) });
  return res.data;
}

export async function uploadPdf(companyId, paperSetId, file, paperIndex, pdfType) {
  const url = backendUrl(v2Endpoints.paperSets.uploadPdf(companyId, paperSetId));
  const formData = new FormData();
  formData.append('file', file);
  formData.append('paperIndex', String(paperIndex));
  formData.append('pdfType', pdfType);
  const res = await axios.post(url, formData, {
    headers: { ...headers(companyId), 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deletePdf(companyId, paperSetId, pdfIndex, paperIndex) {
  const url = backendUrl(v2Endpoints.paperSets.deletePdf(companyId, paperSetId, pdfIndex));
  const res = await axios.delete(url, { data: { paperIndex }, headers: headers(companyId) });
  return res.data;
}

export async function publishPaperSet(companyId, paperSetId) {
  const url = backendUrl(v2Endpoints.paperSets.publish(companyId, paperSetId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function archivePaperSet(companyId, paperSetId) {
  const url = backendUrl(v2Endpoints.paperSets.archive(companyId, paperSetId));
  const res = await axios.post(url, {}, { headers: headers(companyId) });
  return res.data;
}

export async function downloadZip(companyId, paperSetId) {
  const url = backendUrl(v2Endpoints.paperSets.downloadZip(companyId, paperSetId));
  const res = await axios.get(url, {
    headers: headers(companyId),
    responseType: 'blob',
  });
  return res.data;
}
