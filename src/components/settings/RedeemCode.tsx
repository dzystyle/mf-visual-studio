import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function RedeemCode() {
  const [code, setCode] = useState('');

  const handleRedeem = () => {
    if (!code.trim()) {
      toast.error('请输入兑换码');
      return;
    }
    // Simulate redemption
    toast.success('兑换成功！额度已存入您的预算');
    setCode('');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-12 pb-20">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">兑换码</h2>
        <p className="text-sm text-white/40">输入兑换码，额度将存入你的预算</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入兑换码"
            className="h-12 w-full rounded-xl border-white/5 bg-white/5 px-4 text-white placeholder:text-white/20 focus-visible:ring-white/10"
          />
        </div>
        <Button 
          onClick={handleRedeem}
          className="h-12 rounded-xl bg-[#e4e4e7] px-8 font-medium text-black hover:bg-[#d4d4d8] active:scale-95 transition-all"
        >
          兑换
        </Button>
      </div>
    </div>
  );
}
