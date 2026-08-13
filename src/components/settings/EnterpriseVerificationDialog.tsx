import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface EnterpriseVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnterpriseVerificationDialog({ open, onOpenChange }: EnterpriseVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] overflow-hidden border-none bg-white p-0 text-black sm:rounded-[32px]">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-yellow-50 via-blue-50 to-white opacity-60" />
        
        <div className="relative z-10 px-8 pb-12 pt-14">
          <DialogClose className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10">
            <X className="h-4 w-4 text-black/40" />
          </DialogClose>

          <DialogHeader className="mb-6 space-y-4 text-center">
            <DialogTitle className="text-[28px] font-bold tracking-tight text-black">
              企业认证
            </DialogTitle>
            <div className="space-y-1">
              <p className="text-sm text-black/60">
                使用Seedance 2.0 & 2.5需要完成认证
              </p>
              <button className="text-sm font-medium transition-opacity hover:opacity-80">
                如有疑问请扫码添加Artrail社群 →
              </button>
            </div>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onOpenChange(false); }}>
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  placeholder="企业名称"
                  className="h-[52px] rounded-full border-black/10 bg-white/50 px-6 text-black placeholder:text-black/20 focus-visible:border-black/20 focus-visible:ring-0"
                />
              </div>
              <div className="relative">
                <Input 
                  placeholder="统一社会信用代码"
                  className="h-[52px] rounded-full border-black/10 bg-white/50 px-6 text-black placeholder:text-black/20 focus-visible:border-black/20 focus-visible:ring-0"
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="mt-4 h-[56px] w-full rounded-full bg-black text-lg font-medium text-white transition-opacity hover:bg-black/90 active:scale-[0.98]"
            >
              继续
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
