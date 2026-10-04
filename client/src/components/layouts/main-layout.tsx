import { Outlet } from 'react-router-dom';
import Navbar from '@/components/core/navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}