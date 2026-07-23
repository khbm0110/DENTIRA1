'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Upload, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { deleteMediaFile } from '@/app/actions/admin';

interface MediaFile {
  name: string;
  url: string;
  createdAt: string;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // List every top-level "folder" used by the uploader (services, doctors, blog, pricing, offers)
      // plus files stored at the bucket root.
      const folders = ['', 'services', 'doctors', 'blog', 'pricing', 'offers'];
      const all: MediaFile[] = [];
      for (const folder of folders) {
        const { data, error: listError } = await supabase.storage.from('media').list(folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });
        if (listError) continue;
        for (const item of data || []) {
          if (!item.id) continue; // skip placeholder/folder entries
          const path = folder ? `${folder}/${item.name}` : item.name;
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
          all.push({ name: path, url: urlData.publicUrl, createdAt: item.created_at || '' });
        }
      }
      all.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setFiles(all);
    } catch (err: any) {
      setError(err?.message || 'Failed to load media library. Make sure the "media" storage bucket exists in Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
      if (uploadError) throw uploadError;
      await load();
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Delete this file? Any page still referencing it will show a broken image.')) return;
    try {
      await deleteMediaFile(path);
      setFiles((prev) => prev.filter((f) => f.name !== path));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete file');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Media Library</h2>
          <p className="text-slate-500 text-sm mt-1">Images uploaded from every part of the dashboard, in one place.</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading media...
        </div>
      ) : files.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400">
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div key={file.name} className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
              <div className="p-2">
                <p className="text-xs text-slate-500 truncate" title={file.name}>{file.name}</p>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopy(file.url)}
                  className="p-2 bg-white rounded-full text-slate-700 hover:text-primary"
                  title="Copy URL"
                >
                  {copiedUrl === file.url ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(file.name)}
                  className="p-2 bg-white rounded-full text-slate-700 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
