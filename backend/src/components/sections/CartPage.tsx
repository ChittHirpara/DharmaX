import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment' | 'success'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Address Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('upi');

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 100 ? 0 : 15;
  const finalTotal = cartTotal + tax + (cartTotal > 0 ? shipping : 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    const newOrderId = `NOERAX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setCheckoutStep('success');
    // Clear items after order success
    items.forEach((item) => removeFromCart(item.id));
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dharma-ink relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        <Link to="/" className="inline-flex items-center gap-2 text-dharma-ivory-dim hover:text-dharma-ivory transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-12">
          <ShoppingBag className="w-8 h-8 text-dharma-flame" />
          <h1 className="font-serif text-4xl md:text-5xl text-dharma-ivory">Your Cart</h1>
          <span className="ml-4 px-3 py-1 bg-dharma-ink-2 border border-dharma-line-dark rounded-full text-sm font-medium text-dharma-ivory-dim">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dharma-ink-2 border border-dharma-line-dark border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center"
                >
                  <ShoppingBag className="w-16 h-16 text-dharma-ivory-dim/30 mb-6" />
                  <h3 className="font-serif text-2xl text-dharma-ivory mb-3">Your cart is empty</h3>
                  <p className="text-dharma-ivory-dim mb-8 max-w-sm">
                    Discover physical tools and guides to anchor your daily practice.
                  </p>
                  <Link to="/">
                    <button className="px-8 py-3 bg-dharma-flame text-white rounded-full font-medium hover:bg-dharma-saffron transition-all shadow-lg shadow-dharma-flame/20 cursor-pointer">
                      Explore Resources
                    </button>
                  </Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    className="flex flex-col sm:flex-row gap-6 items-center p-6 bg-dharma-ink-2 border border-dharma-line-dark rounded-2xl group hover:border-dharma-flame/30 transition-colors"
                  >
                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-black/20">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between h-full w-full">
                      <div className="flex justify-between items-start mb-4 sm:mb-0 gap-4">
                        <div>
                          <h3 className="font-serif text-xl text-dharma-ivory mb-1">{item.title}</h3>
                          <p className="text-dharma-flame font-medium">{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-dharma-ivory-dim hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center bg-dharma-ink border border-dharma-line-dark rounded-full p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 text-dharma-ivory-dim hover:text-dharma-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-dharma-ink-3 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-dharma-ivory">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-dharma-ivory-dim hover:text-dharma-ivory transition-colors rounded-full hover:bg-dharma-ink-3 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-dharma-ivory-dim">
                          Subtotal: <span className="text-dharma-ivory font-medium">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary & Checkout Button */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-32 p-8 bg-dharma-ink-2/80 backdrop-blur-xl border border-dharma-line-dark rounded-3xl shadow-2xl"
            >
              <h2 className="font-serif text-2xl text-dharma-ivory mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-dharma-ivory-dim">
                  <span>Subtotal</span>
                  <span className="text-dharma-ivory">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-dharma-ivory-dim">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-dharma-ivory">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-dharma-ivory-dim">
                  <span>Shipping</span>
                  <span className="text-dharma-ivory">
                    {cartTotal === 0 ? '$0.00' : shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {cartTotal > 0 && cartTotal < 100 && (
                  <p className="text-xs text-dharma-flame/80 italic mt-1">
                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
              
              <div className="pt-6 border-t border-dharma-line-dark mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-dharma-ivory">Total</span>
                  <span className="font-serif text-3xl text-dharma-flame">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setCheckoutStep('address');
                  setIsCheckoutOpen(true);
                }}
                disabled={items.length === 0}
                className="w-full py-4 px-6 bg-dharma-flame text-white rounded-xl font-medium flex items-center justify-between group hover:bg-dharma-saffron disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-dharma-flame/30 cursor-pointer"
              >
                <span className="text-lg font-semibold">Secure Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-dharma-ivory-dim/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Interactive Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setIsCheckoutOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dharma-ink w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-dharma-line-dark relative my-8"
            >
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-5 right-5 p-2 text-dharma-ivory-dim hover:text-dharma-ivory hover:bg-dharma-ivory/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {checkoutStep !== 'success' && (
                <div className="mb-6">
                  <span className="text-xs text-dharma-flame font-semibold uppercase tracking-wider">Step {checkoutStep === 'address' ? '1 of 2' : '2 of 2'}</span>
                  <h2 className="text-3xl font-serif text-dharma-ivory mt-1">
                    {checkoutStep === 'address' ? 'Delivery Address' : 'Payment Method'}
                  </h2>
                </div>
              )}

              {checkoutStep === 'address' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCheckoutStep('payment');
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs text-dharma-ivory-dim mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-dharma-ink-2 border border-dharma-line-dark rounded-xl px-4 py-3 text-sm text-dharma-ivory focus:outline-none focus:border-dharma-flame"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dharma-ivory-dim mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Harmony Way"
                      className="w-full bg-dharma-ink-2 border border-dharma-line-dark rounded-xl px-4 py-3 text-sm text-dharma-ivory focus:outline-none focus:border-dharma-flame"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-dharma-ivory-dim mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai / NY"
                        className="w-full bg-dharma-ink-2 border border-dharma-line-dark rounded-xl px-4 py-3 text-sm text-dharma-ivory focus:outline-none focus:border-dharma-flame"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-dharma-ivory-dim mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="400001"
                        className="w-full bg-dharma-ink-2 border border-dharma-line-dark rounded-xl px-4 py-3 text-sm text-dharma-ivory focus:outline-none focus:border-dharma-flame"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-dharma-flame text-white font-semibold rounded-xl mt-4 hover:bg-dharma-saffron transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-dharma-flame/30"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {checkoutStep === 'payment' && (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border text-center font-medium text-xs flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-dharma-flame bg-dharma-flame/10 text-dharma-flame'
                          : 'border-dharma-line-dark bg-dharma-ink-2 text-dharma-ivory-dim'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border text-center font-medium text-xs flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-dharma-flame bg-dharma-flame/10 text-dharma-flame'
                          : 'border-dharma-line-dark bg-dharma-ink-2 text-dharma-ivory-dim'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-xl border text-center font-medium text-xs flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-dharma-flame bg-dharma-flame/10 text-dharma-flame'
                          : 'border-dharma-line-dark bg-dharma-ink-2 text-dharma-ivory-dim'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                      COD
                    </button>
                  </div>

                  <div className="bg-dharma-ink-2 p-4 rounded-xl border border-dharma-line-dark space-y-2 text-sm text-dharma-ivory-dim">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="text-dharma-ivory font-bold">${finalTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Deliver to:</span>
                      <span className="text-dharma-ivory">{fullName}, {city}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('address')}
                      className="w-1/3 py-3 border border-dharma-line-dark text-dharma-ivory-dim rounded-xl hover:text-dharma-ivory"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-2/3 py-4 bg-dharma-flame text-white font-semibold rounded-xl hover:bg-dharma-saffron transition-colors flex items-center justify-center gap-2 shadow-lg shadow-dharma-flame/30 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing Order...' : `Pay $${finalTotal.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-serif text-dharma-ivory mb-2">Order Confirmed!</h2>
                  <p className="text-sm text-dharma-ivory-dim mb-4">
                    Thank you, <span className="text-dharma-ivory font-medium">{fullName}</span>! Your spiritual resources are on their way.
                  </p>

                  <div className="bg-dharma-ink-2 p-4 rounded-xl border border-dharma-line-dark mb-6 text-left space-y-2 text-xs text-dharma-ivory-dim">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="text-dharma-flame font-mono font-bold">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span className="text-dharma-ivory font-medium">3-5 Business Days</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-3 bg-dharma-flame text-white rounded-xl font-semibold hover:bg-dharma-saffron transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
