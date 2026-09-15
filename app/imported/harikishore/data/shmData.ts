export interface SHMPreset {
  id: string;
  name: string;
  amplitude: number; // A (m)
  omega: number;     // ω (rad/s)
  phase: number;     // φ (rad)
  mass: number;      // m (kg)
  springK: number;   // k (N/m) = m * ω²
  description: string;
  isCustom?: boolean;
}

export const SHM_PRESETS: SHMPreset[] = [
  {
    id: 'standard',
    name: 'Standard Oscillator',
    amplitude: 1.5,
    omega: 2.0,
    phase: 0,
    mass: 1.0,
    springK: 4.0,
    description: 'A = 1.5 m, ω = 2.0 rad/s, φ = 0. Starts at maximum positive displacement x(0) = +A with zero velocity.',
  },
  {
    id: 'high_freq',
    name: 'Fast Oscillation (High ω)',
    amplitude: 1.0,
    omega: 4.0,
    phase: 0,
    mass: 1.0,
    springK: 16.0,
    description: 'High stiffness spring creates rapid oscillations with short period T = 2π/4 ≈ 1.57 s.',
  },
  {
    id: 'phase_shifted',
    name: 'Phase Shift (φ = π/2)',
    amplitude: 2.0,
    omega: 1.5,
    phase: Math.PI / 2,
    mass: 1.0,
    springK: 2.25,
    description: 'Phase shifted by 90°. Starts at equilibrium x(0) = 0 with maximum negative velocity v(0) = -Aω.',
  },
  {
    id: 'large_amplitude',
    name: 'Large Amplitude (A = 2.5 m)',
    amplitude: 2.5,
    omega: 1.2,
    phase: 0,
    mass: 2.0,
    springK: 2.88,
    description: 'High mechanical energy system with large physical swing distance of 5.0 m peak-to-peak.',
  },
  {
    id: 'custom',
    name: 'Custom Parameters',
    amplitude: 1.5,
    omega: 2.0,
    phase: 0,
    mass: 1.0,
    springK: 4.0,
    description: 'Enter your own SHM parameters using the custom input fields.',
    isCustom: true,
  },
];
