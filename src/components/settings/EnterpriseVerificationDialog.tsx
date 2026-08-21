import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface EnterpriseVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EnterpriseVerificationDialog({ open, onOpenChange, onSuccess }: EnterpriseVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] overflow-hidden border-none bg-zinc-900 p-0 text-white sm:rounded-[32px]">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 opacity-60" />
        
        <div className="relative z-10 px-8 pb-12 pt-14">
          <DialogClose className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10">
            <X className="h-4 w-4 text-white/40" />
          </DialogClose>

          <DialogHeader className="mb-6 space-y-4 text-center">
            <DialogTitle className="text-[28px] font-bold tracking-tight text-white">
              企业认证
            </DialogTitle>
            <div className="space-y-1">
              <p className="text-sm text-white/60">
                使用Seedance 2.0 & 2.5需要完成认证
              </p>
              <button className="text-sm font-medium text-white/80 transition-opacity hover:opacity-100">
                如有疑问请扫码添加ArTrail社群 →
              </button>
            </div>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => { 
            e.preventDefault(); 
            localStorage.setItem('enterprise_verified', 'true');
            onSuccess?.();
            onOpenChange(false); 
          }}>
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  placeholder="企业名称"
                  className="h-[52px] rounded-full border-white/10 bg-white/5 px-6 text-white placeholder:text-white/20 focus-visible:border-white/20 focus-visible:ring-0"
                />
              </div>
              <div className="relative">
                <Input 
                  placeholder="统一社会信用代码"
                  className="h-[52px] rounded-full border-white/10 bg-white/5 px-6 text-white placeholder:text-white/20 focus-visible:border-white/20 focus-visible:ring-0"
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="mt-4 h-[56px] w-full rounded-full bg-white text-lg font-medium text-black transition-opacity hover:bg-white/90 active:scale-[0.98]"
            >
              继续
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
