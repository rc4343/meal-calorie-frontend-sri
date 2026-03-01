import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MealEntry } from '@/types';

export interface MealState {
  meals: MealEntry[];
  totalCalories: number;
  addMeal: (entry: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  clearMeals: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      meals: [],
      totalCalories: 0,
      addMeal: (entry) =>
        set((state) => {
          const newMeal: MealEntry = {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: new Date(),
          };
          const updatedMeals = [...state.meals, newMeal];
          return {
            meals: updatedMeals,
            totalCalories: updatedMeals.reduce((sum, m) => sum + m.totalCalories, 0),
          };
        }),
      clearMeals: () => set({ meals: [], totalCalories: 0 }),
    }),
    {
      name: 'meal-storage',
    }
  )
);
