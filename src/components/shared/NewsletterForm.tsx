'use client';

import { useState, useRef } from 'react';
import { Loader2, Check } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions/public';

export default function NewsletterForm({ placeholder, buttonText }: { placeholder: string; buttonText: string }) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const formRenderedAt = useRef(Date.now());
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await subscribeToNewsletter(email, honeypot, formRenderedAt.current);
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-white bg-white/10 rounded-full py-4 px-6 w-full sm:w-auto">
        <Check size={18} />
        <span className="text-sm font-medium">Merci ! Vous êtes inscrit(e).</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Honeypot - invisible to real visitors, bots tend to fill every field */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />
      <div className="flex-1">
        <input
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
          placeholder={placeholder}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
        {status === 'error' && <p className="text-red-100 text-xs mt-2 px-2">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-white text-primary px-8 py-4 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shrink-0 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
        {buttonText}
      </button>
    </form>
  );
}
