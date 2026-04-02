import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADD_ONS = [
  { id: 'meal', label: 'Make it a Meal', sublabel: '(Fries + Drink)', price: 99 },
  { id: 'butter', label: 'Amul Butter', sublabel: '', price: 10 },
  { id: 'egg', label: 'Extra Egg', sublabel: '', price: 20 },
  { id: 'paratha', label: 'Wheat Paratha', sublabel: '(instead of maida)', price: 29 },
  { id: 'fries', label: 'Choice of Fries', sublabel: '', price: 49 },
  { id: 'momos', label: 'Choice of Momos', sublabel: '(3 pcs)', price: 49 },
];

export default function CustomizationModal({ item, onClose, onAddToCart }) {
  const hasVariations = item.variations && item.variations.length > 0;

  // Default to first variant if variations exist, else null
  const [selectedVariant, setSelectedVariant] = useState(
    hasVariations ? item.variations[0] : null
  );
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const basePrice = selectedVariant ? selectedVariant.price : item.price;
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const a = ADD_ONS.find(a => a.id === id);
    return sum + (a ? a.price : 0);
  }, 0);
  const totalPrice = (basePrice + addOnsTotal) * quantity;

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    // Build a composite "variant" object that captures the size + add-ons
    const addOnLabels = selectedAddOns.map(id => ADD_ONS.find(a => a.id === id)?.label).join(', ');
    const variantObj = selectedVariant
      ? {
          name: selectedVariant.name + (addOnLabels ? ` + ${addOnLabels}` : ''),
          price: basePrice + addOnsTotal,
        }
      : addOnLabels
      ? { name: addOnLabels, price: addOnsTotal }
      : null;

    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, variantObj);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative bg-brand-light rounded-t-[28px] max-h-[90vh] flex flex-col max-w-md w-full mx-auto shadow-2xl pointer-events-auto overflow-hidden"
        >
          {/* Drag handle */}
          <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-brand-slate rounded-full" />
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-5 pb-4">
            {/* Item Hero */}
            <div className="flex gap-4 items-start mb-5 pt-2">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-brand-slate/60 shrink-0"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold text-brand-black leading-tight">
                    {item.name}
                    {item.isSpicy && <span className="ml-1">🌶️</span>}
                  </h2>
                  <button
                    onClick={onClose}
                    className="shrink-0 p-1.5 bg-brand-slate/50 hover:bg-brand-slate rounded-full text-brand-black transition-colors mt-0.5"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>
                {item.description && (
                  <p className="text-gray-500 text-[13px] font-normal leading-relaxed mt-1">
                    {item.description}
                  </p>
                )}
                {item.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[13px] font-semibold text-amber-500">⭐ {item.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection (only for variation items) */}
            {hasVariations && (
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Choose Size
                </p>
                <div className="flex flex-col gap-2">
                  {item.variations.map((v) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <button
                        key={v.name}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-brand-red bg-red-50'
                            : 'border-brand-slate bg-white hover:border-brand-red/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-brand-red' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-brand-red" />
                            )}
                          </div>
                          <span className={`text-[15px] font-medium ${isSelected ? 'text-brand-red font-semibold' : 'text-brand-black'}`}>
                            {v.name}
                          </span>
                        </div>
                        <span className={`text-[15px] font-bold ${isSelected ? 'text-brand-red' : 'text-brand-black'}`}>
                          ₹{v.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-Ons */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Customise Your Order
              </p>
              <div className="flex flex-col gap-2">
                {ADD_ONS.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-brand-yellow bg-amber-50'
                          : 'border-brand-slate bg-white hover:border-brand-yellow/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'border-brand-yellow bg-brand-yellow' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <span className={`text-[14px] font-medium ${isSelected ? 'text-brand-black font-semibold' : 'text-brand-black'}`}>
                            {addon.label}
                          </span>
                          {addon.sublabel && (
                            <span className="text-[11px] text-gray-400 ml-1.5">{addon.sublabel}</span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[14px] font-bold shrink-0 ${isSelected ? 'text-brand-yellow' : 'text-gray-500'}`}>
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 bg-brand-light border-t border-brand-slate/50 px-5 py-4">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center bg-white rounded-xl border border-brand-slate overflow-hidden shadow-sm h-12">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-brand-black hover:bg-brand-slate/50 active:bg-brand-slate transition-colors"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="w-8 text-center font-bold text-brand-black text-[15px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-brand-black hover:bg-brand-slate/50 active:bg-brand-slate transition-colors"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-brand-red text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-between hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-brand-red/20"
              >
                <span className="text-[15px]">Add to Cart</span>
                <span className="text-[15px] font-black">₹{totalPrice}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
