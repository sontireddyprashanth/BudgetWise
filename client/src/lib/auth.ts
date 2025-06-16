import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

class AuthManager {
  private token: string | null = null;
  private user: AuthUser | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data: AuthResponse = await response.json();
    this.setAuth(data.token, data.user);
    return data.user;
  }

  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data: AuthResponse = await response.json();
    this.setAuth(data.token, data.user);
    return data.user;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem("auth_token");
  }

  private setAuth(token: string, user: AuthUser): void {
    this.token = token;
    this.user = user;
    localStorage.setItem("auth_token", token);
  }
}

export const authManager = new AuthManager();