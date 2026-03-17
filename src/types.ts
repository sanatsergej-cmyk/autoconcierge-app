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

// Telegram WebApp types
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
