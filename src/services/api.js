const API_URL = import.meta.env.VITE_API_URL || '';

let csrfToken = null;

export function isApiEnabled() {
  return Boolean(API_URL);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Erro inesperado na API.');
  }
  return data;
}

export async function ensureCsrfToken() {
  if (!isApiEnabled()) return null;
  if (csrfToken) return csrfToken;
  const data = await request('/auth/csrf', { method: 'GET' });
  csrfToken = data.csrfToken;
  return csrfToken;
}

export const api = {
  enabled: isApiEnabled,
  async me() {
    if (!isApiEnabled()) return null;
    await ensureCsrfToken();
    return request('/auth/me');
  },
  async register(payload) {
    await ensureCsrfToken();
    return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  async login(payload) {
    await ensureCsrfToken();
    return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  async logout() {
    await ensureCsrfToken();
    const result = await request('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    csrfToken = null;
    return result;
  },
  async families() {
    await ensureCsrfToken();
    return request('/families');
  },
  async createFamily(payload) {
    await ensureCsrfToken();
    return request('/families', { method: 'POST', body: JSON.stringify(payload) });
  },
  async inviteMember(payload) {
    await ensureCsrfToken();
    return request('/families/invite', { method: 'POST', body: JSON.stringify(payload) });
  },
  async acceptInvitation(payload) {
    await ensureCsrfToken();
    return request('/invitations/accept', { method: 'POST', body: JSON.stringify(payload) });
  },
  async syncGet(familyId) {
    await ensureCsrfToken();
    return request(`/sync?familyId=${encodeURIComponent(familyId)}`);
  },
  async syncPut(familyId, payload) {
    await ensureCsrfToken();
    return request('/sync', { method: 'PUT', body: JSON.stringify({ familyId, payload }) });
  }
};
