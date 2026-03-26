import React, { useState, useMemo } from 'react';
import { ShoppingCart, X, MessageCircle, Info, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import MenuItem from './components/MenuItem';
import menuData from './data/menu.json';

// WhatsApp Business Number Placeholder
const WA_PHONE_NUMBER = "919205159696";
// UPI ID Placeholder
const UPI_ID = "8226924223@ybl";

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartTotalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const deliveryFee = cartTotalAmount > 0 && cartTotalAmount < 500 ? 20 : 0;
  const finalPayable = cartTotalAmount + deliveryFee;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (item, variant = null) => {
    const cartId = variant ? `${item.id}-${variant.name}` : item.id;
    const existingItem = cart.find(c => c.cartId === cartId);

    if (existingItem) {
      incrementQuantity(cartId);
    } else {
      setCart([...cart, {
        ...item,
        cartId,
        variantName: variant?.name || null,
        price: variant?.price || item.price,
        quantity: 1
      }]);
    }
  };

  const incrementQuantity = (cartId) => {
    setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decrementQuantity = (cartId) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(0, item.quantity - 1) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const formatWhatsAppMessage = () => {
    let message = `🍔 New Order from Baap of Rolls!\n`;
    message += `--------------------------\n`;
    message += `Items:\n`;
    cart.forEach(item => {
      const variantText = item.variantName ? ` (${item.variantName})` : '';
      message += `${item.name}${variantText} x ${item.quantity}\n`;
    });
    message += `--------------------------\n`;
    message += `Subtotal: ₹${cartTotalAmount}\n`;
    message += `Delivery: ₹${deliveryFee}\n`;
    message += `Total Payable: ₹${finalPayable}\n`;
    message += `--------------------------\n`;
    message += `Please share your Location/Address below:\n`;

    return encodeURIComponent(message);
  };

  const placeOrder = () => {
    const text = formatWhatsAppMessage();
    window.open(`https://wa.me/${WA_PHONE_NUMBER}?text=${text}`, '_blank');
  };

  const goToUPI = () => {
    window.location.href = `upi://pay?pa=${UPI_ID}&pn=Baap%20of%20Rolls&am=${finalPayable}&cu=INR`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen relative bg-brand-light font-sans text-brand-black pb-4">
      <Header />

      <main className="max-w-md mx-auto p-4 md:p-6 pb-28 pt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuData.categories.map((category) => (
            <motion.div variants={itemVariants} key={category.id} className="mb-10">
              <h2 className="text-2xl font-black mb-5 text-brand-black uppercase tracking-wider flex items-center gap-3">
                <span className="w-2 h-8 bg-brand-red rounded-full"></span>
                {category.name}
              </h2>
              <div className="flex flex-col">
                {category.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    cartItems={cart.filter(c => c.id === item.id)}
                    onAddToCart={addToCart}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Floating Cart Bar (Sticky Bottom) */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 pointer-events-none flex justify-center"
          >
            <div className="w-full max-w-md pointer-events-auto">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-brand-black text-white p-4 px-6 rounded-2xl shadow-[0_20px_40px_-15px_rgba(26,26,29,0.5)] flex justify-between items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="bg-brand-red/20 p-2 rounded-full text-brand-red">
                      <ShoppingCart size={24} />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-black text-[11px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-brand-black">
                      {totalItems}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm text-brand-light/70 uppercase tracking-widest">View Cart</span>
                    <span className="block font-black text-xl">₹{cartTotalAmount}</span>
                  </div>
                </div>
                <div className="bg-brand-red p-2 rounded-full text-white">
                  <ArrowRight size={24} />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal / Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-brand-black/60 backdrop-blur-md pointer-events-auto"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-brand-light rounded-t-[32px] max-h-[85vh] flex flex-col max-w-md w-full mx-auto shadow-2xl relative pointer-events-auto"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-brand-slate rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-brand-slate bg-brand-light/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight">
                  Your Order
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-brand-slate/50 hover:bg-brand-slate text-brand-black rounded-full transition-colors"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-6 py-4 pb-8">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-brand-slate/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-5 text-gray-400">
                      <ShoppingCart size={48} strokeWidth={1.5} />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">Your cart is missing some flavor!</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 text-white bg-brand-red font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-red/20 active:scale-95 transition-all"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {cart.map((item) => (
                        <div key={item.cartId} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-brand-slate/60 shadow-sm">
                          <div className="flex-1 pr-3">
                            <h4 className="font-bold text-[16px] leading-tight text-brand-black mb-0.5">{item.name}</h4>
                            {item.variantName && (
                              <div className="text-[12px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{item.variantName}</div>
                            )}
                            <span className="text-brand-red font-black text-[15px]">₹{item.price}</span>
                          </div>
                          <div className="flex items-center bg-brand-light rounded-xl border border-brand-slate overflow-hidden shrink-0 shadow-sm h-10">
                            <button onClick={() => decrementQuantity(item.cartId)} className="w-9 h-full flex items-center justify-center text-brand-black hover:bg-brand-slate/50 active:bg-brand-slate font-bold transition-colors">
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="w-6 text-center font-black text-brand-black text-[15px]">{item.quantity}</span>
                            <button onClick={() => incrementQuantity(item.cartId)} className="w-9 h-full flex items-center justify-center text-brand-black hover:bg-brand-slate/50 active:bg-brand-slate font-bold transition-colors">
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bill Summary */}
                    <div className="bg-white p-6 rounded-3xl border border-brand-slate/60 shadow-sm mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
                      <h3 className="font-black text-brand-black mb-5 tracking-widest text-xs uppercase text-brand-slate-500">Bill Summary</h3>

                      <div className="flex justify-between text-gray-600 mb-3 font-medium text-[15px]">
                        <span>Subtotal</span>
                        <span className="font-bold text-brand-black">₹{cartTotalAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 mb-4 font-medium text-[15px]">
                        <span className="flex items-center gap-2">
                          Delivery Fee
                          {deliveryFee === 0 ? (
                            <span className="bg-green-100 text-green-700 text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wide">Free</span>
                          ) : (
                            <span className="text-[11px] text-gray-500 bg-brand-slate/50 px-2 py-1 rounded-lg font-semibold">(Under ₹500)</span>
                          )}
                        </span>
                        <span className="font-bold text-brand-black">₹{deliveryFee}</span>
                      </div>

                      {deliveryFee > 0 && (
                        <div className="bg-brand-yellow/10 border border-brand-yellow/30 p-3 rounded-xl mb-5 text-[13px] font-medium flex gap-2.5 text-brand-black">
                          <Info size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                          <p>Add items worth ₹{500 - cartTotalAmount} more to get <span className="font-black text-brand-yellow">FREE Delivery!</span></p>
                        </div>
                      )}

                      <div className="border-t border-brand-slate/60 pt-4 flex justify-between font-black text-2xl text-brand-black mt-2">
                        <span>Grand Total</span>
                        <span className="text-brand-red">₹{finalPayable}</span>
                      </div>
                    </div>

                    {/* Checkout Actions */}
                    <div className="space-y-3 pb-safe">
                      <button
                        onClick={placeOrder}
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-3 transition-transform hover:scale-[1.02] shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)]"
                      >
                        <MessageCircle size={24} fill="currentColor" className="text-white" />
                        <span className="text-[17px] tracking-wide">Order on WhatsApp</span>
                      </button>

                      <button
                        onClick={goToUPI}
                        className="w-full bg-white border-2 border-brand-slate text-brand-black hover:bg-brand-light py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-colors"
                      >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                        <span className="text-[15px]">Pay via UPI (Optional)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
