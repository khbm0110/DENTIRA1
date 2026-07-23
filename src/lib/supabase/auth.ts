// DENTORA-OS - SUPABASE AUTHENTICATION
// Authentication methods using Supabase Auth
// Uses @supabase/supabase-js v2 API

import { supabase } from './client';

export interface AuthResult {
  success: boolean;
  error?: string;
}

// Sign in with email and password
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await (supabase.auth as any).signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Authentication failed' };
  }
}

// Sign up new admin user
export async function signUpWithEmailPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await (supabase.auth as any).signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Sign up failed' };
  }
}

// Sign out current user
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await (supabase.auth as any).signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Sign out failed' };
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const { data, error } = await (supabase.auth as any).getSession();

    if (error) {
      return { session: null, error: error.message };
    }

    return { session: data.session, error: null };
  } catch (err) {
    return { session: null, error: 'Failed to get session' };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data, error } = await (supabase.auth as any).getUser();

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: 'Failed to get user' };
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return (supabase.auth as any).onAuthStateChange(callback);
}
