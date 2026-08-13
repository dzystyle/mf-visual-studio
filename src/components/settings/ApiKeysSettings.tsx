import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  Power, 
  Copy, 
  Check, 
  Calendar,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AccessKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive';
  expiry: string;
  createdAt: string;
  description?: string;
}

export function ApiKeysSettings() {
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [newKeyData, setNewKeyData] = useState({ name: '', description: '', expiry: '30' });
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const newKey = `ak-4w-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`.toUpperCase();
    setGeneratedKey(newKey);
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(newKeyData.expiry));
    
    const newEntry: AccessKey = {
      id: Math.random().toString(36).substring(7),
      name: newKeyData.name || '未命名 Key',
      key: newKey,
      status: 'active',
      expiry: expiryDate.toISOString().split('T')[0] + ' ' + expiryDate.toTimeString().split(' ')[0].substring(0, 5),
      createdAt: new Date().toLocaleString(),
      description: newKeyData.description
    };
    
    setKeys([newEntry, ...keys]);
    setIsCreateOpen(false);
    setIsSuccessOpen(true);
    setNewKeyData({ name: '', description: '', expiry: '30' });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Access Key 已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStatus = (id: string) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'inactive' : 'active' } : k));
    toast.info("状态已更新");
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
    toast.success("Access Key 已删除");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Access Key 管理
          </h2>
          <p className="mt-1 text-sm text-white/40">
            管理你的 API 访问凭证。你可以创建、启用、停用或删除不再使用的 Access Key。
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-white text-black hover:bg-white/90 rounded-xl px-6 h-11 font-bold transition-all duration-300 active:scale-95"
        >
          创建 Access Key
        </Button>
      </div>

      {keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <Key className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-white/40 text-sm">当前没有生效中的 Access Key，先快捷生成一个吧。</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[13px] font-medium text-white/40">
                  <input type="checkbox" className="rounded border-white/10 bg-transparent" />
                </th>
                <th className="px-6 py-4 text-[13px] font-medium text-white/40">Access Key 名称</th>
                <th className="px-6 py-4 text-[13px] font-medium text-white/40">Access Key</th>
                <th className="px-6 py-4 text-[13px] font-medium text-white/40 text-center">状态</th>
                <th className="px-6 py-4 text-[13px] font-medium text-white/40">过期时间</th>
                <th className="px-6 py-4 text-[13px] font-medium text-white/40 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-5">
                    <input type="checkbox" className="rounded border-white/10 bg-transparent" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-white text-[15px]">{key.name}</div>
                    {key.description && <div className="text-[11px] text-white/30 mt-0.5">{key.description}</div>}
                  </td>
                  <td className="px-6 py-5 font-mono text-[13px] text-white/60">
                    {key.key.substring(0, 6)}********{key.key.substring(key.key.length - 4)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors",
                      key.status === 'active' 
                        ? "bg-emerald-500/10 text-emerald-400" 
                        : "bg-white/5 text-white/30"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", key.status === 'active' ? "bg-emerald-400 animate-pulse" : "bg-white/30")} />
                      {key.status === 'active' ? '生效中' : '已停用'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[13px] text-white/40">{key.expiry}</td>
                  <td className="px-6 py-5 text-right space-x-4">
                    <button 
                      onClick={() => toggleStatus(key.id)}
                      className="text-[13px] text-white/60 hover:text-white transition-colors"
                    >
                      {key.status === 'active' ? '停用' : '启用'}
                    </button>
                    <button 
                      onClick={() => deleteKey(key.id)}
                      className="text-[13px] text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#0f0f12] border-white/10 p-8 rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-6">创建 Access Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/60">Access Key 名称</label>
              <Input 
                placeholder="例如：数据同步服务-生产环境"
                className="h-12 bg-white/5 border-white/5 text-white placeholder:text-white/20 rounded-xl focus:ring-1 focus:ring-primary/50 transition-all"
                value={newKeyData.name}
                onChange={(e) => setNewKeyData({...newKeyData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-white/60">用途描述 <span className="text-white/20">选填</span></label>
              <Textarea 
                placeholder="简要说明该 Access Key 的使用场景，便于后续审计"
                className="bg-white/5 border-white/5 text-white placeholder:text-white/20 rounded-xl min-h-[100px] resize-none focus:ring-1 focus:ring-primary/50 transition-all"
                value={newKeyData.description}
                onChange={(e) => setNewKeyData({...newKeyData, description: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-white/60">有效期</label>
              <div className="flex gap-2">
                {['7', '30', '90', '365'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setNewKeyData({...newKeyData, expiry: d})}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                      newKeyData.expiry === d 
                        ? "bg-white text-black shadow-lg" 
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    )}
                  >
                    {d} 天
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-3">
              <AlertCircle className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-white/80">重要安全提醒</p>
                <p className="text-[12px] leading-relaxed text-white/40">
                  Access Key 相当于你的账号钥匙，对外提供可能导致账号被盗、内容泄露、积分 / 会员权益被冒用，请务必妥善保管，不要将密钥发送给任何人。
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setIsCreateOpen(false)}
              className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl px-6 h-11"
            >
              取消
            </Button>
            <Button 
              onClick={handleCreate}
              className="bg-white text-black hover:bg-white/90 rounded-xl px-8 h-11 font-bold transition-all active:scale-95"
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#0f0f12] border-white/10 p-10 rounded-[32px]">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Access Key 已生成</h2>
            <p className="text-white/40 text-[14px] leading-relaxed mb-8">
              请立即复制并妥善保存，离开后你仍可在列表中继续复制。
            </p>
            
            <div className="w-full p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-2 mb-10 group transition-all duration-300 hover:bg-white/[0.05]">
              <span className="font-mono text-[14px] text-white/90 tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">
                {generatedKey}
              </span>
            </div>

            <div className="flex gap-4 w-full">
              <Button 
                onClick={() => handleCopy(generatedKey)}
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-xl h-12 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                复制连接地址
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsSuccessOpen(false)}
                className="flex-1 text-white/40 hover:text-white hover:bg-white/5 rounded-xl h-12"
              >
                关闭
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
