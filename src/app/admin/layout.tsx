import { checkAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await checkAuth();
  if (!isAuth) redirect('/login');

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <div className="admin-content">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
