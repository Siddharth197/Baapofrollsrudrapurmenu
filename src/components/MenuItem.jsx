import React from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Determine food type from tags
function getFoodType(tags = []) {
  if (tags.includes('non-veg')) return 'non-veg';
  if (tags.includes('egg')) return 'egg';
  return 'veg';
}

// Card background & accent based on food type
const foodTypeStyles = {
  veg: {
    cardBg: 'bg-green-50',
    border: 'border-green-200',
    accentBar: 'bg-green-500',
    dotBorder: 'border-green-600',
    dotFill: 'bg-green-600',
    dotShape: 'rounded-full',
    label: 'Veg',
  },
  'non-veg': {
    cardBg: 'bg-red-50',
    border: 'border-red-200',
    accentBar: 'bg-red-500',
    dotBorder: 'border-red-600',
    dotFill: 'bg-red-600',
    dotShape: 'rounded-sm',
    label: 'Non-Veg',
  },
  egg: {
    cardBg: 'bg-amber-50',
    border: 'border-amber-200',
    accentBar: 'bg-amber-500',
    dotBorder: 'border-amber-600',
    dotFill: 'bg-amber-500',
    dotShape: 'rounded-sm',
    label: 'Egg',
  },
};

// Standard Indian food-type dot indicator
function FoodTypeDot({ type }) {
  const s = foodTypeStyles[type];
  return (
    <span
      title={s.label}
      className={`inline-flex items-center justify-center w-4 h-4 border-2 ${s.dotBorder} ${s.dotShape} shrink-0`}
    >
      <span className={`w-2 h-2 ${s.dotFill} ${s.dotShape}`} />
    </span>
  );
}

export default function MenuItem({ item, cartItems = [], onAddToCart, onIncrement, onDecrement, onOpenCustomize }) {
  const hasVariations = item.variations && item.variations.length > 0;
  const foodType = getFoodType(item.tags);
  const style = foodTypeStyles[foodType];

  // Total quantity of this item across all variants
  const totalQty = cartItems.reduce((sum, c) => sum + c.quantity, 0);

  // For non-variation items, get the single cart entry
  const singleCartItem = !hasVariations && cartItems.length > 0 ? cartItems[0] : null;

  const handleAddClick = () => {
    if (hasVariations) {
      onOpenCustomize(item);
    } else {
      onAddToCart(item);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={`flex gap-4 ${style.cardBg} p-4 mb-3 rounded-2xl border ${style.border} shadow-sm overflow-hidden relative group transition-shadow hover:shadow-md`}
    >
      {/* Left accent bar — always visible, food-type color */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accentBar} rounded-l-2xl`} />

      {/* Item Image */}
      {item.image && (
        <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-white/80 bg-white/60 self-center shadow-sm ml-1">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0 ml-1">
        {/* Top: Name + dot indicator + rating */}
        <div>
          <div className="flex items-start gap-2 mb-0.5">
            <FoodTypeDot type={foodType} />
            <h3 className="font-semibold text-brand-black text-[16px] leading-snug flex-1">
              {item.name}
              {item.isSpicy && <span className="ml-1 text-[15px]">🌶️</span>}
            </h3>
          </div>

          {item.rating && (
            <div className="flex items-center gap-1 mb-1.5 ml-6">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[12px] font-semibold text-amber-600">{item.rating}</span>
            </div>
          )}

          {item.description && (
            <p className="text-gray-500 text-[12px] font-normal leading-relaxed line-clamp-2 mb-2 ml-6">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom: Price + Action */}
        <div className="flex items-center justify-between mt-1">
          <div>
            {hasVariations ? (
              <div>
                <span className="text-[11px] text-gray-400 font-normal">Starting at </span>
                <span className="text-brand-black font-black text-[16px]">
                  ₹{item.variations[0].price}
                </span>
              </div>
            ) : (
              <span className="text-brand-black font-black text-[17px]">₹{item.price}</span>
            )}
          </div>

          {/* Add / Quantity control */}
          {hasVariations ? (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleAddClick}
                className="bg-white text-brand-red px-5 py-2 rounded-xl font-bold border border-brand-red/30 hover:bg-brand-red hover:text-white active:scale-95 transition-all shadow-sm text-sm uppercase tracking-wide"
              >
                Add
              </button>
              {totalQty > 0 && (
                <span className="text-[11px] text-brand-red font-semibold">
                  {totalQty} in cart
                </span>
              )}
            </div>
          ) : singleCartItem && singleCartItem.quantity > 0 ? (
            <div className="flex items-center bg-white rounded-xl border border-brand-red/60 shadow-sm overflow-hidden h-9">
              <button
                onClick={() => onDecrement(singleCartItem.cartId)}
                className="w-9 h-full flex items-center justify-center text-brand-red hover:bg-red-50 active:bg-red-100 transition-colors"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <span className="w-7 text-center font-black text-brand-black text-[14px]">
                {singleCartItem.quantity}
              </span>
              <button
                onClick={() => onIncrement(singleCartItem.cartId)}
                className="w-9 h-full flex items-center justify-center text-brand-red hover:bg-red-50 active:bg-red-100 transition-colors"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="bg-white text-brand-red px-5 py-2 rounded-xl font-bold border border-brand-red/30 hover:bg-brand-red hover:text-white active:scale-95 transition-all shadow-sm text-sm uppercase tracking-wide"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
