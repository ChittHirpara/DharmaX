import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { useCart } from "../../lib/CartContext";

const products = [
  {
    id: 1,
    title: "The Gita: Modern Translation",
    type: "Book",
    price: "$24",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    desc: "A beautifully bound, easy-to-read translation of the Bhagavad Gita designed for the modern reader.",
    longDesc: "This exclusive edition features modern typography, simplified annotations, and a premium hardcover designed to last a lifetime. Ideal for both beginners and experienced practitioners."
  },
  {
    id: 2,
    title: "Noerax Meditation Cushion",
    type: "Resource",
    price: "$85",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    desc: "Ethically sourced buckwheat hull cushion, providing perfect posture support for deep meditation.",
    longDesc: "Filled with 100% organic buckwheat hulls that contour to your body. The washable linen cover is dyed with natural plant extracts. Elevates your hips to reduce strain on knees and lower back."
  },
  {
    id: 3,
    title: "Sandalwood & Lotus Incense",
    type: "Resource",
    price: "$18",
    image: "https://images.unsplash.com/photo-1608688463864-4284cf759265?q=80&w=800&auto=format&fit=crop",
    desc: "Hand-rolled incense sticks imported from Mysore. Grounding aromas to anchor your daily practice.",
    longDesc: "Each stick burns for approximately 45 minutes, creating a subtle, non-overpowering scent profile. Hand-rolled by artisans in Mysore using sustainable sandalwood and lotus extracts."
  },
  {
    id: 4,
    title: "Daily Stoic & Noerax Journal",
    type: "Book",
    price: "$28",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
    desc: "A 90-day guided journal blending Eastern spirituality with Western stoicism.",
    longDesc: "Features daily prompts, morning intentions, and evening reflections. Printed on thick, bleed-resistant recycled paper with a lay-flat binding."
  }
];

const categories = ["All", "Book", "Resource"];

export function Shop() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const filteredProducts = products.filter(p => filter === "All" || p.type === filter);

  return (
    <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }} id="shop" className="py-32 bg-dharma-ink relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-dharma-ivory mb-4">Curated Resources</h2>
            <p className="text-dharma-ivory-dim text-lg">
              Physical anchors for your digital practice. Carefully selected books, cushions, and tools to deepen your journey.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-2"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat
                    ? "bg-dharma-ivory text-dharma-ink"
                    : "bg-dharma-ink-2 text-dharma-ivory-dim hover:bg-dharma-ink-3 hover:text-dharma-ivory border border-dharma-line-dark"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer flex flex-col h-full"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6 bg-dharma-ink-2 border border-dharma-line-dark">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-dharma-ivory border border-dharma-line-dark uppercase tracking-wider">
                      {product.type}
                    </span>
                  </div>
                  
                  {/* Hover Add to Cart Button overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full py-3 bg-dharma-ivory text-dharma-ink rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-dharma-gold transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-serif text-dharma-ivory group-hover:text-dharma-flame transition-colors">
                        {product.title}
                      </h3>
                      <span className="text-lg font-medium text-dharma-ivory">{product.price}</span>
                    </div>
                    <p className="text-sm text-dharma-ivory-dim line-clamp-2">
                      {product.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 w-full md:hidden inline-flex items-center justify-center gap-2 text-dharma-ivory/80 hover:text-dharma-ivory transition-colors py-4 border border-dharma-line-dark rounded-xl"
        >
          View all collection <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dharma-ink-2 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-dharma-line-dark flex flex-col md:flex-row relative"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-dharma-ivory border border-dharma-line-dark uppercase tracking-wider">
                    {selectedProduct.type}
                  </span>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h3 className="font-serif text-3xl md:text-4xl text-dharma-ivory mb-2">{selectedProduct.title}</h3>
                <p className="text-2xl font-medium text-dharma-flame mb-6">{selectedProduct.price}</p>
                <p className="text-dharma-ivory-dim leading-relaxed mb-8">
                  {selectedProduct.longDesc || selectedProduct.desc}
                </p>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-4 bg-dharma-ivory text-dharma-ink rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-dharma-gold transition-colors text-lg"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}




