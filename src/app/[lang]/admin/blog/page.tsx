import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import { deleteBlogPost } from '@/app/actions/admin';
import RowActions from '@/components/admin/RowActions';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import Pagination from '@/components/admin/Pagination';

const PAGE_SIZE = 15;

export default async function BlogAdminPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { page?: string; q?: string };
}) {
  const { lang } = params;
  const supabase = createClient();
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const query = searchParams.q?.trim() || '';
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const basePath = `/${lang}/${ADMIN_SECRET_PATH}/blog`;

  let request = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (query) {
    request = request.or(`title_fr.ilike.%${query}%,title_ar.ilike.%${query}%`);
  }

  const { data: posts = [], count, error } = await request;

  if (error) console.error('Error fetching blog posts:', error);

  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Blog Posts</h2>
          <p className="text-slate-500 text-sm mt-1">Manage articles and news for your patients.</p>
        </div>
        <Link
          href={`/${lang}/${ADMIN_SECRET_PATH}/blog/new`}
          className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <AdminSearchBox basePath={basePath} defaultValue={query} placeholder="Search posts by title..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Title (FR)</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts && posts.length > 0 ? posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{post.title_fr}</td>
                  <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      post.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <RowActions
                      editHref={`/${lang}/${ADMIN_SECRET_PATH}/blog/${post.id}/edit`}
                      onDelete={deleteBlogPost.bind(null, post.id)}
                      confirmMessage={`Delete "${post.title_fr}"?`}
                    />
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  {query ? `No posts match "${query}".` : 'No posts yet. Click "New Post" to create one.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination basePath={basePath} currentPage={page} totalPages={totalPages} searchQuery={query} />
      </div>
    </div>
  );
}
