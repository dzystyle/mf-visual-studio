import React from 'react';
import { Link } from '@tanstack/react-router';
import { 
  User, 
  Settings as SettingsIcon, 
  Coins, 
  FileText, 
  Tag, 
  Key, 
  ShieldCheck, 
  FileLock2, 
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  const menuItems = [
    { id: 'profile', label: '编辑资料', icon: User, path: '/settings/profile' },
    { id: 'settings', label: '设置', icon: SettingsIcon, path: '/settings/account' },
    { separator: true },
    { id: 'credits', label: '积分详情', icon: Coins, path: '/settings/billing', search: { tab: 'credits' } },
    { id: 'invoices', label: '订单发票', icon: FileText, path: '/settings/billing', search: { tab: 'invoices' } },
    { id: 'pricing', label: '价格详情', icon: Tag, path: '/settings/billing', search: { tab: 'pricing' } },
    { id: 'api', label: 'Agent API 密钥', icon: Key, path: '/settings/account' },
    { separator: true },
    { id: 'terms', label: '使用条款', icon: ShieldCheck, path: '/settings/account' },
    { id: 'privacy', label: '隐私政策', icon: FileLock2, path: '/settings/account' },
    { separator: true },
    { id: 'logout', label: '退出登录', icon: LogOut, path: '/', color: 'text-red-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="relative flex h-full max-h-[860px] w-full max-w-[1200px] overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f12] shadow-2xl">
        {/* Close Button */}
        <Link 
          to="/" 
          className="absolute right-6 top-6 z-10 rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
        >
          <X className="h-5 w-5 text-white/60" />
        </Link>

        {/* Sidebar */}
        <div className="w-[280px] border-r border-white/5 bg-[#0a0a0c] p-8 flex flex-col">
          <h2 className="mb-8 text-xl font-bold text-white">管理账户</h2>
          
          <div className="mb-8 flex items-center gap-4 px-2">
            <Avatar className="h-12 w-12 border border-white/10 bg-white/5">
              <AvatarFallback className="bg-transparent text-white/40">U</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="truncate text-sm font-medium text-white/40">yangdu776@gmail.com</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item, idx) => {
              if (item.separator) {
                return <div key={`sep-${idx}`} className="my-4 border-t border-white/5 mx-2" />;
              }
              
              const Icon = item.icon!;
              const isActive = activeTab === item.id;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  search={(item as any).search}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white/10 text-white" 
                      : cn("text-white/40 hover:bg-white/5 hover:text-white/60", item.color)
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#0f0f12] p-8 md:p-12 scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}
