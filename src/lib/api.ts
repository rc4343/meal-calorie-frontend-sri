import { useAuthStore } from '@/stores/authStore';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  CalorieRequest,
  CalorieResponse,
} from '@/types';

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const HAS_API = Boolean(BASE_URL);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockRegisterUser(
  data: RegisterRequest,
): Promise<ApiResponse<AuthResponse>> {
  await delay(500);
  return {
    data: {
      token: 'mock-jwt-token-xxx',
      user: {
        id: '1',
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      },
    },
    status: 200,
  };
}

async function mockLoginUser(
  data: LoginRequest,
): Promise<ApiResponse<AuthResponse>> {
  await delay(500);
  return {
    data: {
      token: 'mock-jwt-token-xxx',
      user: {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: data.email,
      },
    },
    status: 200,
  };
}

async function mockGetCalories(
  data: CalorieRequest,
): Promise<ApiResponse<CalorieResponse>> {
  await delay(500);
  return {
    data: {
      dish_name: data.dish_name,
      servings: data.servings,
      calories_per_serving: 280,
      total_calories: 280 * data.servings,
      source: 'USDA FoodData Central (Mock)',
    },
    status: 200,
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const { token } = useAuthStore.getState();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw { message: 'Session expired', status: 401 } as ApiError;
  }

  if (!response.ok) {
    let message = 'An unexpected error occurred';
    try {
      const body = await response.json();
      message = body.message ?? body.detail ?? message;
    } catch {
      // non-JSON response body
    }
    throw { message, status: response.status } as ApiError;
  }

  const data: T = await response.json();
  return { data, status: response.status };
}

async function withFallback<T>(
  realCall: () => Promise<ApiResponse<T>>,
  mockCall: () => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> {
  if (!HAS_API) return mockCall();

  try {
    return await realCall();
  } catch (err) {
    const apiErr = err as ApiError;
    // If it's a proper API error (server responded), don't fall back
    if (apiErr.status && apiErr.status > 0) throw err;
    // Network error or server unreachable, fall back to mock
    console.warn('API unreachable, using mock data');
    return mockCall();
  }
}

export async function registerUser(
  data: RegisterRequest,
): Promise<ApiResponse<AuthResponse>> {
  return withFallback(
    () => apiRequest<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    () => mockRegisterUser(data),
  );
}

export async function loginUser(
  data: LoginRequest,
): Promise<ApiResponse<AuthResponse>> {
  return withFallback(
    () => apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    () => mockLoginUser(data),
  );
}

export async function getCalories(
  data: CalorieRequest,
): Promise<ApiResponse<CalorieResponse>> {
  return withFallback(
    () => apiRequest<CalorieResponse>('/get-calories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    () => mockGetCalories(data),
  );
}
