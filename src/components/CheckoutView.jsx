import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, FileText, MapPin, Clock, Truck, CreditCard, ChevronRight, Calendar, Copy, Gift, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CheckoutView = ({ onBack }) => {
    const { cart, updateQty, removeFromCart, getSubtotal } = useCart();
    const [tab, setTab] = useState('order');

    const subtotal = getSubtotal();
    const deliveryFee = 500;
    const serviceFee = 1200;
    const total = subtotal + deliveryFee + serviceFee;

    return (
        <div style={{ paddingBottom: 180, minHeight: '100vh', background: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 16px' }}>
                <button onClick={onBack} style={{ padding: 4 }}><ArrowLeft size={24} color="#111" /></button>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: '#111' }}>Checkout</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', padding: '0 16px', marginBottom: 4 }}>
                <button onClick={() => setTab('order')} style={{ flex: 1, paddingBottom: 12, fontWeight: 500, fontSize: 14, color: tab === 'order' ? '#111' : '#9CA3AF', borderBottom: 'none', position: 'relative' }}>
                    Your Order
                </button>
                <button onClick={() => setTab('delivery')} style={{ flex: 1, paddingBottom: 12, fontWeight: 500, fontSize: 14, color: tab === 'delivery' ? '#111' : '#9CA3AF', borderBottom: 'none', position: 'relative' }}>
                    Delivery & Payment
                </button>
            </div>
            {/* Tab Indicators */}
            <div style={{ display: 'flex', padding: '0 16px', marginBottom: 20 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: tab === 'order' ? '#0C513F' : '#E5E7EB' }}></div>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: tab === 'delivery' ? '#0C513F' : '#E5E7EB', marginLeft: 4 }}></div>
            </div>

            {/* Content */}
            <div style={{ padding: '0 16px' }}>
                {tab === 'order' ? (
                    <OrderTab cart={cart} updateQty={updateQty} />
                ) : (
                    <DeliveryTab cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} total={total} />
                )}
            </div>

            {/* Footer Action */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'white', padding: '16px', paddingBottom: 28, borderTop: '1px solid #E5E7EB' }}>
                <p style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', marginBottom: 12 }}>
                    By proceeding, you agree to our <a href="#" style={{ color: '#0C513F' }}>Terms of Use</a> and <a href="#" style={{ color: '#0C513F' }}>Privacy Policy</a>
                </p>
                <button style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'block', background: '#0C513F', color: 'white', padding: '16px 20px', borderRadius: 12, fontWeight: 700, fontSize: 16 }}>
                    Make Payment
                </button>
            </div>
        </div>
    );
};

const OrderTab = ({ cart, updateQty }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Edit Selections Button - Gray Background */}
        <button style={{ width: '100%', background: '#F3F4F6', color: '#374151', padding: '14px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none' }}>
            Edit Selections <ChevronRight size={18} />
        </button>

        {/* Cart Items */}
        {cart.map(item => (
            <div key={item.id} style={{ paddingBottom: 20, borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Pack {item.id % 10}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Copy size={16} color="#6B7280" /></button>
                        <button style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #FEE2E2', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} color="#EF4444" /></button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>✦ {item.name}</p>
                        <p style={{ fontSize: 13, color: '#6B7280' }}>₦{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: 8 }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ padding: '10px 14px', fontWeight: 600, fontSize: 16, color: '#374151' }}>-</button>
                        <span style={{ fontWeight: 700, fontSize: 14, padding: '0 8px' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ padding: '10px 14px', fontWeight: 600, fontSize: 16, color: '#374151' }}>+</button>
                    </div>
                </div>
                {/* Selections */}
                <div style={{ marginTop: 12, background: '#F9FAFB', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>Your Selections</p>
                        <p style={{ fontSize: 13, color: '#6B7280' }}>+ ₦1,000</p>
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Take Out (paper Pack and Bag)</p>
                    <button style={{ width: '100%', background: '#F3F4F6', color: '#374151', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: 'none' }}>
                        Edit Selections <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        ))}

        {/* Add Another */}
        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 10, border: '1px solid #E5E7EB', fontWeight: 600, fontSize: 14, color: '#0C513F', background: 'white' }}>
            <Plus size={18} /> Add Another
        </button>

        {/* Message */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #F3F4F6', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MessageSquare size={20} color="#6B7280" />
                <span style={{ fontSize: 14, color: '#374151' }}>Leave a message for the restaurant</span>
            </div>
            <ChevronRight size={18} color="#9CA3AF" />
        </div>

        {/* Brown Bag Option */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>🛍️</span>
                <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>Need a Chowdeck brown bag?</p>
                    <p style={{ fontSize: 12, color: '#6B7280' }}>Package your order in a brown bag for just ₦200</p>
                </div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #D1D5DB' }}></div>
        </div>
    </div>
);

const DeliveryTab = ({ subtotal, deliveryFee, serviceFee, total, cart }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Delivery Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: '#D1FAE5', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#059669' }}>i</div>
            <span style={{ fontSize: 13, color: '#065F46' }}>Delivery requires PIN confirmation</span>
        </div>

        {/* Address */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid #F3F4F6' }}>
            <MapPin size={20} color="#6B7280" style={{ marginTop: 2 }} />
            <div>
                <p style={{ fontWeight: 500, fontSize: 14, color: '#111', marginBottom: 2 }}>16 Sholanke St, Akoka, Lagos 100001, Lagos, Nigeria</p>
                <p style={{ fontSize: 12, color: '#9CA3AF' }}>Delivery Address</p>
            </div>
        </div>

        {/* Note */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Truck size={20} color="#6B7280" />
                <span style={{ fontSize: 14, color: '#374151' }}>Note for the rider</span>
            </div>
            <ChevronRight size={18} color="#9CA3AF" />
        </div>

        {/* Delivery Time Section Header */}
        <div style={{ padding: '20px 0 12px', background: '#F9FAFB', margin: '0 -16px', paddingLeft: 16, paddingRight: 16, marginTop: 16, marginBottom: 0 }}>
            <h4 style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Available Delivery Time</h4>
        </div>

        {/* Time Options */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Calendar size={20} color="#111" />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>Right now</span>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #0C513F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0C513F' }}></div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Calendar size={20} color="#6B7280" />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#6B7280' }}>Schedule delivery</span>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #D1D5DB' }}></div>
            </div>
        </div>

        {/* Payment Summary Section Header */}
        <div style={{ padding: '20px 0 12px', background: '#F9FAFB', margin: '0 -16px', paddingLeft: 16, paddingRight: 16, marginTop: 16 }}>
            <h4 style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Payment Summary</h4>
        </div>

        {/* Chowpass Promo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'linear-gradient(135deg, #F5D0FE 0%, #FBCFE8 100%)', borderRadius: 14, marginTop: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>🎡</span>
                <div>
                    <p style={{ fontWeight: 700, fontSize: 12, color: '#111', letterSpacing: 0.5 }}>SPEND LESS ON THIS ORDER</p>
                    <p style={{ fontSize: 11, color: '#6B21A8' }}>WITH A SPIN ON THE LOVE WHEEL</p>
                    <p style={{ fontSize: 9, color: '#6B7280' }}>*Terms and conditions apply</p>
                </div>
            </div>
            <ChevronRight size={20} color="#111" />
        </div>

        {/* Promo Code */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', marginBottom: 16 }}>
            <FileText size={20} color="#7C3AED" />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#7C3AED' }}>Use Promo Code</span>
        </div>

        {/* Price Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#6B7280' }}>Sub-total ({cart.length} items)</span>
                <span style={{ fontWeight: 600, color: '#111' }}>₦{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#6B7280' }}>Delivery Fee</span>
                <span style={{ fontWeight: 600, color: '#111' }}>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>Service Fee <span style={{ fontSize: 12, color: '#F97316' }}>ⓘ</span></span>
                <span style={{ fontWeight: 600, color: '#111' }}>₦{serviceFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, paddingTop: 12, borderTop: '1px solid #E5E7EB', marginTop: 8 }}>
                <span style={{ fontWeight: 700, color: '#111' }}>Total</span>
                <span style={{ fontWeight: 700, color: '#111' }}>₦{total.toLocaleString()}</span>
            </div>
        </div>
    </div>
);

export default CheckoutView;
