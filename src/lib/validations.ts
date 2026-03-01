import { z } from "zod/v4";

// Backend allows: letters, numbers, spaces, hyphens, commas, apostrophes (1-100 chars)
const DISH_NAME_PATTERN = /^[a-zA-Z0-9 ,'\-]+$/;

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "Max 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Max 50 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const mealSchema = z.object({
  dish_name: z
    .string()
    .min(1, "Dish name is required")
    .max(100, "Max 100 characters")
    .regex(DISH_NAME_PATTERN, "Only letters, numbers, spaces, hyphens, commas, and apostrophes"),
  servings: z
    .number({ error: "Enter a valid number" })
    .min(0.1, "Minimum 0.1 servings")
    .max(1000, "Maximum 1000 servings"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type MealFormData = z.infer<typeof mealSchema>;
