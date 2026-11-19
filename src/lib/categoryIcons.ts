import {
  BookOpen,
  Car,
  Circle,
  Gamepad2,
  Gift,
  HeartPulse,
  House,
  PiggyBank,
  Receipt,
  Users,
  Utensils,
  Wallet,
  Wine,
  type LucideIcon,
} from 'lucide-react';

// Importamos solo los íconos que usamos: así el bundle no carga
// los más de mil que trae Lucide.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  car: Car,
  'gamepad-2': Gamepad2,
  gift: Gift,
  'heart-pulse': HeartPulse,
  house: House,
  'piggy-bank': PiggyBank,
  receipt: Receipt,
  users: Users,
  utensils: Utensils,
  wallet: Wallet,
  wine: Wine,
};

/** Devuelve el ícono de la categoría, o un círculo si no se reconoce. */
export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICONS[icon] ?? Circle;
}