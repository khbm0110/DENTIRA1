'use client';

import { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ImageUploaderProps {
  folder: string; // e.g. 'services', 'doctors', 'blog', 'pricing', 'offers'
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function ImageUploader({ folder, value, onChange, label = 'Image' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Make sure you are logged in and the "media" storage bucket exists.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-white/90 text-slate-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="mb-2 animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={32} className="mb-2" />
              <span className="text-sm font-medium">Click to upload photo</span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
