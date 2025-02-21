
import { volumes2024 } from './years/2024';
import { cardiologyVolumes } from './specialties/cardiology';
import type { RhcaVolume } from '../types';

export const mockVolumes: RhcaVolume[] = [
  ...volumes2024,
  ...cardiologyVolumes
];
