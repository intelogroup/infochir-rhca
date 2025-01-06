import { volumes2024 } from "./years/2024";
import { volumes2023 } from "./years/2023";
import { volumes2022 } from "./years/2022";
import { volumes2021 } from "./years/2021";
import { cardiologyVolumes } from "./specialties/cardiology";
import { neurosurgeryVolumes } from "./specialties/neurosurgery";
import { pediatricVolumes } from "./specialties/pediatric";
import { orthopedicsVolumes } from "./specialties/orthopedics";
import { plasticVolumes } from "./specialties/plastic";
import type { RhcaVolume } from "../types";

// Sort volumes by date (newest first) before exporting
export const mockVolumes: RhcaVolume[] = [
  ...volumes2024,
  ...volumes2023,
  ...volumes2022,
  ...volumes2021,
  ...cardiologyVolumes,
  ...neurosurgeryVolumes,
  ...pediatricVolumes,
  ...orthopedicsVolumes,
  ...plasticVolumes
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log('Initial mockVolumes:', mockVolumes.map(v => ({
  date: v.date,
  year: new Date(v.date).getFullYear(),
  volume: v.volume
})));