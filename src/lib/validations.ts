import { z } from "zod/v4";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const mealSchema = z.object({
  dish_name: z.string().min(1, "Dish name is required"),
  servings: z.number({ error: "Enter a valid number" }).positive("Servings must be greater than zero"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type MealFormData = z.infer<typeof mealSchema>;
