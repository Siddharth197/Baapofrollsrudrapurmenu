import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MenuItem({ item, cartItems = [], onAddToCart, onIncrement, onDecrement }) {
  const hasVariations = item.variations && item.variations.length > 0;

  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.01 }}
      className="flex flex-col bg-white p-5 mb-4 rounded-2xl premium-shadow border border-brand-slate overflow-hidden relative group"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex justify-between items-start">
        {item.image && (
          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden mr-4 border border-brand-slate/50">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        <div className="flex-1 pr-4 z-10">
          <h3 className="font-bold text-brand-black text-[18px] tracking-tight mb-1 group-hover:text-brand-red transition-colors">{item.name}</h3>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-3 line-clamp-2">{item.description}</p>
          {!hasVariations && (
            <div className="font-black text-brand-black text-lg drop-shadow-sm">₹{item.price}</div>
          )}
        </div>
        
        {/* Render standard Add button if no variations */}
        {!hasVariations && (
          <div className="flex flex-col items-center justify-center min-w-[100px] z-10 pt-1">
            {cartItems.length === 0 || cartItems[0].quantity === 0 ? (
              <button 
                onClick={() => onAddToCart(item)}
                className="w-full bg-brand-light text-brand-red px-5 py-2.5 rounded-xl font-bold border border-brand-red/20 hover:bg-brand-red hover:text-white hover:border-brand-red active:scale-95 transition-all shadow-sm text-sm uppercase tracking-wide"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-brand-light rounded-xl border border-brand-red shadow-sm overflow-hidden h-10">
                <button 
                  onClick={() => onDecrement(cartItems[0].cartId)}
                  className="px-3 py-2 text-brand-red hover:bg-red-50 active:bg-red-100 transition-colors h-full flex items-center justify-center"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="w-8 text-center font-black text-brand-black text-[15px]">{cartItems[0].quantity}</span>
                <button 
                  onClick={() => onIncrement(cartItems[0].cartId)}
                  className="px-3 py-2 text-brand-red hover:bg-red-50 active:bg-red-100 transition-colors h-full flex items-center justify-center"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variations Section */}
      {hasVariations && (
        <div className="mt-4 pt-3 border-t border-brand-slate/60 flex flex-col gap-3">
          {item.variations.map((variant) => {
            const cartItem = cartItems.find(c => c.variantName === variant.name);
            const quantity = cartItem?.quantity || 0;

            return (
              <div key={variant.name} className="flex justify-between items-center ml-1">
                <div>
                  <span className="font-bold text-[14px] text-brand-black">{variant.name}</span>
                  <div className="font-black text-brand-black text-[15px]">₹{variant.price}</div>
                </div>
                
                <div className="flex flex-col items-center justify-center min-w-[90px] z-10">
                  {quantity === 0 ? (
                    <button 
                      onClick={() => onAddToCart(item, variant)}
                      className="w-full bg-white text-brand-red px-4 py-1.5 rounded-lg font-bold border border-brand-red/20 hover:bg-brand-red hover:text-white active:scale-95 transition-all shadow-sm text-xs uppercase tracking-wider"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-brand-light rounded-lg border border-brand-red shadow-sm overflow-hidden h-8">
                      <button 
                        onClick={() => onDecrement(cartItem.cartId)}
                        className="px-2.5 py-1 text-brand-red hover:bg-red-50 active:bg-red-100 transition-colors h-full flex items-center justify-center"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-6 text-center font-black text-brand-black text-[13px]">{quantity}</span>
                      <button 
                        onClick={() => onIncrement(cartItem.cartId)}
                        className="px-2.5 py-1 text-brand-red hover:bg-red-50 active:bg-red-100 transition-colors h-full flex items-center justify-center"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
