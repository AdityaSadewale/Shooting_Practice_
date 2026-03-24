export const DB_KEY = 'shooting_mastery_db';

export const getDB = () => {
  const db = localStorage.getItem(DB_KEY);
  if (db) return JSON.parse(db);
  return { user: null, sessions: [] };
};

export const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const getUser = () => getDB().user;

export const saveUser = (user) => {
  const db = getDB();
  db.user = user;
  saveDB(db);
};

export const clearUser = () => {
  const db = getDB();
  db.user = null;
  saveDB(db);
};

export const getSessions = () => getDB().sessions;

export const saveSession = (session) => {
  const db = getDB();
  const existingIndex = db.sessions.findIndex((s) => s.id === session.id);
  if (existingIndex >= 0) {
    db.sessions[existingIndex] = session;
  } else {
    db.sessions.push(session);
  }
  saveDB(db);
};

export const getStreak = () => {
  const sessions = getSessions();
  if (!sessions.length) return 0;
  
  // Sort sessions by date descending
  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDate = new Date(sorted[0].date);
  currentDate.setHours(0, 0, 0, 0);
  
  // If the last session is older than yesterday, streak is broken
  const diffDays = Math.floor((today - currentDate) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  // Count backwards
  let dateToCheck = new Date(currentDate);

  for (let i = 0; i < sorted.length; i++) {
    const sDate = new Date(sorted[i].date);
    sDate.setHours(0, 0, 0, 0);
    
    if (sDate.getTime() === dateToCheck.getTime()) {
      streak++;
      dateToCheck.setDate(dateToCheck.getDate() - 1); // check previous day next
    } else if (sDate.getTime() > dateToCheck.getTime()) {
      // multiple sessions on the same day, ignore
      continue;
    } else {
      // missed a day
      break;
    }
    
    if (streak >= 365) return 365; // Cap at 365
  }
  
  return streak;
};
