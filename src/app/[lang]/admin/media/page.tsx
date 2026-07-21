import { UploadCloud, Image as ImageIcon, Trash2, Search } from 'lucide-react';

export default function MediaAdminPage() {
  const media = [
    { id: 1, name: 'clinic-front.jpg', size: '2.4 MB', type: 'image/jpeg' },
    { id: 2, name: 'hero-banner.png', size: '4.1 MB', type: 'image/png' },
    { id: 3, name: 'dr-sarah.jpg', size: '1.2 MB', type: 'image/jpeg' },
    { id: 4, name: 'dr-karim.jpg', size: '1.1 MB', type: 'image/jpeg' },
    { id: 5, name: 'service-ortho.jpg', size: '3.2 MB', type: 'image/jpeg' },
    { id: 6, name: 'service-implant.jpg', size: '2.8 MB', type: 'image/jpeg' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Media Library</h2>
          <p className="text-slate-500 text-sm mt-1">Manage images and documents across your website.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <UploadCloud size={18} />
          Upload Files
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search media..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative border border-slate-200 rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center bg-slate-50 hover:border-primary transition-colors cursor-pointer">
              <ImageIcon size={32} className="text-slate-400 mb-2 group-hover:text-primary transition-colors" />
              <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-2 text-center border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>{item.name}</p>
                <p className="text-[10px] text-slate-500">{item.size}</p>
              </div>
              <button className="absolute top-2 right-2 p-1.5 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
