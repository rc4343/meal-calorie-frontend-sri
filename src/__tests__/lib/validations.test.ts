import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, mealSchema } from '@/lib/validations';

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'securepass',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing first name', () => {
    const result = registerSchema.safeParse({
      firstName: '',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' });
    expect(result.success).toBe(false);
  });
});

describe('mealSchema', () => {
  it('accepts valid meal data', () => {
    const result = mealSchema.safeParse({ dish_name: 'Grilled Chicken', servings: 2 });
    expect(result.success).toBe(true);
  });

  it('accepts dish name with allowed special chars', () => {
    const result = mealSchema.safeParse({ dish_name: "Mac n' Cheese, large", servings: 1 });
    expect(result.success).toBe(true);
  });

  it('rejects dish name with special characters', () => {
    const result = mealSchema.safeParse({ dish_name: 'Pasta @home!', servings: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects empty dish name', () => {
    const result = mealSchema.safeParse({ dish_name: '', servings: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects servings below minimum', () => {
    const result = mealSchema.safeParse({ dish_name: 'Rice', servings: 0.05 });
    expect(result.success).toBe(false);
  });

  it('rejects servings above maximum', () => {
    const result = mealSchema.safeParse({ dish_name: 'Rice', servings: 1001 });
    expect(result.success).toBe(false);
  });

  it('accepts boundary servings (0.1 and 1000)', () => {
    expect(mealSchema.safeParse({ dish_name: 'A', servings: 0.1 }).success).toBe(true);
    expect(mealSchema.safeParse({ dish_name: 'A', servings: 1000 }).success).toBe(true);
  });
});
