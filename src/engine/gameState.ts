const STORAGE_KEY = "autoconcierge_game";

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  coins?: number;
  xp?: number;
  timestamp: number;
}

export interface DailyTask {
  id: string;
  icon: string;
  title: string;
  reward: { coins: number; xp: number };
  completed: boolean;
  action: string; // which action completes it
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
  hidden: boolean;
}

export interface GameState {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastLoginDate: string; // YYYY-MM-DD
  totalLogins: number;
  totalReports: number; // отметок статуса заправок на карте
  totalReferrals: number;
  events: GameEvent[];
  dailyTasks: DailyTask[];
  achievements: Achievement[];
  createdAt: number;
  lastTickAt: number;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_report", icon: "⛽", title: "Первый сигнал", description: "Отметили статус первой заправки", unlocked: false, hidden: false },
  { id: "reports_10", icon: "📡", title: "Народный контролёр", description: "10 отметок на карте", unlocked: false, hidden: false },
  { id: "streak_3", icon: "🔥", title: "Три дня подряд", description: "Стрик 3 дня", unlocked: false, hidden: false },
  { id: "streak_7", icon: "🔥", title: "Неделя на связи", description: "Стрик 7 дней", unlocked: false, hidden: false },
  { id: "streak_30", icon: "💎", title: "Железный человек", description: "Стрик 30 дней", unlocked: false, hidden: false },
  { id: "coins_1000", icon: "🪙", title: "Копилка", description: "Накопить 1000 монет", unlocked: false, hidden: false },
  { id: "coins_5000", icon: "💰", title: "Богач", description: "Накопить 5000 монет", unlocked: false, hidden: false },
  { id: "level_3", icon: "🛣️", title: "Бывалый", description: "Достичь 3 уровня", unlocked: false, hidden: false },
  { id: "level_5", icon: "⭐", title: "Эксперт по бензину", description: "Достичь 5 уровня", unlocked: false, hidden: false },
  { id: "first_referral", icon: "👥", title: "Не один в поле", description: "Пригласили первого друга", unlocked: false, hidden: false },
  { id: "referrals_5", icon: "📣", title: "Голос района", description: "Пригласили 5 друзей", unlocked: false, hidden: false },
  { id: "night_owl", icon: "🦉", title: "Ночной дозор", description: "Зайти между 00:00 и 05:00", unlocked: false, hidden: true },
  { id: "full_daily", icon: "📋", title: "Ежедневник", description: "Выполнить все задания дня", unlocked: false, hidden: false },
];

function generateDailyTasks(): DailyTask[] {
  const allTasks: DailyTask[] = [
    { id: "login_daily", icon: "👋", title: "Зайди в приложение", reward: { coins: 50, xp: 10 }, completed: false, action: "login" },
    { id: "report_daily", icon: "⛽", title: "Отметь статус заправки", reward: { coins: 80, xp: 15 }, completed: false, action: "report" },
    { id: "subscribe_daily", icon: "📢", title: "Подпишись на канал Тавриды", reward: { coins: 60, xp: 10 }, completed: false, action: "subscribe" },
    { id: "invite_friend", icon: "👥", title: "Пригласи друга", reward: { coins: 200, xp: 50 }, completed: false, action: "referral" },
  ];
  return allTasks;
}

export function createInitialState(): GameState {
  return {
    xp: 0,
    level: 1,
    coins: 100,
    streak: 0,
    lastLoginDate: "",
    totalLogins: 0,
    totalReports: 0,
    totalReferrals: 0,
    events: [],
    dailyTasks: generateDailyTasks(),
    achievements: ALL_ACHIEVEMENTS.map((a) => ({ ...a })),
    createdAt: Date.now(),
    lastTickAt: Date.now(),
  };
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

const LEVEL_XP = [0, 0, 50, 200, 500, 1500, 5000, 15000];

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) return i;
  }
  return 1;
}

export function processLogin(state: GameState): GameState {
  const today = getToday();
  const s = { ...state };

  if (s.lastLoginDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (s.lastLoginDate === yesterdayStr) {
      s.streak += 1;
    } else {
      s.streak = 1;
    }

    s.lastLoginDate = today;
    s.totalLogins += 1;

    if (s.streak > 1) {
      s.coins += s.streak * 10;
      s.xp += s.streak * 5;
    }

    s.dailyTasks = generateDailyTasks().map((t) =>
      t.action === "login" ? { ...t, completed: true } : t,
    );

    s.level = calculateLevel(s.xp);
  }

  return s;
}

// Лёгкие флейвор-события — просто бонус coins/xp, без привязки к машине
const RANDOM_EVENTS: Omit<GameEvent, "id" | "timestamp">[] = [
  { icon: "🚚", title: "Бензовоз в пути!", description: "Кто-то из чата написал — везут топливо в сторону Симферополя", coins: 20, xp: 10 },
  { icon: "☀️", title: "Хороший день", description: "Сегодня меньше очередей, чем обычно", coins: 30, xp: 10 },
  { icon: "🎁", title: "Бонус от КрымСервис!", description: "Спасибо, что помогаете держать карту актуальной", coins: 100, xp: 25 },
  { icon: "💧", title: "Привет от Тавриды", description: "Не забудьте пить воду в очереди", coins: 20, xp: 5 },
];

export function maybeGenerateEvent(state: GameState): GameState {
  if (Math.random() > 0.3) return state;

  const template = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  const event: GameEvent = {
    ...template,
    id: `evt_${Date.now()}`,
    timestamp: Date.now(),
  };

  const s = { ...state };
  s.coins += event.coins ?? 0;
  s.xp += event.xp ?? 0;
  s.level = calculateLevel(s.xp);
  s.events = [event, ...state.events].slice(0, 10);

  return s;
}

export function checkAchievements(state: GameState): GameState {
  const s = { ...state, achievements: state.achievements.map((a) => ({ ...a })) };
  const now = Date.now();

  const unlock = (id: string) => {
    const a = s.achievements.find((x) => x.id === id);
    if (a && !a.unlocked) {
      a.unlocked = true;
      a.unlockedAt = now;
      s.coins += 50;
      s.xp += 25;
    }
  };

  if (s.totalReports >= 1) unlock("first_report");
  if (s.totalReports >= 10) unlock("reports_10");
  if (s.totalReferrals >= 1) unlock("first_referral");
  if (s.totalReferrals >= 5) unlock("referrals_5");
  if (s.streak >= 3) unlock("streak_3");
  if (s.streak >= 7) unlock("streak_7");
  if (s.streak >= 30) unlock("streak_30");
  if (s.coins >= 1000) unlock("coins_1000");
  if (s.coins >= 5000) unlock("coins_5000");
  if (s.level >= 3) unlock("level_3");
  if (s.level >= 5) unlock("level_5");

  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) unlock("night_owl");

  const allDailyDone = s.dailyTasks.every((t) => t.completed);
  if (allDailyDone) unlock("full_daily");

  s.level = calculateLevel(s.xp);
  return s;
}
