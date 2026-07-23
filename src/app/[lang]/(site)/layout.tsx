import NavigationBar from '../../../components/common/NavigationBar';
import Footer from '../../../components/common/Footer';
import FloatingActions from '../../../components/shared/FloatingActions';
import { getPublicClinicSettings } from '../../../lib/supabase/public-settings';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicClinicSettings();

  return (
    <>
      <NavigationBar contact={settings.contact} />
      <main>{children}</main>
      <Footer contact={settings.contact} social={settings.social} />
      <FloatingActions contact={settings.contact} />
    </>
  );
}
