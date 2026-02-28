// Registration
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response (shared by register and login)
export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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
