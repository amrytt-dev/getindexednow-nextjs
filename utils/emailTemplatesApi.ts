const API_BASE = import.meta.env.VITE_API_URL + '/api/admin/email-templates';

function getToken() {
  return localStorage.getItem('token');
}

export async function getAllEmailTemplates() {
  const res = await fetch(API_BASE, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.error || 'Failed to fetch templates');
  return data.result;
}

export async function getEmailTemplateById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.error || 'Failed to fetch template');
  return data.result;
}

export async function createEmailTemplate({ subject, rawHtml, isActive, emailType }) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, rawHtml, isActive, ...(emailType ? { emailType } : {}) }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.error || 'Failed to create template');
  return data.result;
}

export async function updateEmailTemplate(id, { subject, rawHtml, isActive, emailType }) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, rawHtml, isActive, ...(emailType ? { emailType } : {}) }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.error || 'Failed to update template');
  return data.result;
}

export async function deleteEmailTemplate(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.error || 'Failed to delete template');
  return data.result;
} 