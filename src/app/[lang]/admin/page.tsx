'use client';

// DENTORA-OS - ADMIN DASHBOARD
// Protected dashboard for clinic staff to manage appointments

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, getCurrentUser } from '../../../lib/supabase/auth';
import { getAppointments, updateAppointmentStatus, getAppointmentStats, Appointment } from '../../../lib/supabase/client';
import dictionary from '../../../lib/i18n/dictionary';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  LogOut, 
  Loader2,
  Phone,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { DENTORA_CORE } from '../../../config/dentora-system';

export default function AdminDashboard() {
  const router = useRouter();
  const lang = 'fr';
  const dict = dictionary[lang];
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, confirmed: 0 });
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { user, error } = await getCurrentUser();
      
      if (error || !user) {
        router.push(`/${lang}/login`);
        return;
      }

      setUserEmail(user.email || null);
      await loadData();
    } catch (err) {
      router.push(`/${lang}/login`);
    }
  };

  const loadData = async () => {
    setLoading(true);
    
    try {
      const [appointmentsResult, statsResult] = await Promise.all([
        getAppointments(),
        getAppointmentStats()
      ]);

      if (appointmentsResult.data) {
        setAppointments(appointmentsResult.data);
      }
      
      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    const result = await updateAppointmentStatus(id, status);
    if (result.data) {
      await loadData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push(`/${lang}/login`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">{dict.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-outline-variant sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                dentistry
              </span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{dict.admin.dashboard}</h1>
              <p className="text-xs text-on-surface-variant">{dict.admin.welcome_message}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${DENTORA_CORE.connectivity.phone}`}
              className="hidden sm:flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <Phone size={16} />
              {DENTORA_CORE.connectivity.phone}
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} />
              {dict.admin.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 clinical-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Calendar className="text-primary" size={24} />
              </div>
              <button onClick={loadData} className="p-2 hover:bg-surface rounded-xl transition-colors">
                <RefreshCw size={16} className="text-on-surface-variant" />
              </button>
            </div>
            <p className="text-3xl font-black">{stats.total}</p>
            <p className="text-xs text-on-surface-variant font-medium">{dict.admin.total_appointments}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 clinical-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.pending}</p>
            <p className="text-xs text-on-surface-variant font-medium">{dict.admin.pending_appointments}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 clinical-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.completed}</p>
            <p className="text-xs text-on-surface-variant font-medium">{dict.admin.completed_appointments}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 clinical-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <LayoutDashboard className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-black">{stats.confirmed}</p>
            <p className="text-xs text-on-surface-variant font-medium">Confirmés</p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl clinical-shadow overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <h2 className="text-xl font-bold">{dict.admin.recent_bookings}</h2>
          </div>
          
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-50" />
              <p className="text-on-surface-variant">Aucun rendez-vous pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {dict.admin.name}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {dict.admin.phone}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {dict.admin.service}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {dict.admin.date}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {dict.admin.status}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-surface transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium">{appointment.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`tel:${appointment.phone}`}
                          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Phone size={14} />
                          {appointment.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {dict.services[appointment.service as keyof typeof dict.services] || appointment.service}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-sm">
                        {new Date(appointment.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${appointment.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                            title="Contacter via WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </a>
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                              title="Confirmer"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
