import { getHeroContent } from '@/lib/supabase/public-settings';
import HeroContentForm from '@/components/admin/HeroContentForm';

export default async function ContentAdminPage() {
  const heroContent = await getHeroContent();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Website Content</h2>
        <p className="text-slate-500 text-sm mt-1">
          Edit the main headline and subtitle shown at the top of the homepage.
        </p>
      </div>

      <HeroContentForm initial={heroContent} />

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-700">
        <p className="font-bold mb-1">More content coming soon</p>
        <p>
          Other homepage sections (services, team, testimonials, packages, offers, blog, FAQ) already have
          their own dedicated management pages in the sidebar. This page currently covers only the main
          Hero headline - additional homepage text sections can be added here the same way if needed.
        </p>
      </div>
    </div>
  );
}
