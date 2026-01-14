import React from 'react';
import { ArrowLeft, Star, Clock, Plus } from 'lucide-react';
import { vendors, menuItems } from '../data';
import { useCart } from '../context/CartContext';

const VendorView = ({ vendorId, onBack }) => {
    const { addToCart } = useCart();
    const vendor = vendors.find(v => v.id === vendorId) || vendors[0];
    const items = menuItems.filter(i => i.vendorId === vendorId);

    // If no items for this vendor in mock, show all meant for ensuring demo works
    const displayItems = items.length > 0 ? items : menuItems.slice(0, 3);

    return (
        <div className="flex-col" style={{ paddingBottom: 100, background: '#fff', minHeight: '100vh' }}>
            {/* Header Image */}
            <div style={{ height: 200, background: `url(${vendor.image}) center/cover`, position: 'relative' }}>
                <button onClick={onBack} style={{
                    position: 'absolute', top: 16, left: 16,
                    background: 'white', borderRadius: '50%', padding: 8,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="p-4" style={{ marginTop: -20, background: 'white', borderRadius: '20px 20px 0 0', position: 'relative' }}>
                <h1 className="font-bold" style={{ fontSize: 24, marginBottom: 8 }}>{vendor.name}</h1>
                <div className="flex-row gap-3 text-sm text-muted">
                    <div className="flex-row gap-1">
                        <Star size={14} fill="#FFC107" stroke="#FFC107" />
                        <span>{vendor.rating}</span>
                    </div>
                    <div className="flex-row gap-1">
                        <Clock size={14} />
                        <span>{vendor.deliveryTime}</span>
                    </div>
                    <span>• {vendor.categories.join(', ')}</span>
                </div>

                <div className="flex-row gap-2 mt-4 overflow-x-auto">
                    {['Recommended', 'Main Dish', 'Sides', 'Drinks'].map((cat, i) => (
                        <span key={i} style={{
                            padding: '6px 16px',
                            borderRadius: 20,
                            background: i === 0 ? '#0C513F' : '#F3F4F6',
                            color: i === 0 ? 'white' : '#666',
                            fontSize: 13, fontWeight: 600,
                            whiteSpace: 'nowrap'
                        }}>
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-4 flex-col gap-4">
                {displayItems.map(item => (
                    <div key={item.id} className="flex-row justify-between p-3" style={{ border: '1px solid #eee', borderRadius: 12 }}>
                        <div className="flex-col gap-1" style={{ flex: 1 }}>
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <p className="text-xs text-muted line-clamp-2">{item.description}</p>
                            <span className="font-bold mt-2">₦{item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex-col items-center gap-2">
                            <div style={{ width: 80, height: 60, borderRadius: 8, background: `url(${item.image}) center/cover` }}></div>
                            <button
                                onClick={() => addToCart(item)}
                                style={{
                                    background: '#E8F5F1', color: '#0C513F',
                                    padding: '4px 12px', borderRadius: 4,
                                    fontSize: 12, fontWeight: 'bold'
                                }}>
                                ADD +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorView;
