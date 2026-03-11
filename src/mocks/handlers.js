import { http, HttpResponse, delay } from 'msw';
import * as db from '../services/mockApi';

export const handlers = [
  // ─── ONBOARDING ────────────────────────────────────────────
  http.get('/api/onboarding/steps/:userId', async ({ params }) => {
    await delay(150);
    try {
      const steps = db.getOnboardingSteps(Number(params.userId));
      return HttpResponse.json(steps);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  http.post('/api/onboarding/complete', async ({ request }) => {
    await delay(200);
    try {
      const { userId, stepName } = await request.json();
      const result = db.completeStep(userId, stepName);
      return HttpResponse.json(result);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  http.post('/api/onboarding/genesis-badge', async ({ request }) => {
    await delay(150);
    try {
      const { userId } = await request.json();
      const result = db.awardGenesisBadge(userId);
      return HttpResponse.json(result);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  // ─── MEETINGS ──────────────────────────────────────────────
  http.get('/api/meetings/current', async () => {
    await delay(150);
    return HttpResponse.json(db.getCurrentMeetings());
  }),

  http.get('/api/meetings', async () => {
    await delay(150);
    return HttpResponse.json(db.getAllMeetings());
  }),

  http.post('/api/meetings/password', async ({ request }) => {
    await delay(150);
    try {
      const { meetingId, password } = await request.json();
      const updated = db.setMeetingPassword(meetingId, password);
      return HttpResponse.json(updated);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  http.post('/api/meetings/toggle', async ({ request }) => {
    await delay(150);
    try {
      const { meetingId } = await request.json();
      const updated = db.toggleMeetingWindow(meetingId);
      return HttpResponse.json(updated);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  // ─── ATTENDANCE ────────────────────────────────────────────
  http.post('/api/attendance/register', async ({ request }) => {
    await delay(200);
    try {
      const { userId, meetingId, password } = await request.json();
      const result = db.registerAttendance(userId, meetingId, password);
      return HttpResponse.json(result);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  http.get('/api/attendance/check', async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const userId = Number(url.searchParams.get('userId'));
    const meetingId = Number(url.searchParams.get('meetingId'));
    return HttpResponse.json({ attended: db.hasUserAttended(userId, meetingId) });
  }),

  http.get('/api/meetings/:meetingId/attendees', async ({ params }) => {
    await delay(150);
    return HttpResponse.json(db.getMeetingAttendees(Number(params.meetingId)));
  }),

  // ─── USERS ─────────────────────────────────────────────────
  http.get('/api/users', async () => {
    await delay(150);
    return HttpResponse.json(db.getAllUsers());
  }),

  http.get('/api/users/:userId', async ({ params }) => {
    await delay(100);
    const user = db.getUserProfile(Number(params.userId));
    if (!user) return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.patch('/api/users/:userId', async ({ params, request }) => {
    await delay(200);
    try {
      const { requesterRole, requesterId, ...updates } = await request.json();
      const updated = db.updateUser(Number(params.userId), updates, requesterRole, requesterId);
      return HttpResponse.json(updated);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),

  // ─── REWARDS ───────────────────────────────────────────────
  http.get('/api/rewards', async () => {
    await delay(150);
    return HttpResponse.json(db.getRewards());
  }),

  http.post('/api/rewards/distribute', async ({ request }) => {
    await delay(200);
    try {
      const data = await request.json();
      const reward = db.distributeReward(data);
      return HttpResponse.json(reward);
    } catch (err) {
      return HttpResponse.json({ error: err.message }, { status: 400 });
    }
  }),
];
