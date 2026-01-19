import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Paperclip, Utensils, Calendar, Users, Clock, ChevronLeft, ShoppingBag, ArrowRight, Plus, History, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import chowpalLogo from '../assets/chowpal_logo.png';

// Food images for suggestion cards
import EggsImg from '../assets/Eggs in a pan.png';
import SandwichImg from '../assets/Sandwich.png';
import JollofImg from '../assets/Jollof.png';
import FriesBurgerImg from '../assets/Fires and burger.png';

// Markdown parser - formats text for readability
const parseMarkdown = (text) => {
    if (!text) return '';

    // First, process bold markers **text** -> <strong>text</strong>
    const processBold = (str) => {
        const parts = [];
        let remaining = str;
        let keyCounter = 0;

        while (remaining.includes('**')) {
            const startIdx = remaining.indexOf('**');
            if (startIdx === -1) break;

            const afterStart = remaining.slice(startIdx + 2);
            const endIdx = afterStart.indexOf('**');
            if (endIdx === -1) break;

            // Add text before bold
            if (startIdx > 0) {
                parts.push(remaining.slice(0, startIdx));
            }
            // Add bold text
            const boldText = afterStart.slice(0, endIdx);
            parts.push(<strong key={keyCounter++} style={{ fontWeight: 600, color: '#111' }}>{boldText}</strong>);

            remaining = afterStart.slice(endIdx + 2);
        }
        // Add remaining text
        if (remaining) parts.push(remaining);

        return parts.length > 0 ? parts : str;
    };

    // Clean up the text
    const cleanText = text
        .replace(/^#{1,3}\s+/gm, '')       // Remove markdown headers (##, ###)
        .replace(/- /g, '\n• ')            // Convert dashes to bullets with newline
        .replace(/\n\n/g, '\n')            // Reduce double newlines
        .trim();

    return cleanText.split('\n').map((line, i) => (
        <span key={i} style={{ display: 'block', marginBottom: line.startsWith('•') ? 4 : 8 }}>
            {processBold(line)}
        </span>
    ));
};

const ChatView = ({ onNavigate }) => {
    const { addToCart, cart } = useCart();

    // Toast notification state
    const [toastMessage, setToastMessage] = useState(null);
    const toastTimeout = useRef(null);

    const handleAddToCart = (item) => {
        addToCart(item);
        // Clear any existing timeout
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        // Show toast
        setToastMessage(`${item.name} added to cart!`);
        // Auto-hide after 2.5 seconds
        toastTimeout.current = setTimeout(() => setToastMessage(null), 2500);
    };

    // Drawer State
    const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

    // Chat State
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [showWelcome, setShowWelcome] = useState(true);

    // Multimodal State
    const [isListening, setIsListening] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);

    // History State
    const [historyItems, setHistoryItems] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState('default');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await fetch('/api/history?sessionId=default');
            const data = await res.json();

            if (data.length > 0) {
                const preview = data.find(m => m.sender === 'user')?.text || "Chat";
                setHistoryItems([{ sessionId: 'default', preview, timestamp: 'Today' }]);
            }
        } catch (err) {
            console.log('Failed to load history', err);
        }
    };

    const startNewChat = () => {
        const newId = 'session_' + Date.now();
        setMessages([]);
        setShowWelcome(true);
        setActiveSessionId(newId);
        setShowHistoryDrawer(false);
    };

    const openChat = async (sessionId) => {
        setIsLoading(true);
        setShowHistoryDrawer(false);
        try {
            const res = await fetch(`/api/history?sessionId=${sessionId}`);
            const data = await res.json();

            const formatted = data.map(m => ({
                id: Date.now() + Math.random(),
                sender: m.sender,
                text: m.text,
                cards: m.cards
            }));

            setMessages(formatted);
            setShowWelcome(formatted.length === 0);
            setActiveSessionId(sessionId);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // Cooldown to prevent rapid sends (rate limit protection)
    const [lastSendTime, setLastSendTime] = useState(0);
    const SEND_COOLDOWN = 2000; // 2 seconds between sends

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        // Rate limit protection: enforce minimum time between sends
        const now = Date.now();
        if (now - lastSendTime < SEND_COOLDOWN) {
            return; // Silently ignore rapid sends
        }
        setLastSendTime(now);

        if (showWelcome) setShowWelcome(false);

        const userMsg = { id: Date.now(), sender: 'user', text: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.map(m => ({ sender: m.sender, text: m.text })),
                    sessionId: activeSessionId,
                    image: selectedImage // Send image if present
                })
            });

            // Clear image after sending
            setSelectedImage(null);

            const data = await res.json();

            if (data.error) {
                setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Oops! ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.text, cards: data.cards }]);
            }
            loadHistory(); // Refresh history after sending
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Sorry, I couldn't reach the server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuyNow = (item) => {
        addToCart(item);
        if (onNavigate) onNavigate('checkout');
    };

    // Voice Handler
    const handleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Your browser doesn't support voice input.");

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => (prev ? prev + ' ' : '') + transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // Image Handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // History Drawer Overlay
    const renderHistoryDrawer = () => (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setShowHistoryDrawer(false)}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.3)', zIndex: 9998,
                    backdropFilter: 'blur(4px)',
                    opacity: showHistoryDrawer ? 1 : 0,
                    pointerEvents: showHistoryDrawer ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
            />
            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '85%', maxWidth: 320, background: '#fff', zIndex: 9999,
                transform: showHistoryDrawer ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #F3F4F6' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>History</h2>
                    <button onClick={() => setShowHistoryDrawer(false)} style={{ padding: 8 }}>
                        <X size={20} color="#6B7280" />
                    </button>
                </div>

                <div style={{ padding: '16px 20px' }}>
                    <button
                        onClick={startNewChat}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '14px', background: '#0C513F', borderRadius: 12,
                            border: 'none', color: '#fff', fontWeight: 600, fontSize: 14
                        }}>
                        <Plus size={18} />
                        New Chat
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', marginBottom: 12 }}>Today</p>
                    {historyItems.length === 0 ? (
                        <p style={{ color: '#D1D5DB', fontSize: 14 }}>No conversations yet</p>
                    ) : (
                        historyItems.map((item, i) => (
                            <button key={i} onClick={() => openChat(item.sessionId)} style={{
                                width: '100%', textAlign: 'left', padding: '14px', background: '#F9FAFB',
                                borderRadius: 10, marginBottom: 8, border: '1px solid #E5E7EB'
                            }}>
                                <p style={{ fontWeight: 500, fontSize: 14, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.preview}
                                </p>
                                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{item.timestamp}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div style={{ height: 'calc(100vh - 80px)', background: '#F8F8F8', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', padding: '16px 20px',
                borderBottom: '1px solid #F3F4F6', background: '#fff',
                justifyContent: 'space-between'
            }}>


                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {showWelcome ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                <img src={chowpalLogo} alt="Chowpal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 16 }}>Chowpal</span>
                        </div>
                    ) : (
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                            {messages.find(m => m.sender === 'user')?.text || 'Chowpal'}
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Cart Icon with Badge */}
                    <button
                        onClick={() => onNavigate && onNavigate('checkout')}
                        style={{ padding: 8, position: 'relative' }}
                    >
                        <ShoppingBag size={22} color="#374151" />
                        {cart.length > 0 && (
                            <span style={{
                                position: 'absolute', top: 2, right: 2,
                                background: '#EF4444', color: '#fff',
                                fontSize: 10, fontWeight: 700,
                                width: 16, height: 16, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {cart.length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setShowHistoryDrawer(true)} style={{ padding: 8 }}>
                        <History size={22} color="#374151" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: 120 }}>
                {showWelcome ? (
                    <div style={{ marginTop: 24 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 600, color: '#111', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Hello, Foodie</h2>
                        <h2 style={{ fontSize: 32, fontWeight: 600, color: '#9CA3AF', marginBottom: 32, letterSpacing: '-0.02em', lineHeight: 1.1 }}>How can I help you today?</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                {
                                    image: EggsImg,
                                    title: "Plan my breakfast meals",
                                    prompt: "Hey! Can you help me plan some delicious breakfast options?",
                                    cardColor: "#FFD6A5",
                                    imgStyle: { position: 'absolute', top: 0, right: 0, width: 140, height: 140, objectFit: 'contain' }
                                },
                                {
                                    image: JollofImg,
                                    title: "Find lunch under ₦5,000",
                                    prompt: "What's a good lunch I can get for under 5000 naira?",
                                    cardColor: "#A8E6CF",
                                    imgStyle: { position: 'absolute', top: 0, left: 0, width: 140, height: 140, objectFit: 'contain' }
                                },
                                {
                                    image: SandwichImg,
                                    title: "Quick snack ideas",
                                    prompt: "I need something quick to eat, what snacks do you recommend?",
                                    cardColor: "#FFB7C5",
                                    imgStyle: { position: 'absolute', top: 0, right: 0, width: 140, height: 140, objectFit: 'contain' }
                                },
                                {
                                    image: FriesBurgerImg,
                                    title: "Find me comfort food",
                                    prompt: "I'm craving some comfort food, what do you recommend?",
                                    cardColor: "#B8C1EC",
                                    imgStyle: { position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', width: 130, height: 130, objectFit: 'contain' }
                                },
                            ].map((s, i) => (
                                <button key={i} onClick={() => handleSend(s.prompt)} style={{
                                    display: 'flex', flexDirection: 'column',
                                    position: 'relative',
                                    padding: 0, // Padding removed for image bleed
                                    background: s.cardColor,
                                    borderRadius: 24,
                                    border: 'none',
                                    textAlign: 'left', minHeight: 200,
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                                >
                                    {/* Food image - absolutely positioned */}
                                    <img
                                        src={s.image}
                                        alt={s.title}
                                        style={s.imgStyle}
                                    />

                                    {/* Text container positioned at bottom */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        padding: 20,
                                        zIndex: 1
                                    }}>
                                        <span style={{
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: '#222',
                                            lineHeight: 1.4,
                                            display: 'block'
                                        }}>
                                            {s.title}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '85%', padding: '12px 16px', borderRadius: 20,
                                    background: msg.sender === 'user' ? '#0C513F' : '#fff',
                                    color: msg.sender === 'user' ? '#fff' : '#111',
                                    boxShadow: msg.sender === 'ai' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                    fontSize: 15, lineHeight: 1.6
                                }}>
                                    {parseMarkdown(msg.text)}
                                </div>
                                {msg.cards && msg.cards.length > 0 && (
                                    <div style={{ display: 'flex', gap: 12, marginTop: 12, overflowX: 'auto', paddingBottom: 8, maxWidth: '100%', alignItems: 'stretch' }}>
                                        {/* Regular (non-sponsored) cards */}
                                        {msg.cards.filter(c => !c.sponsored).map((card, i) => (
                                            <div key={`reg-${i}`} style={{
                                                minWidth: 200, width: 200, minHeight: 280, flexShrink: 0,
                                                background: '#fff', borderRadius: 16, overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                display: 'flex', flexDirection: 'column'
                                            }}>
                                                <div style={{ height: 120, background: `url(${card.image}) center/cover`, backgroundColor: '#f3f4f6' }}></div>
                                                <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#111' }}>{card.name}</p>
                                                    <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>₦{card.price.toLocaleString()}</p>
                                                    <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
                                                        <button
                                                            onClick={() => handleAddToCart(card)}
                                                            style={{ flex: 1, padding: '8px', background: '#E8F5F1', color: '#0C513F', borderRadius: 8, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
                                                        >
                                                            <ShoppingBag size={14} /> Add
                                                        </button>
                                                        <button
                                                            onClick={() => handleBuyNow(card)}
                                                            style={{ flex: 1, padding: '8px', background: '#0C513F', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
                                                        >
                                                            Buy <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Ads vertical divider - fills full height */}
                                        {msg.cards.filter(c => c.sponsored).length > 0 && (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingLeft: 8, paddingRight: 8, flexShrink: 0, alignSelf: 'stretch' }}>
                                                <div style={{ width: 1, flex: 1, background: '#D1D5DB' }}></div>
                                                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 0', whiteSpace: 'nowrap' }}>Ads</span>
                                                <div style={{ width: 1, flex: 1, background: '#D1D5DB' }}></div>
                                            </div>
                                        )}

                                        {/* Sponsored cards */}
                                        {msg.cards.filter(c => c.sponsored).map((card, i) => (
                                            <div key={`sp-${i}`} style={{
                                                minWidth: 200, width: 200, minHeight: 280, flexShrink: 0,
                                                background: '#fff', borderRadius: 16, overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                display: 'flex', flexDirection: 'column'
                                            }}>
                                                <div style={{ height: 120, background: `url(${card.image}) center/cover`, backgroundColor: '#f3f4f6' }}></div>
                                                <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#111' }}>{card.name}</p>
                                                    <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>₦{card.price.toLocaleString()}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }}></div>
                                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#EF4444' }}>Sponsored</span>
                                                    </div>
                                                    <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
                                                        <button
                                                            onClick={() => handleAddToCart(card)}
                                                            style={{ flex: 1, padding: '8px', background: '#E8F5F1', color: '#0C513F', borderRadius: 8, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
                                                        >
                                                            <ShoppingBag size={14} /> Add
                                                        </button>
                                                        <button
                                                            onClick={() => handleBuyNow(card)}
                                                            style={{ flex: 1, padding: '8px', background: '#0C513F', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
                                                        >
                                                            Buy <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: '#fff', borderRadius: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <span style={{ color: '#9CA3AF', fontSize: 14 }}>Chowpal is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area - Properly Contained */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '12px 20px 16px',
                background: 'linear-gradient(transparent, #F8F8F8 20%)',
                display: 'flex', flexDirection: 'column', gap: 8
            }}>
                {/* Image Preview */}
                {selectedImage && (
                    <div style={{ alignSelf: 'flex-start', marginLeft: 10, position: 'relative' }}>
                        <img src={selectedImage} alt="Upload preview" style={{ height: 60, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                        <button onClick={removeImage} style={{
                            position: 'absolute', top: -6, right: -6,
                            background: '#EF4444', color: '#fff', borderRadius: '50%',
                            width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer'
                        }}>
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#fff', padding: '10px 14px', borderRadius: 28,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #E5E7EB'
                }}>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                    <button onClick={() => fileInputRef.current?.click()} style={{ padding: 6, flexShrink: 0 }}><Paperclip size={20} color="#9CA3AF" /></button>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Listening..." : "Ask Chowpal anything..."}
                        disabled={isLoading}
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', padding: '6px 0', minWidth: 0 }}
                    />
                    <button
                        onClick={input.trim() || selectedImage ? () => handleSend() : handleVoice}
                        disabled={isLoading}
                        style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            background: (input.trim() || selectedImage) ? '#0C513F' : (isListening ? '#EF4444' : '#F3F4F6'),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        {(input.trim() || selectedImage) ? <ArrowUp size={18} color="#fff" /> : <Mic size={20} color={isListening ? "#fff" : "#9CA3AF"} className={isListening ? "pulse-anim" : ""} />}
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
                    background: '#0C513F', color: '#fff', padding: '12px 20px', borderRadius: 24,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: 14, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 8, zIndex: 100,
                    animation: 'fadeInUp 0.3s ease'
                }}>
                    <ShoppingBag size={16} />
                    {toastMessage}
                </div>
            )}

            {/* History Drawer */}
            {renderHistoryDrawer()}
        </div>
    );
};

export default ChatView;
