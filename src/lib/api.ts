import { useAuthStore } from '@/stores/authStore';
import { clearAuthCookie } from '@/lib/cookies';
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  CalorieRequest,
  CalorieResponse,
  UserProfile,
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

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export interface AuthResult {
  token: string;
  user: UserProfile;
}

// --- mock implementations ---

async function mockRegisterUser(data: RegisterRequest): Promise<ApiResponse<AuthResult>> {
  await delay(500);
  return {
    data: {
      token: 'mock-jwt-token-xxx',
      user: { email: data.email, firstName: data.firstName, lastName: data.lastName },
    },
    status: 200,
  };
}

async function mockLoginUser(data: LoginRequest): Promise<ApiResponse<AuthResult>> {
  await delay(500);
  return {
    data: { token: 'mock-jwt-token-xxx', user: { email: data.email } },
    status: 200,
  };
}

async function mockGetCalories(data: CalorieRequest): Promise<ApiResponse<CalorieResponse>> {
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

// --- core request ---

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const { token } = useAuthStore.getState();

  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    clearAuthCookie();
    // redirect outside React router context
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw { message: 'Session expired', status: 401 } as ApiError;
  }

  if (!response.ok) {
    let message = '';
    try {
      const body = await response.json();
      message = body.message ?? body.detail ?? '';
    } catch { /* non-JSON body */ }

    throw { message, status: response.status } as ApiError;
  }

  const data: T = await response.json();
  return { data, status: response.status };
}

// --- fallback wrapper ---

async function withFallback<T>(
  realCall: () => Promise<ApiResponse<T>>,
  mockCall: () => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> {
  if (!HAS_API) return mockCall();
  return realCall();
}

// --- public API ---

export async function registerUser(data: RegisterRequest): Promise<ApiResponse<AuthResult>> {
  return withFallback(
    async () => {
      const res = await apiRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return {
        data: {
          token: res.data.token,
          user: { email: data.email, firstName: data.firstName, lastName: data.lastName },
        },
        status: res.status,
      };
    },
    () => mockRegisterUser(data),
  );
}

export async function loginUser(data: LoginRequest): Promise<ApiResponse<AuthResult>> {
  return withFallback(
    async () => {
      const res = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { data: { token: res.data.token, user: { email: data.email } }, status: res.status };
    },
    () => mockLoginUser(data),
  );
}

export async function getCalories(data: CalorieRequest): Promise<ApiResponse<CalorieResponse>> {
  return withFallback(
    () => apiRequest<CalorieResponse>('/get-calories', { method: 'POST', body: JSON.stringify(data) }),
    () => mockGetCalories(data),
  );
}
