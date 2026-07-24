'use client';

// DENTORA-OS - ADMIN LOGIN PAGE
// Supabase Authentication integration for admin access.
// If no admin account exists yet, shows a one-time "create the first admin
// account" form instead of the login form - removes the previous manual
// SQL step needed to bootstrap the very first admin.

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../../../lib/supabase/auth';
import { supabase } from '../../../lib/supabase/client';
import dictionary from '../../../lib/i18n/dictionary';
import { ADMIN_SECRET_PATH } from '../../../config/admin-path';
import { Mail, Lock, AlertCircle, Loader2, Smile, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';
  const dict = dictionary[lang as 'fr' | 'ar'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // null = still checking, true = no admin yet (show setup form), false = normal login
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: rpcError } = await (supabase as any).rpc('admin_exists');
        if (!cancelled) setNeedsSetup(rpcError ? false : !data);
      } catch {
        if (!cancelled) setNeedsSetup(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (needsSetup && password !== confirmPassword) {
      setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (needsSetup && password.length < 8) {
      setError(lang === 'ar' ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.' : 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      const result = needsSetup
        ? await signUpWithEmailPassword(email, password)
        : await signInWithEmailPassword(email, password);

      if (result.success) {
        if (needsSetup) {
          // Supabase requires a fresh sign-in after sign-up in most project
          // configurations (email confirmation may or may not be required
          // depending on the project's auth settings).
          const signInResult = await signInWithEmailPassword(email, password);
          if (signInResult.success) {
            router.push(`/${lang}/${ADMIN_SECRET_PATH}`);
          } else {
            setError(lang === 'ar'
              ? 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده، ثم سجل الدخول.'
              : 'Compte créé. Vérifiez votre email pour le confirmer, puis connectez-vous.');
            setNeedsSetup(false);
          }
        } else {
          router.push(`/${lang}/${ADMIN_SECRET_PATH}`);
        }
      } else {
        setError(result.error || dict.admin.login_error);
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
            <Smile className="text-white" size={30} strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">
            {needsSetup ? (lang === 'ar' ? 'إنشاء حساب المدير' : 'Créer le compte administrateur') : dict.admin.login_title}
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            {needsSetup
              ? (lang === 'ar' ? 'لا يوجد أي حساب مدير بعد - أنشئ الحساب الأول هنا.' : "Aucun compte admin n'existe encore - créez le premier ici.")
              : dict.admin.login_subtitle}
          </p>
        </div>

        {needsSetup === null ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-4xl p-8 clinical-shadow">
            {needsSetup && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-blue-700">
                <ShieldCheck size={20} className="shrink-0" />
                <span className="text-xs">
                  {lang === 'ar'
                    ? 'هذا النموذج غادي يختفي تلقائيًا بمجرد إنشاء أول حساب مدير.'
                    : 'Ce formulaire disparaîtra automatiquement une fois le premier compte admin créé.'}
                </span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

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

            <div className={needsSetup ? 'mb-6' : 'mb-8'}>
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
                  minLength={needsSetup ? 8 : undefined}
                />
              </div>
            </div>

            {needsSetup && (
              <div className="mb-8">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

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
              ) : needsSetup ? (
                lang === 'ar' ? 'إنشاء الحساب' : 'Créer le compte'
              ) : (
                dict.admin.login_button
              )}
            </button>
          </form>
        )}

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
