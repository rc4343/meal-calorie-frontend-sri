// Registration
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Backend responses
export interface RegisterResponse {
  message: string;
  token: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
}

// Calorie Lookup
export interface CalorieRequest {
  dish_name: string;
  servings: number;
}

export interface CalorieResponse {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
}

// Client-side meal entry
export interface MealEntry {
  id: string;
  dishName: string;
  servings: number;
  caloriesPerServing: number;
  totalCalories: number;
  source: string;
  timestamp: Date;
}
