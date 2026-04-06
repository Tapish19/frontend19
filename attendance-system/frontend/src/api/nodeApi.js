const NODE_API_BASE_URL = process.env.REACT_APP_NODE_API_URL || 'http://localhost:3000';

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function markAttendance(formData) {
  return request(`${NODE_API_BASE_URL}/mark-attendance`, {
    method: 'POST',
    body: formData
  });
}

export async function registerStudent(formData) {
  return request(`${NODE_API_BASE_URL}/Registration`, {
    method: 'POST',
    body: formData
  });
}
