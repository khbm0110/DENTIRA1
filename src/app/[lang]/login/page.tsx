'use client';

// DENTORA-OS - ADMIN LOGIN PAGE
// Supabase Authentication integration for admin access

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailPassword } from '../../../lib/supabase/auth';
import dictionary from '../../../lib/i18n/dictionary';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const lang = 'fr'; // Default language
  const dict = dictionary[lang];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithEmailPassword(email, password);
      
      if (result.success) {
        router.push(`/${lang}/admin`);
      } else {
        setError(dict.admin.login_error);
      }
    } catch (err) {
      setError(dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-3xl mb-4">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              dentistry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">{dict.admin.login_title}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{dict.admin.login_subtitle}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-4xl p-8 clinical-shadow">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              {dict.admin.email_label}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="admin@dentora.ma"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              {dict.admin.password_label}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all clinical-shadow btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {dict.common.loading}
              </>
            ) : (
              dict.admin.login_button
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href={`/${lang}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
