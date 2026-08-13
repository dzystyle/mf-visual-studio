import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EnterpriseVerificationDialog } from './EnterpriseVerificationDialog';

export function ProfileSettings() {
  const [showEnterpriseVerify, setShowEnterpriseVerify] = useState(false);
  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <div className="flex flex-col items-center">
        <div className="group relative">
          <Avatar className="h-28 w-28 border-2 border-white/10 bg-white/5">
            <AvatarFallback className="text-2xl text-white/20">U</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-lg transition-transform hover:scale-110">
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">用户名</label>
          <Input 
            placeholder="输入用户名" 
            className="h-12 border-white/5 bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-primary/50"
          />
          <p className="text-xs text-white/20">长度1-40个字符，支持字母、数字、"-"、"_"。</p>
        </div>

        <div className="space-y-2 border-t border-white/5 pt-8">
          <label className="text-sm font-medium text-white/60">邮箱</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">yangdu776@gmail.com</span>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-8">
          <label className="text-sm font-medium text-white/60">绑定手机:</label>
          <div className="flex gap-2">
            <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-sm text-white/40">
              +86
            </div>
            <Input 
              placeholder="请输入手机号" 
              className="h-12 flex-1 border-white/5 bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-primary/50"
            />
          </div>
          
          {/* Verification Slider Mockup */}
          <div className="relative flex h-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-white text-black">
               <span className="text-xs font-bold">&raquo;</span>
             </div>
             <span className="text-[10px] text-white/20">按住滑块，拖动到最右边</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-8">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">企业认证</div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-white/10 bg-white/5 text-xs text-white hover:bg-white/10"
            onClick={() => setShowEnterpriseVerify(true)}
          >
            去认证
          </Button>
        </div>
      </div>

      <EnterpriseVerificationDialog 
        open={showEnterpriseVerify} 
        onOpenChange={setShowEnterpriseVerify} 
      />
    </div>
  );
}
