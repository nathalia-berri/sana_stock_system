import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sana_token');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 ml-0 lg:ml-64">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#0F172A]">Stock System</h1>
          <p className="text-sm text-[#64748B]">Gestão Inteligente de Almoxarifado</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors border-none bg-transparent cursor-pointer"
          >
            <Bell className="h-5 w-5 text-[#64748B]" />
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-[#EF4444] text-white text-xs">
              3
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-lg px-2 py-1">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>

            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-[#0F172A]">Admin SANA</p>
              <p className="text-xs text-[#64748B]">admin@sana.com</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 text-sm text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
