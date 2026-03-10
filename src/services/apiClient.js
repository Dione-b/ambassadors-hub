// ==========================================================
// API CLIENT — Centralized fetch layer
// All components use this instead of importing mockApi directly.
// When a real backend is ready, only this file needs to change.
// ==========================================================

const BASE_URL = '/api';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

// ─── ONBOARDING ────────────────────────────────────────────

export const fetchOnboardingSteps = async (userId) => {
  const res = await fetch(`${BASE_URL}/onboarding/steps/${userId}`);
  return handleResponse(res);
};

export const fetchCompleteStep = async (userId, stepName) => {
  const res = await fetch(`${BASE_URL}/onboarding/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, stepName }),
  });
  return handleResponse(res);
};

export const fetchAwardGenesisBadge = async (userId) => {
  const res = await fetch(`${BASE_URL}/onboarding/genesis-badge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return handleResponse(res);
};

// ─── MEETINGS ──────────────────────────────────────────────

export const fetchCurrentMeetings = async () => {
  const res = await fetch(`${BASE_URL}/meetings/current`);
  return handleResponse(res);
};

export const fetchAllMeetings = async () => {
  const res = await fetch(`${BASE_URL}/meetings`);
  return handleResponse(res);
};

export const fetchSetMeetingPassword = async (meetingId, password) => {
  const res = await fetch(`${BASE_URL}/meetings/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingId, password }),
  });
  return handleResponse(res);
};

export const fetchToggleMeetingWindow = async (meetingId) => {
  const res = await fetch(`${BASE_URL}/meetings/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingId }),
  });
  return handleResponse(res);
};

// ─── ATTENDANCE ────────────────────────────────────────────

export const fetchRegisterAttendance = async (userId, meetingId, password) => {
  const res = await fetch(`${BASE_URL}/attendance/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, meetingId, password }),
  });
  return handleResponse(res);
};

export const fetchHasUserAttended = async (userId, meetingId) => {
  const res = await fetch(`${BASE_URL}/attendance/check?userId=${userId}&meetingId=${meetingId}`);
  const data = await handleResponse(res);
  return data.attended;
};

export const fetchMeetingAttendees = async (meetingId) => {
  const res = await fetch(`${BASE_URL}/meetings/${meetingId}/attendees`);
  return handleResponse(res);
};

// ─── USERS ─────────────────────────────────────────────────

export const fetchUserProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  return handleResponse(res);
};

export const fetchAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return handleResponse(res);
};

export const fetchUpdateUser = async (userId, updates) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
};

// ─── REWARDS ───────────────────────────────────────────────

export const fetchRewards = async () => {
  const res = await fetch(`${BASE_URL}/rewards`);
  return handleResponse(res);
};

export const fetchDistributeReward = async ({ title, amount_xlm, user_id }) => {
  const res = await fetch(`${BASE_URL}/rewards/distribute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount_xlm, user_id }),
  });
  return handleResponse(res);
};
