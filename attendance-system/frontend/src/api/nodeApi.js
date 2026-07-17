const NODE_API_BASE_URL = process.env.REACT_APP_NODE_API_URL || 'http://localhost:3000';

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const json = await response.json();
      message = json.message || message;
      if (json.upstream_message) message = `${message}: ${json.upstream_message}`;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}

export async function markAttendance(formData) {
  return request(`${NODE_API_BASE_URL}/mark-attendance`, { method: 'POST', body: formData });
}

export async function registerStudent(formData) {
  return request(`${NODE_API_BASE_URL}/registration`, { method: 'POST', body: formData });
}

export async function confirmAttendance(payload) {
  return request(`${NODE_API_BASE_URL}/confirm-attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getStudents() {
  return request(`${NODE_API_BASE_URL}/students`);
}
