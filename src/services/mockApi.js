// ==========================================================
// MOCK DATA STORE — Synchronous business logic layer
// Used by MSW handlers to simulate a real backend
// ==========================================================

const mock_data = {
  users: [
    { id: 1, name: 'Alice Chen', city: 'Singapore', country: 'Singapore', points: 0, badges: [], stellar_wallet: 'GABC123...', onboarded: false },
    { id: 2, name: 'Carlos Mendez', city: 'Mexico City', country: 'Mexico', points: 250, badges: ['Wallet Connected', 'Community Joined', 'First Meeting', 'Trained Ambassador'], stellar_wallet: 'GBCD456...', onboarded: true },
    { id: 3, name: 'Fatima Diallo', city: 'Dakar', country: 'Senegal', points: 80, badges: ['Wallet Connected'], stellar_wallet: 'GDEF789...', onboarded: false },
    { id: 4, name: 'John Smith', city: 'London', country: 'UK', points: 310, badges: ['Wallet Connected', 'Community Joined', 'First Meeting', 'Trained Ambassador', 'Content Creator'], stellar_wallet: 'GHIJ012...', onboarded: true }
  ],
  meetings: [
    { id: 1, title: 'Global Sync - Americas', date: '2026-03-17T18:00:00.000Z', timezone: 'America/New_York', password: null, isOpen: false, validityWindowMinutes: 15 },
    { id: 2, title: 'Global Sync - EMEA', date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), timezone: 'Europe/London', password: 'STELLAR2026', isOpen: true, validityWindowMinutes: 60 }
  ],
  attendances: [
    { user_id: 2, meeting_id: 1, registered_at: '2026-03-17T18:05:00.000Z' },
    { user_id: 4, meeting_id: 1, registered_at: '2026-03-17T18:10:00.000Z' }
  ],
  rewards: [
    { id: 1, title: 'Monthly Top Performer', amount_xlm: 100, user_id: 4, transaction_hash: 'sim_tx_abc123', created_at: '2026-03-01T12:00:00.000Z' },
    { id: 2, title: 'Onboarding Bonus', amount_xlm: 50, user_id: 2, transaction_hash: 'sim_tx_def456', created_at: '2026-03-05T14:30:00.000Z' }
  ]
};

const ALL_ONBOARDING_STEPS = [
  { name: 'Connect Stellar Wallet', description: 'Ambassador must provide their Stellar public address', badge_awarded: 'Wallet Connected', points: 10 },
  { name: 'Join Discord/Telegram', description: 'Ambassador joins the official Stellar community channels', badge_awarded: 'Community Joined', points: 10 },
  { name: 'Attend First Meeting', description: 'Register attendance in one of the weekly meetings', badge_awarded: 'First Meeting', points: 20 },
  { name: 'Complete Ambassador Training', description: 'Watch training video and pass a simple quiz (simulated)', badge_awarded: 'Trained Ambassador', points: 30 }
];

// Deep clones to avoid reference mutation
let users = JSON.parse(JSON.stringify(mock_data.users));
let meetings = JSON.parse(JSON.stringify(mock_data.meetings));
let attendances = JSON.parse(JSON.stringify(mock_data.attendances));
let rewards = JSON.parse(JSON.stringify(mock_data.rewards));

// --- ONBOARDING ---

export const getOnboardingSteps = (userId) => {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  return ALL_ONBOARDING_STEPS.map(step => ({
    ...step,
    completed: user.badges.includes(step.badge_awarded)
  }));
};

export const completeStep = (userId, stepName) => {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  const stepDef = ALL_ONBOARDING_STEPS.find(s => s.name === stepName);
  if (!stepDef) throw new Error('Invalid onboarding step');
  if (user.badges.includes(stepDef.badge_awarded)) throw new Error('Step already completed');

  user.badges.push(stepDef.badge_awarded);
  user.points += stepDef.points;

  const allCompleted = ALL_ONBOARDING_STEPS.every(s => user.badges.includes(s.badge_awarded));
  if (allCompleted) user.onboarded = true;

  return { ...user };
};

export const awardGenesisBadge = (userId) => {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  if (!user.badges.includes('Genesis Ambassador')) {
    user.badges.push('Genesis Ambassador');
  }
  return { ...user };
};

// --- MEETINGS ---

export const getCurrentMeetings = () => {
  return [...meetings].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getAllMeetings = () => {
  return meetings.map(m => ({ ...m }));
};

export const setMeetingPassword = (meetingId, password) => {
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) throw new Error('Meeting not found');

  meeting.password = password?.trim().toUpperCase() || null;
  return { ...meeting };
};

export const toggleMeetingWindow = (meetingId) => {
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) throw new Error('Meeting not found');
  if (!meeting.password && !meeting.isOpen) throw new Error('Password must be set before opening the window');

  meeting.isOpen = !meeting.isOpen;
  return { ...meeting };
};

export const registerAttendance = (userId, meetingId, password) => {
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) throw new Error('Meeting not found');
  if (!meeting.isOpen) throw new Error('Attendance window is currently closed');
  if (meeting.password !== password?.trim().toUpperCase()) throw new Error('Incorrect password');

  const alreadyAttended = attendances.some(a => a.user_id === userId && a.meeting_id === meetingId);
  if (alreadyAttended) throw new Error('You have already registered attendance for this meeting');

  attendances.push({ user_id: userId, meeting_id: meetingId, registered_at: new Date().toISOString() });

  const user = users.find(u => u.id === userId);
  if (user) user.points += 10;

  return { success: true, message: 'Attendance registered! +10 points 🎉' };
};

export const hasUserAttended = (userId, meetingId) => {
  return attendances.some(a => a.user_id === userId && a.meeting_id === meetingId);
};

export const getMeetingAttendees = (meetingId) => {
  return attendances
    .filter(a => a.meeting_id === meetingId)
    .map(a => {
      const user = users.find(u => u.id === a.user_id);
      return { ...a, userName: user?.name ?? 'Unknown' };
    });
};

// --- USERS ---

export const getUserProfile = (userId) => {
  const user = users.find(u => u.id === userId);
  return user ? { ...user } : null;
};

export const getAllUsers = () => {
  return users.map(u => ({ ...u }));
};

const ALLOWED_FIELDS_BY_ROLE = {
  ambassador: ['city', 'country'],
  admin: ['name', 'email', 'city', 'country', 'stellar_wallet', 'points', 'badges', 'onboarded'],
};

export const updateUser = (userId, updates, requesterRole = 'admin', requesterId = null) => {
  // Ambassadors can only edit their own profile
  if (requesterRole !== 'admin' && requesterId !== userId) {
    throw new Error('You can only edit your own profile.');
  }

  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found');

  const allowedFields = ALLOWED_FIELDS_BY_ROLE[requesterRole] || [];
  const filteredUpdates = {};
  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  }

  // Ensure badge uniqueness when admin edits badges
  if (filteredUpdates.badges && requesterRole === 'admin') {
    filteredUpdates.badges = [...new Set(filteredUpdates.badges)];
  }

  users[index] = { ...users[index], ...filteredUpdates };
  return { ...users[index] };
};

// --- REWARDS ---

export const getRewards = () => {
  return rewards.map(r => ({ ...r }));
};

export const distributeReward = ({ title, amount_xlm, user_id }) => {
  const txHash = `sim_tx_${Math.random().toString(36).substring(2, 10)}${Date.now()}`;
  const newReward = {
    id: Date.now(),
    title,
    amount_xlm,
    user_id,
    transaction_hash: txHash,
    created_at: new Date().toISOString()
  };

  rewards.push(newReward);
  return newReward;
};
