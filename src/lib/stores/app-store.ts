// DENTORA-OS - ZUSTAND STORE
// Lightweight global state management for mobile menu, language, and toasts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// App State Interface
interface AppState {
  // Mobile Menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Language Preference
  language: 'fr' | 'ar';
  setLanguage: (lang: 'fr' | 'ar') => void;
  
  // Toast Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Toast Interface
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Mobile Menu State
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      
      // Language State (persisted)
      language: 'fr',
      setLanguage: (lang) => {
        set({ language: lang });
        // Update document direction
        if (typeof document !== 'undefined') {
          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = lang;
        }
      },
      
      // Toast State
      toasts: [],
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast]
        }));
        
        // Auto remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      },
      
      // Loading State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'dentora-app-storage',
      partialize: (state) => ({ language: state.language }),
    }
  )
);

// Hook for toast helper functions
export const useToast = () => {
  const { addToast } = useAppStore();
  
  return {
    success: (message: string, duration?: number) => 
      addToast({ type: 'success', message, duration }),
    error: (message: string, duration?: number) => 
      addToast({ type: 'error', message, duration }),
    info: (message: string, duration?: number) => 
      addToast({ type: 'info', message, duration }),
    warning: (message: string, duration?: number) => 
      addToast({ type: 'warning', message, duration }),
  };
};

// Hook for language helper
export const useLanguage = () => {
  const { language, setLanguage } = useAppStore();
  
  return {
    language,
    isRTL: language === 'ar',
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'fr' ? 'ar' : 'fr'),
  };
};

// Hook for mobile menu helper
export const useMobileMenu = () => {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useAppStore();
  
  return {
    isOpen: isMobileMenuOpen,
    open: () => useAppStore.setState({ isMobileMenuOpen: true }),
    close: closeMobileMenu,
    toggle: toggleMobileMenu,
  };
};
