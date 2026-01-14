import React from 'react';
import { ArrowLeft, Truck, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { vendors } from '../data';

const OrdersView = ({ onNavigate, onBackToHome }) => {
    const { cart, getSubtotal, clearCart } = useCart();
    const [activeTab, setActiveTab] = React.useState('cart');
    const [expandedVendor, setExpandedVendor] = React.useState(null);

    // Group cart items by vendor
    const groupedItems = cart.reduce((acc, item) => {
        const vendorId = item.vendorId || 1;
        if (!acc[vendorId]) {
            acc[vendorId] = { items: [], total: 0 };
        }
        acc[vendorId].items.push(item);
        acc[vendorId].total += item.price * item.qty;
        return acc;
    }, {});

    return (
        <div style={{ minHeight: '100vh', background: '#fff', paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 16px 16px' }}>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: '#111' }}>Orders</h2>
                <button style={{ padding: '8px 16px', background: '#F3F4F6', borderRadius: 20, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    Clear Cart
                </button>
            </div>

            {/* Tabs - Chowdeck Style */}
            <div style={{ display: 'flex', padding: '0 16px', marginBottom: 24, background: '#F3F4F6', borderRadius: 12, marginLeft: 16, marginRight: 16 }}>
                {['My Cart', 'Ongoing', 'Completed'].map((tab, i) => {
                    const tabKey = ['cart', 'ongoing', 'completed'][i];
                    const isActive = activeTab === tabKey;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey)}
                            style={{
                                flex: 1, padding: '12px 8px', borderRadius: 10,
                                background: isActive ? '#111' : 'transparent',
                                color: isActive ? '#fff' : '#6B7280',
                                fontWeight: 600, fontSize: 13, margin: 4,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div style={{ padding: '0 16px' }}>
                {activeTab === 'cart' && (
                    cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                            <p style={{ fontSize: 16, marginBottom: 8 }}>Your cart is empty</p>
                            <p style={{ fontSize: 14 }}>Add items from restaurants to see them here</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {Object.entries(groupedItems).map(([vendorId, data]) => {
                                const vendor = vendors.find(v => v.id === parseInt(vendorId)) || { name: 'Restaurant', image: '' };
                                const isExpanded = expandedVendor === vendorId;

                                return (
                                    <div key={vendorId} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 16 }}>
                                        {/* Vendor Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 8, background: `url(${vendor.image}) center/cover` }}></div>
                                                <div>
                                                    <p style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 2 }}>{vendor.name}</p>
                                                    <p style={{ fontSize: 13, color: '#6B7280' }}>{data.items.length} Items • ₦{data.total.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExpandedVendor(isExpanded ? null : vendorId)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6B7280', fontWeight: 500 }}
                                            >
                                                View Selection {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </div>

                                        {/* Expanded Items */}
                                        {isExpanded && (
                                            <div style={{ marginBottom: 16, padding: 12, background: '#F9FAFB', borderRadius: 8 }}>
                                                {data.items.map(item => (
                                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                                                        <span style={{ fontSize: 13, color: '#374151' }}>✦ {item.name} x{item.qty}</span>
                                                        <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>₦{(item.price * item.qty).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Delivery Info */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
                                            <Truck size={18} color="#6B7280" style={{ marginTop: 2 }} />
                                            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>
                                                Delivering to 16 Sholanke St, Akoka, Lagos 100001, Lagos, Nigeria
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            onClick={() => onNavigate && onNavigate('checkout')}
                                            style={{ width: '100%', background: '#0C513F', color: 'white', padding: '14px', borderRadius: 10, fontWeight: 600, fontSize: 14, marginBottom: 12 }}
                                        >
                                            Checkout
                                        </button>
                                        <button style={{ width: '100%', background: 'transparent', color: '#0C513F', padding: '8px', fontWeight: 600, fontSize: 14 }}>
                                            Clear Selection
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}

                {activeTab === 'ongoing' && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                        <p style={{ fontSize: 16 }}>No ongoing orders</p>
                    </div>
                )}

                {activeTab === 'completed' && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                        <p style={{ fontSize: 16 }}>No completed orders</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersView;
