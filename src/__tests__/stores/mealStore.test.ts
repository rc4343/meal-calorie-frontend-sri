import { describe, it, expect, beforeEach } from 'vitest';
import { useMealStore } from '@/stores/mealStore';

/**
 * Feature: meal-calorie-tracker
 * Validates: Requirements 8.1, 8.3, 9.1
 */

describe('mealStore unit tests', () => {
  beforeEach(() => {
    useMealStore.setState({ meals: [], totalCalories: 0 });
  });

  it('starts with empty meals and zero totalCalories', () => {
    const state = useMealStore.getState();
    expect(state.meals).toEqual([]);
    expect(state.totalCalories).toBe(0);
  });

  it('addMeal appends a meal with generated id and timestamp', () => {
    useMealStore.getState().addMeal({
      dishName: 'Rice',
      servings: 2,
      caloriesPerServing: 200,
      totalCalories: 400,
      source: 'test-api',
    });

    const state = useMealStore.getState();
    expect(state.meals).toHaveLength(1);
    expect(state.meals[0].dishName).toBe('Rice');
    expect(state.meals[0].servings).toBe(2);
    expect(state.meals[0].caloriesPerServing).toBe(200);
    expect(state.meals[0].totalCalories).toBe(400);
    expect(state.meals[0].source).toBe('test-api');
    expect(state.meals[0].id).toBeDefined();
    expect(state.meals[0].timestamp).toBeInstanceOf(Date);
  });

  it('recomputes totalCalories after each addMeal', () => {
    const { addMeal } = useMealStore.getState();

    addMeal({ dishName: 'A', servings: 1, caloriesPerServing: 100, totalCalories: 100, source: 's' });
    expect(useMealStore.getState().totalCalories).toBe(100);

    addMeal({ dishName: 'B', servings: 2, caloriesPerServing: 150, totalCalories: 300, source: 's' });
    expect(useMealStore.getState().totalCalories).toBe(400);
  });

  it('clearMeals resets meals and totalCalories', () => {
    useMealStore.getState().addMeal({
      dishName: 'X',
      servings: 1,
      caloriesPerServing: 500,
      totalCalories: 500,
      source: 's',
    });

    useMealStore.getState().clearMeals();

    const state = useMealStore.getState();
    expect(state.meals).toEqual([]);
    expect(state.totalCalories).toBe(0);
  });

  it('persists meals to localStorage', () => {
    useMealStore.getState().addMeal({
      dishName: 'Test',
      servings: 1,
      caloriesPerServing: 100,
      totalCalories: 100,
      source: 's',
    });

    const stored = localStorage.getItem('meal-storage');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.meals).toHaveLength(1);
    expect(parsed.state.totalCalories).toBe(100);
  });
});


import * as fc from 'fast-check';
import type { MealEntry } from '@/types';

/**
 * Feature: meal-calorie-tracker
 * Validates: Requirements 8.1, 8.3, 9.1, 9.2
 */

// Arbitrary for generating valid meal entries (without id and timestamp)
const mealEntryArb: fc.Arbitrary<Omit<MealEntry, 'id' | 'timestamp'>> = fc.record({
  dishName: fc.string({ minLength: 1, maxLength: 100 }),
  servings: fc.integer({ min: 1, max: 1000 }),
  caloriesPerServing: fc.integer({ min: 0, max: 10000 }),
  totalCalories: fc.integer({ min: 0, max: 10000000 }),
  source: fc.string({ minLength: 1, maxLength: 100 }),
});

describe('mealStore property tests', () => {
  beforeEach(() => {
    useMealStore.setState({ meals: [], totalCalories: 0 });
  });

  it('Feature: meal-calorie-tracker, Property 9: Adding a meal grows the history', () => {
    /**
     * Property 9: Adding a meal grows the history
     * For any Meal_Store state and any valid meal entry, calling addMeal(entry)
     * should increase the meals array length by exactly one, and the new entry
     * should appear in the array with a generated id and timestamp.
     *
     * Validates: Requirements 8.1
     */
    fc.assert(
      fc.property(mealEntryArb, (entry) => {
        // Reset state
        useMealStore.setState({ meals: [], totalCalories: 0 });

        const before = useMealStore.getState().meals.length;

        // Act
        useMealStore.getState().addMeal(entry);

        const after = useMealStore.getState();

        // Length increased by exactly one
        expect(after.meals.length).toBe(before + 1);

        // The new entry is the last element
        const added = after.meals[after.meals.length - 1];
        expect(added.dishName).toBe(entry.dishName);
        expect(added.servings).toBe(entry.servings);
        expect(added.caloriesPerServing).toBe(entry.caloriesPerServing);
        expect(added.totalCalories).toBe(entry.totalCalories);
        expect(added.source).toBe(entry.source);

        // Has generated id and timestamp
        expect(typeof added.id).toBe('string');
        expect(added.id.length).toBeGreaterThan(0);
        expect(added.timestamp).toBeInstanceOf(Date);
      }),
      { numRuns: 100 }
    );
  });

  it('Feature: meal-calorie-tracker, Property 10: Total calories invariant', () => {
    /**
     * Property 10: Total calories invariant
     * For any sequence of addMeal operations on the Meal_Store, the totalCalories
     * field should always equal the sum of totalCalories across all entries in the
     * meals array.
     *
     * Validates: Requirements 9.1, 9.2
     */
    fc.assert(
      fc.property(fc.array(mealEntryArb, { minLength: 1, maxLength: 20 }), (entries) => {
        // Reset state
        useMealStore.setState({ meals: [], totalCalories: 0 });

        // Add all meals sequentially
        for (const entry of entries) {
          useMealStore.getState().addMeal(entry);

          // Invariant must hold after every addMeal
          const state = useMealStore.getState();
          const expectedTotal = state.meals.reduce((sum, m) => sum + m.totalCalories, 0);
          expect(state.totalCalories).toBe(expectedTotal);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Feature: meal-calorie-tracker, Property 11: Meal store clear empties history', () => {
    /**
     * Property 11: Meal store clear empties history
     * For any Meal_Store containing one or more meal entries, calling clearMeals()
     * should result in an empty meals array and totalCalories === 0.
     *
     * Validates: Requirements 8.3
     */
    fc.assert(
      fc.property(fc.array(mealEntryArb, { minLength: 1, maxLength: 20 }), (entries) => {
        // Reset state
        useMealStore.setState({ meals: [], totalCalories: 0 });

        // Add meals to populate the store
        for (const entry of entries) {
          useMealStore.getState().addMeal(entry);
        }

        // Precondition: store has meals
        expect(useMealStore.getState().meals.length).toBeGreaterThan(0);

        // Act
        useMealStore.getState().clearMeals();

        // Verify
        const state = useMealStore.getState();
        expect(state.meals).toEqual([]);
        expect(state.totalCalories).toBe(0);
      }),
      { numRuns: 100 }
    );
  });
});
