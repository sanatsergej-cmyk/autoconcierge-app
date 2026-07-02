/* ===== FUEL MAP TYPES ===== */
export type FuelStatus = "green" | "yellow" | "red" | null;

export interface Station {
  id: number;
  network: string;
  name: string;
  city: string;
  address: string | null;
  map_x: number;
  map_y: number;
  phone: string | null;
  fuel_types: string | null;
  is_verified: boolean;
  status: FuelStatus;
  status_confirmed: boolean;
  status_age: string;
  reports_count: number;
}

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
        // Нативный сканер Telegram — предпочтительнее любого самописного
        // камера-компонента: работает одинаково в iOS/Android/Desktop клиентах.
        showScanQrPopup?: (
          params: { text?: string },
          callback?: (text: string) => boolean | void,
        ) => void;
        closeScanQrPopup?: () => void;
        showPopup?: (params: { title?: string; message: string; buttons?: { id?: string; type?: string; text?: string }[] }) => void;
      };
    };
  }
}
