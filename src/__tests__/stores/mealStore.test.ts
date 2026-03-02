import { describe, it, expect, beforeEach } from 'vitest';
import { useMealStore } from '@/stores/mealStore';

describe('mealStore', () => {
  beforeEach(() => {
    useMealStore.setState({ meals: [], totalCalories: 0 });
    localStorage.clear();
  });

  it('starts empty', () => {
    const state = useMealStore.getState();
    expect(state.meals).toEqual([]);
    expect(state.totalCalories).toBe(0);
  });

  it('addMeal appends a meal with id and timestamp', () => {
    useMealStore.getState().addMeal({
      dishName: 'Rice',
      servings: 2,
      caloriesPerServing: 200,
      totalCalories: 400,
      source: 'USDA',
    });

    const { meals } = useMealStore.getState();
    expect(meals).toHaveLength(1);
    expect(meals[0].dishName).toBe('Rice');
    expect(meals[0].servings).toBe(2);
    expect(meals[0].totalCalories).toBe(400);
    expect(meals[0].id).toBeDefined();
    expect(meals[0].timestamp).toBeInstanceOf(Date);
  });

  it('accumulates totalCalories across multiple meals', () => {
    const { addMeal } = useMealStore.getState();
    addMeal({ dishName: 'A', servings: 1, caloriesPerServing: 100, totalCalories: 100, source: 's' });
    addMeal({ dishName: 'B', servings: 2, caloriesPerServing: 150, totalCalories: 300, source: 's' });

    expect(useMealStore.getState().totalCalories).toBe(400);
    expect(useMealStore.getState().meals).toHaveLength(2);
  });

  it('clearMeals resets everything', () => {
    useMealStore.getState().addMeal({
      dishName: 'X',
      servings: 1,
      caloriesPerServing: 500,
      totalCalories: 500,
      source: 's',
    });

    useMealStore.getState().clearMeals();

    expect(useMealStore.getState().meals).toEqual([]);
    expect(useMealStore.getState().totalCalories).toBe(0);
  });

  it('removeMeal removes the correct entry and recalculates total', () => {
    const { addMeal } = useMealStore.getState();
    addMeal({ dishName: 'A', servings: 1, caloriesPerServing: 100, totalCalories: 100, source: 's' });
    addMeal({ dishName: 'B', servings: 1, caloriesPerServing: 200, totalCalories: 200, source: 's' });

    const idToRemove = useMealStore.getState().meals[0].id;
    useMealStore.getState().removeMeal(idToRemove);

    const state = useMealStore.getState();
    expect(state.meals).toHaveLength(1);
    expect(state.meals[0].dishName).toBe('B');
    expect(state.totalCalories).toBe(200);
  });

  it('removeMeal with non-existent id does nothing', () => {
    useMealStore.getState().addMeal({
      dishName: 'X',
      servings: 1,
      caloriesPerServing: 100,
      totalCalories: 100,
      source: 's',
    });

    useMealStore.getState().removeMeal('non-existent-id');

    expect(useMealStore.getState().meals).toHaveLength(1);
    expect(useMealStore.getState().totalCalories).toBe(100);
  });

  it('persists to localStorage', () => {
    useMealStore.getState().addMeal({
      dishName: 'Pasta',
      servings: 1,
      caloriesPerServing: 280,
      totalCalories: 280,
      source: 's',
    });

    const stored = JSON.parse(localStorage.getItem('meal-storage')!);
    expect(stored.state.meals).toHaveLength(1);
    expect(stored.state.totalCalories).toBe(280);
  });
});
