// Mock data store — initialized once and mutated in-memory across the session
const mock_data = {
  users: [
    { id: 1, name: 'Ana Silva',      city: 'São Paulo',        points: 120, badges: ['Meetup Organizer', 'Content Creator'] },
    { id: 2, name: 'Carlos Santos',  city: 'Rio de Janeiro',   points: 85,  badges: ['Code Contributor'] },
    { id: 3, name: 'Mariana Costa',  city: 'Belo Horizonte',   points: 150, badges: ['Top Ambassador', 'Content Creator'] },
  ],
  meetings: [
    { id: 1, title: 'Weekly Meeting #9',  date: '2026-03-03', password: null, isOpen: false },
    { id: 2, title: 'Weekly Meeting #10', date: '2026-03-10', password: null, isOpen: false },
  ],
  attendances: [
    { user_id: 1, meeting_id: 1, registered_at: '2026-03-03T19:10:00' },
    { user_id: 3, meeting_id: 1, registered_at: '2026-03-03T19:12:00' },
  ],
  rewards: [
    { id: 201, title: 'Monthly Bonus - Top 3', amount_xlm: 50, user_id: 3, transaction_hash: 'simulated_tx_abc123' },
  ],
};

// In-memory working copies (shallow clone avoids mutating the original)
let users      = mock_data.users.map(u => ({ ...u }));
let meetings   = mock_data.meetings.map(m => ({ ...m }));
let attendances = [...mock_data.attendances];
let rewards    = [...mock_data.rewards];

// Simulated network latency
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Meetings ────────────────────────────────────────────────

/**
 * Returns the most recent meeting by date.
 */
export const getCurrentMeeting = async () => {
  await delay();
  const sorted = [...meetings].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted[0] ? { ...sorted[0] } : null;
};

export const getAllMeetings = async () => {
  await delay();
  return meetings.map(m => ({ ...m }));
};

/**
 * Sets the password for a given meeting.
 * Password is trimmed and uppercased before saving.
 */
export const setMeetingPassword = async (meetingId, password) => {
  await delay();
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) throw new Error('Meeting not found');
  meeting.password = password.trim().toUpperCase();
  return { ...meeting };
};

/**
 * Toggles the attendance window for a meeting.
 * Requires password to be set before opening.
 */
export const toggleMeetingWindow = async (meetingId) => {
  await delay();
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) throw new Error('Meeting not found');
  if (!meeting.password && !meeting.isOpen) {
    throw new Error('A senha deve ser definida antes de abrir a janela');
  }
  meeting.isOpen = !meeting.isOpen;
  return { ...meeting };
};

/**
 * Returns attendance records for a meeting, enriched with user names.
 */
export const getMeetingAttendees = async (meetingId) => {
  await delay();
  return attendances
    .filter(a => a.meeting_id === meetingId)
    .map(a => {
      const user = users.find(u => u.id === a.user_id);
      return { ...a, userName: user?.name ?? 'Unknown' };
    });
};

// ─── Attendance ──────────────────────────────────────────────

/**
 * Registers attendance for a user on a meeting.
 * Validates: window is open, password matches, no duplicate.
 * Grants +10 points on success.
 */
export const registerAttendance = async (userId, meetingId, password) => {
  await delay();

  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) throw new Error('Reunião não encontrada');
  if (!meeting.isOpen) throw new Error('A janela de presença está fechada');
  if (meeting.password !== password.trim().toUpperCase()) {
    throw new Error('Senha incorreta');
  }

  const alreadyRegistered = attendances.find(
    a => a.user_id === userId && a.meeting_id === meetingId
  );
  if (alreadyRegistered) throw new Error('Presença já registrada');

  attendances.push({
    user_id: userId,
    meeting_id: meetingId,
    registered_at: new Date().toISOString(),
  });

  // Award participation points
  const user = users.find(u => u.id === userId);
  if (user) user.points += 10;

  return { success: true, message: 'Presença registrada! +10 pontos 🎉' };
};

export const hasUserAttended = async (userId, meetingId) => {
  await delay();
  return !!attendances.find(a => a.user_id === userId && a.meeting_id === meetingId);
};

// ─── Users ───────────────────────────────────────────────────

/** Returns all users sorted by points descending. */
export const getRanking = async () => {
  await delay();
  return [...users].sort((a, b) => b.points - a.points);
};

export const getUserProfile = async (userId) => {
  await delay();
  const user = users.find(u => u.id === userId);
  return user ? { ...user } : null;
};

export const getAllUsers = async () => {
  await delay();
  return [...users];
};

// ─── Rewards ─────────────────────────────────────────────────

export const getRewards = async () => {
  await delay();
  return [...rewards];
};

/**
 * Creates a new reward with a simulated transaction hash.
 */
export const distributeReward = async (rewardData) => {
  await delay();
  const newReward = {
    ...rewardData,
    id: Date.now(),
    transaction_hash: `simulated_tx_${Date.now()}`,
  };
  rewards.push(newReward);
  return newReward;
};
