import { useState } from "react";
import { Garage } from "./components/Garage";
import { CarStatus } from "./components/CarStatus";
import { ActionButtons } from "./components/ActionButtons";
import { ProfileBar } from "./components/ProfileBar";
import type { CarState } from "./types";

const INITIAL_CAR: CarState = {
  brand: "Toyota",
  model: "Camry",
  year: 2019,
  color: "#1a1a2e",
  cleanliness: 65,
  fuel: 40,
  health: 82,
  mood: "normal",
  lastWash: Date.now() - 7 * 24 * 60 * 60 * 1000,
  mileage: 85000,
  needsOilChange: false,
  needsTires: false,
};

export default function App() {
  const [car, setCar] = useState<CarState>(INITIAL_CAR);
  const [xp, setXp] = useState(312);
  const [level] = useState(3);
  const [coins, setCoins] = useState(1450);
  const [showSplash, setShowSplash] = useState(false);

  const handleWash = () => {
    setCar((c) => ({ ...c, cleanliness: 100, mood: "happy", lastWash: Date.now() }));
    setXp((x) => x + 15);
    setCoins((c) => c + 50);
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 1500);
  };

  const handleFuel = () => {
    setCar((c) => ({ ...c, fuel: 100, mood: "happy" }));
    setXp((x) => x + 10);
    setCoins((c) => c + 30);
  };

  const handleService = () => {
    setCar((c) => ({ ...c, health: 100, needsOilChange: false, mood: "happy" }));
    setXp((x) => x + 30);
    setCoins((c) => c + 100);
  };

  const handleTires = () => {
    setCar((c) => ({ ...c, needsTires: false, mood: "happy" }));
    setXp((x) => x + 20);
    setCoins((c) => c + 75);
  };

  return (
    <div className="min-h-screen flex flex-col pb-4">
      <ProfileBar xp={xp} level={level} coins={coins} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {showSplash && (
          <div className="absolute inset-0 z-20 flex items-center justify-center animate-fade-out">
            <div className="text-6xl animate-bounce">💦</div>
          </div>
        )}
        <Garage car={car} />
        <CarStatus car={car} />
      </div>

      <ActionButtons car={car} onWash={handleWash} onFuel={handleFuel} onService={handleService} onTires={handleTires} />
    </div>
  );
}
