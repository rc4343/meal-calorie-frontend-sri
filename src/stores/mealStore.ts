import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MealEntry } from '@/types';

export interface MealState {
  meals: MealEntry[];
  totalCalories: number;
  addMeal: (entry: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  removeMeal: (id: string) => void;
  clearMeals: () => void;
}

function sumCalories(meals: MealEntry[]) {
  return meals.reduce((sum, m) => sum + m.totalCalories, 0);
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      meals: [],
      totalCalories: 0,

      addMeal: (entry) =>
        set((state) => {
          const meals = [...state.meals, { ...entry, id: crypto.randomUUID(), timestamp: new Date() }];
          return { meals, totalCalories: sumCalories(meals) };
        }),

      removeMeal: (id) =>
        set((state) => {
          const meals = state.meals.filter((m) => m.id !== id);
          return { meals, totalCalories: sumCalories(meals) };
        }),

      clearMeals: () => set({ meals: [], totalCalories: 0 }),
    }),
    { name: 'meal-storage' },
  ),
);
