import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Plus, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = React.useState<"alipay" | "card">("alipay");

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col md:flex-row font-sans">
      {/* Left Side - Order Summary */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 bg-white flex flex-col items-center md:items-end border-b md:border-b-0 md:border-r border-gray-100">
        <div className="w-full max-w-md">
          <button 
            onClick={() => window.history.back()}
            className="mb-12 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>

          <div className="mb-8">
            <div className="mb-4 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Pay MovieFlow</p>
            <h1 className="text-[44px] font-bold tracking-tight mt-1">$19.00</h1>
          </div>

          <div className="space-y-6 mt-12">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-[15px]">2923 Credits</p>
                <p className="text-gray-400 text-[13px] mt-1">Purchase 2923 credits for video processing services</p>
              </div>
              <span className="font-medium text-[15px]">$19.00</span>
            </div>

            <div className="h-[1px] bg-gray-100 w-full" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-[15px]">Subtotal</span>
              <span className="font-medium text-[15px]">$19.00</span>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-[13px] font-semibold text-gray-600 hover:bg-gray-200 transition-colors w-fit">
              Add promotion code
            </button>

            <div className="h-[1px] bg-gray-100 w-full mt-8" />

            <div className="flex justify-between items-center mt-6">
              <span className="text-gray-500 font-medium text-[15px]">Total due</span>
              <span className="font-bold text-[15px]">$19.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Form */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 bg-white flex flex-col items-center md:items-start">
        <div className="w-full max-w-md space-y-8">
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-500">Email</label>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-[15px] text-gray-900">
              dzystyle@163.com
            </div>
          </div>

          {/* Phone number field */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-gray-500">Phone number</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="" 
                className="w-full rounded-lg border border-gray-200 p-4 pr-20 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">Optional</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <label className="text-[15px] font-bold text-gray-900">Payment method</label>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div 
                onClick={() => setPaymentMethod("alipay")}
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer transition-colors border-b border-gray-200",
                  paymentMethod === "alipay" ? "bg-blue-50/50" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    paymentMethod === "alipay" ? "border-blue-500" : "border-gray-300"
                  )}>
                    {paymentMethod === "alipay" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
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
                  paymentMethod === "card" ? "bg-blue-50/50" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    paymentMethod === "card" ? "border-blue-500" : "border-gray-300"
                  )}>
                    {paymentMethod === "card" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
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
          <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
            <div className="mt-1">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-900 leading-tight">Save my information for faster checkout</p>
              <p className="text-[12px] text-gray-400 mt-1 leading-normal">
                Pay securely at MovieFlow and everywhere <span className="text-blue-500 font-medium">Link</span> is accepted.
              </p>
            </div>
          </div>

          <button className="w-full rounded-lg bg-[#0070E0] py-4 text-center text-[15px] font-bold text-white shadow-lg transition-all hover:bg-[#0060C0] active:scale-[0.98]">
            Pay
          </button>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-gray-400 font-medium">
              <span>Powered by</span>
              <span className="text-gray-500 font-bold tracking-tight">stripe</span>
              <span className="mx-1 text-gray-200">|</span>
              <span className="hover:text-gray-600 cursor-pointer">Terms</span>
              <span className="hover:text-gray-600 cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
