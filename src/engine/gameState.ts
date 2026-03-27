import type { CarState } from "../types";

const STORAGE_KEY = "autoconcierge_game";

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  effect: Partial<CarState>;
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
  car: CarState;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastLoginDate: string; // YYYY-MM-DD
  totalLogins: number;
  totalWashes: number;
  totalFuels: number;
  totalServices: number;
  totalTires: number;
  events: GameEvent[];
  dailyTasks: DailyTask[];
  achievements: Achievement[];
  createdAt: number;
  lastTickAt: number;
}

export const DEFAULT_CAR: CarState = {
  brand: "Toyota",
  model: "Camry",
  year: 2019,
  color: "#1a1a2e",
  cleanliness: 80,
  fuel: 70,
  health: 90,
  mood: "normal",
  lastWash: Date.now(),
  mileage: 85000,
  needsOilChange: false,
  needsTires: false,
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_wash", icon: "🧼", title: "Чистюля", description: "Первая мойка", unlocked: false, hidden: false },
  { id: "wash_10", icon: "🚿", title: "Мойдодыр", description: "10 моек", unlocked: false, hidden: false },
  { id: "streak_3", icon: "🔥", title: "Три дня подряд", description: "Стрик 3 дня", unlocked: false, hidden: false },
  { id: "streak_7", icon: "🔥", title: "Неделя с машиной", description: "Стрик 7 дней", unlocked: false, hidden: false },
  { id: "streak_30", icon: "💎", title: "Железный человек", description: "Стрик 30 дней", unlocked: false, hidden: false },
  { id: "coins_1000", icon: "🪙", title: "Копилка", description: "Накопить 1000 монет", unlocked: false, hidden: false },
  { id: "coins_5000", icon: "💰", title: "Богач", description: "Накопить 5000 монет", unlocked: false, hidden: false },
  { id: "level_3", icon: "🛣️", title: "Бывалый", description: "Достичь 3 уровня", unlocked: false, hidden: false },
  { id: "level_5", icon: "⭐", title: "Автоэксперт", description: "Достичь 5 уровня", unlocked: false, hidden: false },
  { id: "survive_event", icon: "🛡️", title: "Выживший", description: "Пережить 5 событий", unlocked: false, hidden: false },
  { id: "night_owl", icon: "🦉", title: "Ночной дозор", description: "Зайти между 00:00 и 05:00", unlocked: false, hidden: true },
  { id: "perfect_car", icon: "✨", title: "Идеал", description: "Все показатели на 100%", unlocked: false, hidden: true },
  { id: "full_daily", icon: "📋", title: "Ежедневник", description: "Выполнить все задания дня", unlocked: false, hidden: false },
  { id: "first_fuel", icon: "⛽", title: "Полный бак", description: "Первая заправка", unlocked: false, hidden: false },
  { id: "first_service", icon: "🔧", title: "На СТО", description: "Первый сервис", unlocked: false, hidden: false },
];

function generateDailyTasks(): DailyTask[] {
  const allTasks: DailyTask[] = [
    { id: "wash_daily", icon: "🚿", title: "Помой машину", reward: { coins: 100, xp: 20 }, completed: false, action: "wash" },
    { id: "fuel_daily", icon: "⛽", title: "Заправь машину", reward: { coins: 80, xp: 15 }, completed: false, action: "fuel" },
    { id: "service_daily", icon: "🔧", title: "Пройди сервис", reward: { coins: 150, xp: 30 }, completed: false, action: "service" },
    { id: "login_daily", icon: "👋", title: "Зайди в гараж", reward: { coins: 50, xp: 10 }, completed: false, action: "login" },
    { id: "check_status", icon: "📊", title: "Проверь состояние", reward: { coins: 60, xp: 10 }, completed: false, action: "check" },
    { id: "invite_friend", icon: "👥", title: "Пригласи друга", reward: { coins: 200, xp: 50 }, completed: false, action: "referral" },
  ];

  // Pick 3 random tasks + always login + always referral
  const loginTask = allTasks.find((t) => t.id === "login_daily")!;
  const referralTask = allTasks.find((t) => t.id === "invite_friend")!;
  const others = allTasks
    .filter((t) => t.id !== "login_daily" && t.id !== "invite_friend")
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  return [{ ...loginTask }, ...others.map((t) => ({ ...t })), { ...referralTask }];
}

export function createInitialState(): GameState {
  return {
    car: { ...DEFAULT_CAR },
    xp: 0,
    level: 1,
    coins: 100,
    streak: 0,
    lastLoginDate: "",
    totalLogins: 0,
    totalWashes: 0,
    totalFuels: 0,
    totalServices: 0,
    totalTires: 0,
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
    // Check streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (s.lastLoginDate === yesterdayStr) {
      s.streak += 1;
    } else if (s.lastLoginDate !== today) {
      s.streak = 1;
    }

    s.lastLoginDate = today;
    s.totalLogins += 1;

    // Streak bonus
    if (s.streak > 1) {
      s.coins += s.streak * 10;
      s.xp += s.streak * 5;
    }

    // New daily tasks
    s.dailyTasks = generateDailyTasks();

    // Mark login task as done
    s.dailyTasks = s.dailyTasks.map((t) =>
      t.action === "login" ? { ...t, completed: true } : t,
    );

    s.level = calculateLevel(s.xp);
  }

  return s;
}

// Degradation: call this on each "tick" (every time user opens the app)
export function processDegradation(state: GameState): GameState {
  const now = Date.now();
  const elapsed = now - state.lastTickAt;
  const hours = elapsed / (1000 * 60 * 60);

  if (hours < 0.5) return state; // Don't degrade within 30 min

  const s = { ...state, car: { ...state.car }, lastTickAt: now };

  // Cleanliness drops ~5% per day
  s.car.cleanliness = Math.max(0, s.car.cleanliness - hours * 0.2);

  // Fuel drops ~10% per day (driving simulation)
  s.car.fuel = Math.max(0, s.car.fuel - hours * 0.4);

  // Health drops ~2% per day
  s.car.health = Math.max(0, s.car.health - hours * 0.08);

  // Mileage increases ~50km per day
  s.car.mileage += Math.round(hours * 2);

  // Oil change needed every ~10k km
  if (s.car.mileage % 10000 < 100 && !s.car.needsOilChange) {
    s.car.needsOilChange = true;
  }

  // Update mood
  if (s.car.cleanliness < 20 || s.car.fuel < 10 || s.car.health < 30) {
    s.car.mood = "angry";
  } else if (s.car.cleanliness < 40 || s.car.fuel < 25 || s.car.health < 50) {
    s.car.mood = "sad";
  } else {
    s.car.mood = "normal";
  }

  return s;
}

// Random events
const RANDOM_EVENTS: Omit<GameEvent, "id" | "timestamp">[] = [
  {
    icon: "🌧️",
    title: "Дождь!",
    description: "Прошёл дождь — машина немного запачкалась",
    effect: { cleanliness: -15 },
    coins: 0,
    xp: 5,
  },
  {
    icon: "🐦",
    title: "Птичий привет",
    description: "Птица оставила подарок на капоте...",
    effect: { cleanliness: -10 },
    coins: 0,
    xp: 5,
  },
  {
    icon: "🌞",
    title: "Солнечный день",
    description: "Отличная погода! Машина сияет",
    effect: { cleanliness: 5 },
    coins: 30,
    xp: 10,
  },
  {
    icon: "🏗️",
    title: "Стройка рядом",
    description: "Пыль с соседней стройки осела на машине",
    effect: { cleanliness: -20 },
    coins: 0,
    xp: 5,
  },
  {
    icon: "🎰",
    title: "Удачный день!",
    description: "Нашли скидку на бензин!",
    effect: { fuel: 15 },
    coins: 50,
    xp: 15,
  },
  {
    icon: "⚠️",
    title: "Ямка на дороге",
    description: "Попали в яму — проверьте подвеску",
    effect: { health: -10 },
    coins: 0,
    xp: 10,
  },
  {
    icon: "🔋",
    title: "Проблема с АКБ",
    description: "Аккумулятор разрядился на морозе",
    effect: { health: -8 },
    coins: 0,
    xp: 5,
  },
  {
    icon: "🎁",
    title: "Бонус от АвтоКонсьерж!",
    description: "Спасибо за заботу о машине!",
    effect: {},
    coins: 100,
    xp: 25,
  },
  {
    icon: "🧊",
    title: "Заморозки",
    description: "Ночью подморозило — иней на стёклах",
    effect: { cleanliness: -5 },
    coins: 0,
    xp: 5,
  },
  {
    icon: "🛞",
    title: "Шина спускает",
    description: "Медленный прокол — давление падает",
    effect: { health: -5 },
    coins: 0,
    xp: 10,
  },
];

export function maybeGenerateEvent(state: GameState): GameState {
  // 30% chance on each open
  if (Math.random() > 0.3) return state;

  const template = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  const event: GameEvent = {
    ...template,
    id: `evt_${Date.now()}`,
    timestamp: Date.now(),
  };

  const s = { ...state, car: { ...state.car } };

  // Apply effects
  if (event.effect.cleanliness) {
    s.car.cleanliness = Math.max(0, Math.min(100, s.car.cleanliness + event.effect.cleanliness));
  }
  if (event.effect.fuel) {
    s.car.fuel = Math.max(0, Math.min(100, s.car.fuel + event.effect.fuel));
  }
  if (event.effect.health) {
    s.car.health = Math.max(0, Math.min(100, s.car.health + event.effect.health));
  }

  s.coins += event.coins ?? 0;
  s.xp += event.xp ?? 0;
  s.level = calculateLevel(s.xp);

  // Keep last 10 events
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

  if (s.totalWashes >= 1) unlock("first_wash");
  if (s.totalWashes >= 10) unlock("wash_10");
  if (s.totalFuels >= 1) unlock("first_fuel");
  if (s.totalServices >= 1) unlock("first_service");
  if (s.streak >= 3) unlock("streak_3");
  if (s.streak >= 7) unlock("streak_7");
  if (s.streak >= 30) unlock("streak_30");
  if (s.coins >= 1000) unlock("coins_1000");
  if (s.coins >= 5000) unlock("coins_5000");
  if (s.level >= 3) unlock("level_3");
  if (s.level >= 5) unlock("level_5");

  const eventCount = s.events.length;
  if (eventCount >= 5) unlock("survive_event");

  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) unlock("night_owl");

  if (s.car.cleanliness >= 100 && s.car.fuel >= 100 && s.car.health >= 100) unlock("perfect_car");

  const allDailyDone = s.dailyTasks.every((t) => t.completed);
  if (allDailyDone) unlock("full_daily");

  s.level = calculateLevel(s.xp);
  return s;
}
