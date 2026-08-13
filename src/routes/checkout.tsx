import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Plus, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { amount?: number; description?: string };
  const [paymentMethod, setPaymentMethod] = React.useState<"alipay" | "card">("alipay");
  
  const displayAmount = search.amount || 19.00;
  const displayDescription = search.description || "Purchase 2923 credits for video processing services";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Left Side - Order Summary */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 bg-background flex flex-col items-center md:items-end border-b md:border-b-0 md:border-r border-border/40">
        <div className="w-full max-w-md">
          <button 
            onClick={() => window.history.back()}
            className="mb-12 flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="mb-8">
            <div className="mb-4 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Pay MovieFlow</p>
            <h1 className="text-[44px] font-bold tracking-tight mt-1 text-foreground">¥{displayAmount.toFixed(2)}</h1>
          </div>

          <div className="space-y-6 mt-12">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-[15px]">订单详情</p>
                <p className="text-muted-foreground text-[13px] mt-1">{displayDescription}</p>
              </div>
              <span className="font-medium text-[15px]">¥{displayAmount.toFixed(2)}</span>
            </div>

            <div className="h-[1px] bg-border/40 w-full" />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-[15px]">Subtotal</span>
              <span className="font-medium text-[15px]">¥{displayAmount.toFixed(2)}</span>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-[13px] font-semibold text-muted-foreground hover:bg-muted/80 transition-colors w-fit">
              Add promotion code
            </button>

            <div className="h-[1px] bg-border/40 w-full mt-8" />

            <div className="flex justify-between items-center mt-6">
              <span className="text-muted-foreground font-medium text-[15px]">Total due</span>
              <span className="font-bold text-[15px]">¥{displayAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Form */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 bg-background flex flex-col items-center md:items-start">
        <div className="w-full max-w-md space-y-8">
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-muted-foreground">Email</label>
            <div className="w-full rounded-lg border border-border bg-muted/30 p-4 text-[15px] text-foreground">
              dzystyle@163.com
            </div>
          </div>

          {/* Phone number field */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-muted-foreground">Phone number</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="" 
                className="w-full rounded-lg border border-border bg-muted/20 p-4 pr-20 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5">Optional</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <label className="text-[15px] font-bold text-foreground">Payment method</label>
            <div className="rounded-xl border border-border overflow-hidden bg-muted/10">
              <div 
                onClick={() => setPaymentMethod("alipay")}
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-border",
                  paymentMethod === "alipay" ? "bg-primary/10" : "hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    paymentMethod === "alipay" ? "border-primary" : "border-border"
                  )}>
                    {paymentMethod === "alipay" && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="https://img.icons8.com/color/48/alipay.png" className="h-5 w-5" alt="Alipay" />
                    <span className="text-[15px] font-medium">Alipay</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer transition-colors",
                  paymentMethod === "card" ? "bg-primary/10" : "hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    paymentMethod === "card" ? "border-primary" : "border-border"
                  )}>
                    {paymentMethod === "card" && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[15px] font-medium">Card</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3" alt="PayPal" />
                </div>
              </div>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-start gap-3 p-4 border border-border rounded-xl bg-muted/10">
            <div className="mt-1">
              <input type="checkbox" className="h-4 w-4 rounded border-border bg-muted text-primary focus:ring-primary" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground leading-tight">Save my information for faster checkout</p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-normal">
                Pay securely at MovieFlow and everywhere <span className="text-primary font-medium">Link</span> is accepted.
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              // Mock success toast
              import('sonner').then(({ toast }) => {
                toast.success("Payment successful!");
                setTimeout(() => {
                  navigate({ to: "/settings/team" });
                }, 1500);
              });
            }}
            className="w-full rounded-lg bg-primary py-4 text-center text-[15px] font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Pay
          </button>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-medium">
              <span>Powered by</span>
              <span className="text-foreground font-bold tracking-tight">stripe</span>
              <span className="mx-1 text-border">|</span>
              <span className="hover:text-foreground cursor-pointer">Terms</span>
              <span className="hover:text-foreground cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
