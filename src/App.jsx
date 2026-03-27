import React, { useState, useMemo } from 'react';
import { ShoppingCart, X, MessageCircle, Info, ArrowRight, Minus, Plus, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import MenuItem from './components/MenuItem';
import menuData from './data/menu.json';

// WhatsApp Business Number Placeholder
const WA_PHONE_NUMBER = "919205159696";
// UPI ID Placeholder
const UPI_ID = "8226924223@ybl";

// Delivery Radius Constants
const REST_LAT = 28.976732;
const REST_LNG = 79.397632;
const MAX_RADIUS_KM = 15;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [houseNo, setHouseNo] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [hasPaid, setHasPaid] = useState(false);

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

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const distance = calculateDistance(userLat, userLng, REST_LAT, REST_LNG);
        
        if (distance > MAX_RADIUS_KM) {
          setLocationError(`Sorry, you are ${distance.toFixed(1)} km away. We only deliver within a ${MAX_RADIUS_KM} km radius.`);
          setIsLocating(false);
          return;
        }

        setGpsLocation({
          lat: userLat,
          lng: userLng
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Could not get exact location. Please type it below.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
    message += `Delivery Details:\n`;
    message += `House/Floor: ${houseNo}\n`;
    message += `Complete Address: ${buildingName}\n`;
    if (gpsLocation) {
      message += `Location Map: https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}\n`;
    }
    message += `--------------------------\n`;
    message += `Payment Status: ✅ PAID VIA UPI (Unverified)\n`;
    message += `Action Required: Please check your UPI history to confirm receipt of ₹${finalPayable} from this customer.\n`;
    
    return encodeURIComponent(message);
  };

  const placeOrder = () => {
    const text = formatWhatsAppMessage();
    window.open(`https://wa.me/${WA_PHONE_NUMBER}?text=${text}`, '_blank');
  };

  const goToUPI = () => {
    window.location.href = `upi://pay?pa=${UPI_ID}&pn=Baap%20of%20Rolls&am=${finalPayable}&cu=INR`;
    // Mark as paid after UPI app is opened
    setTimeout(() => setHasPaid(true), 2000);
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

  const isAddressValid = houseNo.trim() !== "" && buildingName.trim() !== "";

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
              onClick={() => { setIsCartOpen(false); setCheckoutStep(1); setHasPaid(false); }}
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
                  {checkoutStep === 1 ? "Your Order" : "Payment"}
                </h2>
                <button
                  onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }}
                  className="p-2 bg-brand-slate/50 hover:bg-brand-slate text-brand-black rounded-full transition-colors"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-6 py-4 pb-8">
                {checkoutStep === 1 ? (
                  cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-brand-slate/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-5 text-gray-400">
                        <ShoppingCart size={48} strokeWidth={1.5} />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">Your cart is missing some flavor!</p>
                      <button
                        onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }}
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
                      <div className="space-y-4 pb-safe">
                        <div className="bg-white p-4 rounded-2xl border border-brand-slate/60 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow"></div>
                          <h3 className="block text-brand-slate-500 font-bold text-xs uppercase tracking-widest mb-3 ml-1">Delivery Address *</h3>
                          
                          <div className="space-y-3">
                            {gpsLocation ? (
                              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2.5 rounded-xl text-[13px] font-bold flex flex-col gap-1.5 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin size={16} /> Location Captured!
                                </div>
                                <button onClick={() => setGpsLocation(null)} className="text-[11px] text-brand-red font-bold underline self-start hover:text-red-700">
                                  Clear GPS & Use Manual Address Only
                                </button>
                              </div>
                            ) : (
                              <>
                                <button 
                                  onClick={requestLocation}
                                  disabled={isLocating}
                                  className="w-full bg-brand-light border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors duration-300"
                                >
                                  <MapPin size={18} />
                                  {isLocating ? "Fetching Location..." : "Share Current Location"}
                                </button>
                                
                                {locationError && <p className="text-red-500 text-[11px] px-1 font-semibold">{locationError}</p>}
                                
                                <div className="flex items-center gap-2 my-2">
                                  <div className="h-px bg-brand-slate/60 flex-1"></div>
                                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">OR ENTER MANUALLY</span>
                                  <div className="h-px bg-brand-slate/60 flex-1"></div>
                                </div>
                                
                                <p className="text-[11px] text-brand-red font-bold uppercase tracking-widest text-center mt-1 mb-2 bg-red-50 py-1.5 rounded-md border border-red-100">
                                  Note: We only deliver up to 15km
                                </p>
                              </>
                            )}

                            <input
                              type="text"
                              placeholder="House / Flat / Floor No. *"
                              value={houseNo}
                              onChange={(e) => setHouseNo(e.target.value)}
                              className="w-full bg-brand-light border border-brand-slate/80 rounded-xl px-4 py-3 text-[14px] text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium placeholder:text-gray-400"
                            />
                            <input
                              type="text"
                              placeholder="Complete Address / Area / Landmark *"
                              value={buildingName}
                              onChange={(e) => setBuildingName(e.target.value)}
                              className="w-full bg-brand-light border border-brand-slate/80 rounded-xl px-4 py-3 text-[14px] text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => setCheckoutStep(2)}
                          disabled={!isAddressValid}
                          className={`w-full text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-3 transition-all ${
                            isAddressValid
                              ? 'bg-brand-black hover:bg-gray-800 shadow-[0_10px_20px_-10px_rgba(26,26,29,0.5)] hover:scale-[1.02] cursor-pointer' 
                              : 'bg-gray-300 cursor-not-allowed opacity-70'
                          }`}
                        >
                          <CreditCard size={24} fill="currentColor" className="text-white" />
                          <span className="text-[17px] tracking-wide">Proceed to Payment</span>
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  /* Step 2: Payment Screen */
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button onClick={() => { setCheckoutStep(1); setHasPaid(false); }} className="flex items-center text-brand-slate-500 font-bold mb-6 hover:text-brand-black transition-colors w-max">
                      <ArrowLeft size={18} className="mr-1" /> Back to Cart
                    </button>
                    
                    <div className="bg-white p-6 rounded-3xl border border-brand-slate/60 shadow-sm mb-6 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${hasPaid ? 'bg-green-100 text-green-600' : 'bg-brand-yellow/20 text-brand-yellow'}`}>
                        <CreditCard size={32} />
                      </div>
                      <h3 className="font-black text-4xl text-brand-black mb-1">₹{finalPayable}</h3>
                      <p className="text-gray-500 font-medium text-[14px] mb-6">Pay using UPI below, then confirm your order.</p>

                      {/* Step indicator */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`flex items-center gap-2 flex-1 py-2 px-3 rounded-xl text-[12px] font-bold border-2 transition-all ${hasPaid ? 'bg-green-50 border-green-300 text-green-700' : 'bg-brand-yellow/10 border-brand-yellow text-brand-black'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${hasPaid ? 'bg-green-500 text-white' : 'bg-brand-yellow text-brand-black'}`}>1</span>
                          {hasPaid ? '✓ Payment Initiated' : 'Pay First'}
                        </div>
                        <div className="w-4 h-0.5 bg-brand-slate shrink-0"></div>
                        <div className={`flex items-center gap-2 flex-1 py-2 px-3 rounded-xl text-[12px] font-bold border-2 transition-all ${hasPaid ? 'bg-brand-black/5 border-brand-black/20 text-brand-black' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${hasPaid ? 'bg-brand-black text-white' : 'bg-gray-300 text-gray-500'}`}>2</span>
                          Send Order
                        </div>
                      </div>
                      
                      <button 
                        onClick={goToUPI}
                        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center space-x-2 mb-4 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] ${hasPaid ? 'bg-green-50 border-2 border-green-300 text-green-700' : 'bg-brand-light border-2 border-brand-red text-brand-black hover:bg-brand-red hover:text-white'}`}
                      >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-[22px]" />
                        <span className="text-[16px] tracking-wide ml-1">{hasPaid ? '✓ Payment Opened' : 'Pay via UPI App'}</span>
                      </button>

                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">OR COPY UPI ID</div>
                      <div 
                        className="bg-brand-slate/30 p-3.5 rounded-xl font-mono text-brand-black font-bold flex justify-between items-center gap-2 text-[15px] cursor-pointer hover:bg-brand-slate/50 active:scale-[0.98] transition-all"
                        onClick={() => { navigator.clipboard?.writeText(UPI_ID); setHasPaid(true); }}
                        title="Tap to copy"
                      >
                        <span>{UPI_ID}</span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Copy</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-2 space-y-3">
                      {!hasPaid && (
                        <p className="text-center text-[13px] text-brand-red font-bold px-4 bg-red-50 py-3 rounded-xl border border-red-100">
                          ⚠ Please complete your UPI payment first before sending the order.
                        </p>
                      )}
                      {hasPaid && (
                        <p className="text-center text-[13px] text-green-700 font-bold px-4 bg-green-50 py-3 rounded-xl border border-green-200">
                          ✅ Payment initiated! Now send your order details.
                        </p>
                      )}
                      <button 
                        onClick={placeOrder}
                        disabled={!hasPaid}
                        className={`w-full text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-3 transition-all ${
                          hasPaid
                            ? 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] cursor-pointer'
                            : 'bg-gray-300 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <MessageCircle size={26} fill="currentColor" className="text-white" />
                        <span className="text-[18px] tracking-wide">I Have Paid - Send Order</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
