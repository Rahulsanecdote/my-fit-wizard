// Mock authentication system for development when email confirmation is problematic
import { User } from '@supabase/supabase-js';

interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
}

interface MockSession {
  user: MockUser;
  access_token: string;
  expires_at?: number;
}

const MOCK_USERS_KEY = 'fitgenie_mock_users';
const MOCK_SESSION_KEY = 'fitgenie_mock_session';

export class MockAuth {
  private static generateId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  static getStoredUsers(): MockUser[] {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static storeUser(user: MockUser): void {
    const users = this.getStoredUsers();
    users.push(user);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  static findUserByEmail(email: string): MockUser | null {
    const users = this.getStoredUsers();
    return users.find(user => user.email === email) || null;
  }

  static createMockSession(user: MockUser): MockSession {
    return {
      user,
      access_token: this.generateToken(),
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
  }

  static storeSession(session: MockSession): void {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  }

  static getStoredSession(): MockSession | null {
    const stored = localStorage.getItem(MOCK_SESSION_KEY);
    if (!stored) return null;
    
    const session = JSON.parse(stored);
    // Check if session is expired
    if (session.expires_at && Date.now() > session.expires_at) {
      this.clearSession();
      return null;
    }
    
    return session;
  }

  static clearSession(): void {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }

  static async signUp(email: string, password: string, userData?: Record<string, unknown>) {
    // Check if user already exists
    if (this.findUserByEmail(email)) {
      return {
        error: { message: 'User already registered' }
      };
    }

    // Create new user
    const user: MockUser = {
      id: this.generateId(),
      email,
      user_metadata: {
        first_name: userData?.first_name as string,
        last_name: userData?.last_name as string,
      },
      created_at: new Date().toISOString()
    };

    // Store user
    this.storeUser(user);

    // Create and store session
    const session = this.createMockSession(user);
    this.storeSession(session);

    return {
      data: {
        user: user as User,
        session: session as any
      },
      error: null
    };
  }

  static async signIn(email: string, password: string) {
    const user = this.findUserByEmail(email);
    
    if (!user) {
      return {
        error: { message: 'Invalid login credentials' }
      };
    }

    // Create and store session
    const session = this.createMockSession(user);
    this.storeSession(session);

    return {
      data: {
        user: user as User,
        session: session as any
      },
      error: null
    };
  }

  static async signOut() {
    this.clearSession();
    return { error: null };
  }

  static getCurrentSession(): MockSession | null {
    return this.getStoredSession();
  }

  static getCurrentUser(): MockUser | null {
    const session = this.getStoredSession();
    return session?.user || null;
  }
}

// Check if we should use mock auth (development mode)
export const shouldUseMockAuth = () => {
  return import.meta.env.DEV && localStorage.getItem('use_mock_auth') === 'true';
};

export const enableMockAuth = () => {
  localStorage.setItem('use_mock_auth', 'true');
  window.location.reload();
};

export const disableMockAuth = () => {
  localStorage.removeItem('use_mock_auth');
  MockAuth.clearSession();
  window.location.reload();
};
