import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Lock, CreditCard, User, Truck, Check, AlertCircle } from "lucide-react";
import DocumentHead from "../components/DocumentHead";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<{ id: number; name: string; price: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  useEffect(() => {
    // In a real app, this would fetch from global state or local storage
    // For now, we'll try to get it from localStorage if we implemented it, or just show empty
    const storedCart = localStorage.getItem("lizzdo_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      // Mock some items if empty for demonstration
      setCart([
        { id: 1, name: "Cyberpunk City Kit", price: 149 },
        { id: 2, name: "Neon Weapons Pack", price: 89 }
      ]);
    }
  }, []);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  const tax = cartTotal * 0.08; // 8% tax
  const finalTotal = cartTotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsProcessing(true);

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.cardNumber) {
      setErrorMsg("Please fill in all required fields.");
      setIsProcessing(false);
      return;
    }

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      localStorage.removeItem("lizzdo_cart");
      setCart([]);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col text-white bg-black min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
        <DocumentHead title="Order Confirmed | LIZZDO" description="Your order has been successfully placed." />
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none z-0"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

        <div className="container mx-auto max-w-2xl relative z-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-8 shadow-[0_0_40px_rgba(0,245,255,0.3)] animate-pulse">
            <Check className="w-12 h-12" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black mb-4 uppercase tracking-[2px]">Deployment Successful</h1>
          <p className="font-future text-gray-400 mb-12">Thank you for your purchase. Your digital assets are ready for download.</p>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 text-left mb-8">
            <h3 className="font-display font-bold text-lg mb-4 pb-4 border-b border-white/10">Order Details</h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Order Number:</span>
                <span className="text-white">#LZZ-84920</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Date:</span>
                <span className="text-white">August 1, 2026</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Total:</span>
                <span className="text-neon-cyan font-bold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Link to="/store" className="button-glow inline-block py-4 px-10 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase tracking-[2px] hover:scale-105 transition-transform">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white bg-black min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <DocumentHead title="Checkout | LIZZDO" description="Complete your secure purchase." />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none z-0"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="mb-12">
          <Link to="/store" className="text-neon-cyan font-mono text-xs uppercase tracking-[2px] hover:text-white transition-colors">&larr; Back to Store</Link>
          <h1 className="font-display text-4xl md:text-5xl font-black mt-6 uppercase">Secure Checkout</h1>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl flex items-center gap-3 text-neon-pink font-mono text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            {/* Customer Details */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase tracking-[1px] mb-6 flex items-center gap-3 pb-4 border-b border-white/10">
                <User className="w-5 h-5 text-neon-cyan" /> Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-cyan focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-cyan focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-cyan focus:outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase tracking-[1px] mb-6 flex items-center gap-3 pb-4 border-b border-white/10">
                <Truck className="w-5 h-5 text-neon-purple" /> Billing Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-purple focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-purple focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Postal / Zip Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-purple focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Country</label>
                  <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-future text-sm text-white focus:border-neon-purple focus:outline-none transition-colors appearance-none">
                    <option value="">Select Country...</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-display text-xl font-bold uppercase tracking-[1px] mb-6 flex items-center gap-3 pb-4 border-b border-white/10">
                <CreditCard className="w-5 h-5 text-neon-pink" /> Payment Method
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Card Number *</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:border-neon-pink focus:outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">Expiry Date *</label>
                      <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:border-neon-pink focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-gray-400 uppercase tracking-[1px]">CVC *</label>
                      <input type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} placeholder="123" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:border-neon-pink focus:outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 shadow-2xl sticky top-32">
              <h3 className="font-display text-2xl font-black uppercase mb-8 pb-4 border-b border-white/10">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.length > 0 ? cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div>
                      <h4 className="font-display font-bold text-sm">{item.name}</h4>
                      <p className="font-mono text-[10px] text-gray-500 uppercase">Qty: 1</p>
                    </div>
                    <div className="font-mono font-bold text-neon-cyan">${item.price.toFixed(2)}</div>
                  </div>
                )) : (
                  <p className="text-gray-500 font-future text-sm text-center">Your cart is empty.</p>
                )}
              </div>

              <div className="space-y-4 font-mono text-sm text-gray-400 mb-8 pt-4 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10 text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-neon-cyan">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing || cart.length === 0}
                className="w-full button-glow py-5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-cyan text-black font-display font-black uppercase tracking-[3px] shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:shadow-[0_0_40px_rgba(255,0,127,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
              
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <input type="text" placeholder="Promo / Coupon Code" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:border-neon-cyan focus:outline-none transition-colors" />
                  <button type="button" className="px-6 py-3 rounded-xl border border-neon-cyan text-neon-cyan font-display uppercase text-xs tracking-widest hover:bg-neon-cyan hover:text-black transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-[10px] font-mono text-gray-500 flex items-center justify-center gap-2 uppercase tracking-[1px]">
                <Lock className="w-3 h-3 text-neon-green" /> 256-Bit Encrypted Connection
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
