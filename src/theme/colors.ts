export type ThemeColors = {
  primary: string;
  secondary: string;
  danger: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  border: string;
  inputBg: string;
  cardShadow: string;
};

export const lightColors: ThemeColors = {
  primary: '#4F46E5', // Indigo 600
  secondary: '#10B981', // Emerald 500
  danger: '#EF4444', // Red 500
  background: '#F1F5F9', // Slate 100
  surface: '#FFFFFF', // White
  text: '#1E293B', // Slate 800
  textLight: '#64748B', // Slate 500
  border: '#E2E8F0', // Slate 200
  inputBg: '#F8FAFC', // Slate 50
  cardShadow: '#000',
};

export const darkColors: ThemeColors = {
  primary: '#6366F1', // Indigo 500 (Lighter for dark mode)
  secondary: '#34D399', // Emerald 400
  danger: '#F87171', // Red 400
  background: '#0F172A', // Slate 900
  surface: '#1E293B', // Slate 800
  text: '#F1F5F9', // Slate 100
  textLight: '#94A3B8', // Slate 400
  border: '#334155', // Slate 700
  inputBg: '#334155', // Slate 700
  cardShadow: '#000',
};

// Default export for backward compatibility during refactor (pointing to light)
export const colors = lightColors;
