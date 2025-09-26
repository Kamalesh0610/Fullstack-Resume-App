/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        return { error: errorData.detail || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Auth endpoints
  async signup(email: string, password: string) {
    const result = await this.request<{ id: string; email: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{ access_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.data) {
      this.setToken(result.data.access_token);
    }
    return result;
  }

  async getMe() {
    const result = await this.request<{ id: string; email: string }>('/auth/me');
    return result;
  }

  // Resume endpoints
  async getResumes() {
    const result = await this.request<Array<{
      id: string;
      title: string;
      template: string;
      owner_id: string;
      personal: any;
      education: any[];
      experience: any[];
      skills: string[];
    }>>('/resume');
    return result;
  }

  async createResume(resume: {
    title: string;
    template: string;
    personal: any;
    education: any[];
    experience: any[];
    skills: string[];
  }) {
    const result = await this.request<{
      id: string;
      title: string;
      template: string;
      owner_id: string;
      personal: any;
      education: any[];
      experience: any[];
      skills: string[];
    }>('/resume', {
      method: 'POST',
      body: JSON.stringify(resume),
    });
    return result;
  }

  async updateResume(id: string, resume: {
    title: string;
    template: string;
    personal: any;
    education: any[];
    experience: any[];
    skills: string[];
  }) {
    const result = await this.request<{
      id: string;
      title: string;
      template: string;
      owner_id: string;
      personal: any;
      education: any[];
      experience: any[];
      skills: string[];
    }>(`/resume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resume),
    });
    return result;
  }

  async deleteResume(id: string) {
    const result = await this.request(`/resume/${id}`, {
      method: 'DELETE',
    });
    return result;
  }

  async getPublicResume(id: string) {
    const result = await this.request<{
      title: string;
      template: string;
      personal: any;
      education: any[];
      experience: any[];
      skills: string[];
    }>(`/resume/${id}`);
    return result;
  }
}

export const api = new ApiService();