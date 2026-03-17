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
