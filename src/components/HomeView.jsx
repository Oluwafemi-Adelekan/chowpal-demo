import React from 'react';
import { MapPin, ChevronDown, SlidersHorizontal, Search, Utensils, ShoppingBag, Pill, Receipt, Package, Store, CalendarDays, MoreHorizontal, Sparkles, MessageCircle, Headphones, UserCircle, Home as HomeIcon, Gift } from 'lucide-react';
import { vendors } from '../data';

// Category assets
import RestaurantsImg from '../assets/Restaurants.png';
import ShopsImg from '../assets/Shops.png';
import PharmaciesImg from '../assets/Pharmacies.png';
import BillsImg from '../assets/Bills.png';
import PackagesImg from '../assets/Packages.png';
import LocalMarketsImg from '../assets/Local markets.png';
import EventsImg from '../assets/Events.png';
import MoreImg from '../assets/More.png';

const HomeView = ({ onNavigate }) => {
    const categories = [
        { name: 'Restaurants', image: RestaurantsImg, color: '#FEE2E2', iconColor: '#DC2626' },
        { name: 'Shops', image: ShopsImg, color: '#FEF3C7', iconColor: '#D97706' },
        { name: 'Pharmacies', image: PharmaciesImg, color: '#DBEAFE', iconColor: '#2563EB', badge: 'New' },
        { name: 'Bills', image: BillsImg, color: '#D1FAE5', iconColor: '#059669' },
        { name: 'Packages', image: PackagesImg, color: '#FCE7F3', iconColor: '#DB2777' },
        { name: 'Local Markets', image: LocalMarketsImg, color: '#FEF3C7', iconColor: '#65A30D', badge: 'New' },
        { name: 'Events', image: EventsImg, color: '#E0E7FF', iconColor: '#4F46E5' },
        { name: 'More', image: MoreImg, color: '#FEF9C3', iconColor: '#CA8A04' },
    ];

    return (
        <div style={{ paddingBottom: 100, background: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7280', fontSize: 12 }}>
                        <MapPin size={12} color="#10B981" />
                        <span>16 Sholanke St, Akoka, Lago...</span>
                        <ChevronDown size={14} />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Gift size={18} color="#D97706" />
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0C513F', color: 'white', padding: '8px 14px', borderRadius: 20, fontWeight: 600, fontSize: 13 }}>
                        Filter <SlidersHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Promo Banner - Chowsmart */}
            <div style={{ margin: '0 16px 20px', background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', borderRadius: 16, padding: '18px 20px', color: 'white' }}>
                <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Get affordable meals with <span style={{ fontStyle: 'italic', fontWeight: 700 }}>Chowsmart</span></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <span style={{ fontSize: 11, opacity: 0.9 }}>FOR AS LOW AS</span>
                    <div style={{ background: 'white', color: '#111', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>₦2,500</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11, opacity: 0.9 }}>With</span>
                        <span style={{ fontWeight: 700, fontSize: 12 }}>Zero</span>
                        <span style={{ fontSize: 11, opacity: 0.9 }}>delivery or service fees</span>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px', padding: '0 16px', marginBottom: 20 }}>
                {categories.map((cat, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <div style={{ width: 64, height: 64, background: cat.color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} style={{ width: 54, height: 54, objectFit: 'contain' }} />
                            ) : (
                                React.cloneElement(cat.icon, { color: cat.iconColor })
                            )}
                            {cat.badge && (
                                <span style={{ position: 'absolute', top: -4, right: -4, background: '#EF4444', color: 'white', fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 6 }}>{cat.badge}</span>
                            )}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 500, color: '#374151', textAlign: 'center' }}>{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* Promo Banner - Free Delivery */}
            <div style={{ margin: '0 16px 24px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>Get Free Delivery for 30 days!</p>
                <button style={{ background: '#EAB308', color: '#111', padding: '8px 16px', borderRadius: 20, fontWeight: 700, fontSize: 13 }}>Redeem Now</button>
            </div>

            {/* Explore Section */}
            <div style={{ padding: '0 16px', marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: '#111' }}>Explore</h3>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                    {vendors.slice(0, 6).map((item) => (
                        <div key={item.id} onClick={() => onNavigate('vendor', item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70, cursor: 'pointer' }}>
                            <div style={{ width: 60, height: 60, borderRadius: '50%', background: `url(${item.image}) center/cover`, marginBottom: 8, border: '2px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}></div>
                            <span style={{ fontSize: 10, fontWeight: 500, color: '#374151', textAlign: 'center', lineHeight: 1.3, maxWidth: 70, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Section */}
            <div style={{ padding: '0 16px' }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: '#111', display: 'flex', alignItems: 'center', gap: 6 }}>Featured <Sparkles size={16} color="#EAB308" /></h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {vendors.slice(0, 4).map((item) => (
                        <div key={item.id} onClick={() => onNavigate('vendor', item.id)} style={{ cursor: 'pointer', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ height: 120, background: `url(${item.image}) center/cover` }}></div>
                            <div style={{ padding: 10, background: '#fff' }}>
                                <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#111' }}>{item.name}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
                                    <span>★ {item.rating}</span>
                                    <span>•</span>
                                    <span>{item.deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeView;
