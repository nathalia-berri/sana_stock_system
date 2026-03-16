import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownUp,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from './Logo';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Materiais', path: '/materials' },
  { icon: ArrowDownUp, label: 'Movimentações', path: '/movements' },
  { icon: FileText, label: 'Relatórios', path: '/reports' },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#E2E8F0]">
        <Logo size="md" />
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border-none cursor-pointer"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#E2E8F0] h-screen fixed left-0 top-0">
        <SidebarContent />
      </aside>

      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#E2E8F0] z-40 transform transition-transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
