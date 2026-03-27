/* ===== GAME TYPES ===== */
export interface CarState {
  brand: string;
  model: string;
  year: number;
  color: string;
  cleanliness: number; // 0-100
  fuel: number; // 0-100
  health: number; // 0-100
  mood: "happy" | "normal" | "sad" | "angry";
  lastWash: number; // timestamp
  mileage: number;
  needsOilChange: boolean;
  needsTires: boolean;
}

/* ===== CRM TYPES ===== */
export type CrmScreen = 'schedule' | 'clients' | 'parts';
export type JobStatus = 'waiting' | 'in_progress' | 'diagnostics' | 'ready' | 'paid';

export interface Job {
  id: string;
  bay: string;
  timeStart: string;
  timeEnd: string;
  service: string;
  vehicle: string;
  vehicleYear: number;
  client: string;
  status: JobStatus;
  isDelayed: boolean;
  delayReason?: string;
}

export interface PartItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  category: string;
  location?: string;
  isLowStock: boolean;
}

export interface ClientData {
  id: string;
  name: string;
  phone: string;
  visits: number;
  vehicles: VehicleInfo[];
  isVip: boolean;
}

export interface VehicleInfo {
  make: string;
  year: number;
  vin: string;
  plate: string;
  inShop: boolean;
}

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string }> = {
  waiting: { label: 'ОЖИДАНИЕ', color: 'text-steel' },
  in_progress: { label: 'В РАБОТЕ', color: 'text-primary' },
  diagnostics: { label: 'ДИАГНОСТИКА', color: 'text-primary' },
  ready: { label: 'ГОТОВ', color: 'text-stock-green' },
  paid: { label: 'ОПЛАЧЕН', color: 'text-bleached' },
};

/* ===== TELEGRAM TYPES ===== */
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        themeParams: Record<string, string>;
        colorScheme: "light" | "dark";
        HapticFeedback?: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}
