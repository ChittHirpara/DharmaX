import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../lib/CartContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  const tax = cartTotal * 0.08; // 8% mock tax
  const shipping = cartTotal > 100 ? 0 : 15; // Free shipping over $100
  const finalTotal = cartTotal + tax + (cartTotal > 0 ? shipping : 0);

  return (
    <div className="bg-dharma-ink min-h-screen text-dharma-ivory font-sans flex flex-col justify-between">
      <Navbar />
      <div className="pt-32 pb-24 min-h-screen bg-dharma-ink relative flex-grow">
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
                    Looks like you haven't added anything to your cart yet. Discover resources to aid your spiritual journey.
                  </p>
                  <Link to="/">
                    <button className="px-8 py-3 bg-dharma-ivory text-dharma-ink rounded-full font-medium hover:bg-dharma-flame hover:text-white transition-all shadow-md">
                      Explore Shop
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
                          className="p-2 text-dharma-ivory-dim hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
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
                            className="p-1.5 text-dharma-ivory-dim hover:text-dharma-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-dharma-ink-3"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-dharma-ivory">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-dharma-ivory-dim hover:text-dharma-ivory transition-colors rounded-full hover:bg-dharma-ink-3"
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

          {/* Order Summary & Checkout */}
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
                disabled={items.length === 0}
                className="w-full py-4 px-6 bg-dharma-ivory text-dharma-ink rounded-xl font-medium flex items-center justify-between group hover:bg-dharma-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <span className="text-lg">Secure Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-4 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-4 object-contain" />
              </div>
            </motion.div>
          </div>
        </div>

      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-dharma-flame/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-dharma-gold/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
      <Footer />
    </div>
  );
}
