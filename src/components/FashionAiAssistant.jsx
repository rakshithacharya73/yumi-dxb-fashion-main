import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Volume2, VolumeX, Send, X, Bot, 
  ShoppingBag, Check, ArrowRight, MessageSquare, RefreshCw 
} from 'lucide-react';

export default function FashionAiAssistant({ products = [], onAddToCart, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm YUMI's AI Fashion & Voice Stylist. How can I assist your luxury loungewear shopping today?",
      suggestedProducts: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition API if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Voice synthesis (Text to Speech)
  const speakText = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop ongoing speech
    
    const cleanText = text.replace(/[*_#~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Error starting speech recognition:', err);
      }
    }
  };

  const generateAiResponse = (query) => {
    const q = query.toLowerCase();
    let text = "";
    let matchedProducts = [];

    if (q.includes('robe') || q.includes('velvet') || q.includes('silk') || q.includes('kaftan') || q.includes('pyjama') || q.includes('show') || q.includes('recommend') || q.includes('best') || q.includes('collection')) {
      if (q.includes('robe')) {
        matchedProducts = products.filter(p => p.category?.toLowerCase().includes('robe') || p.name?.toLowerCase().includes('robe'));
        text = "Our handcrafted robes feature premium Modal Satin and Silk Velvet trims. Here are our top luxury robe recommendations:";
      } else if (q.includes('kaftan')) {
        matchedProducts = products.filter(p => p.category?.toLowerCase().includes('kaftan') || p.name?.toLowerCase().includes('kaftan'));
        text = "Our flowy Dubai Kaftans offer breathable luxury and royal comfort. Take a look at these popular styles:";
      } else if (q.includes('pyjama') || q.includes('co-ord') || q.includes('set')) {
        matchedProducts = products.filter(p => p.category?.toLowerCase().includes('pyjama') || p.category?.toLowerCase().includes('co-ord') || p.name?.toLowerCase().includes('set'));
        text = "Here are our cozy 2-piece lounge & pyjama co-ord sets designed for ultimate relaxation:";
      } else {
        matchedProducts = products.slice(0, 3);
        text = "Here are our current best-selling luxury loungewear pieces crafted for pure comfort:";
      }
    } else if (q.includes('size') || q.includes('fitting') || q.includes('chart')) {
      text = "All YUMI DXB pieces feature relaxed lounge sizing from S to XXL. If you prefer a loose, cozy fit, we recommend taking your standard size!";
    } else if (q.includes('fabric') || q.includes('material') || q.includes('wash') || q.includes('cotton')) {
      text = "We use 100% Breathable Organic Cotton, Silk Velvet, and Modal Satin. All fabrics are pre-washed and hypoallergenic for gentle skin feel.";
    } else if (q.includes('track') || q.includes('order') || q.includes('shipping') || q.includes('delivery')) {
      text = "We offer Pan-India express doorstep delivery (2-4 business days). You can track your live orders inside your Customer Portal anytime!";
    } else if (q.includes('offer') || q.includes('discount') || q.includes('coupon') || q.includes('code')) {
      text = "🎉 Enjoy 10% OFF on all orders today! Free express doorstep shipping on orders above ₹1,499.";
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      text = "Welcome to YUMI DXB! How can I help you find your perfect cozy loungewear piece today?";
    } else {
      text = "I'd love to help! You can ask me about our Robes, Kaftans, Pyjama Co-ords, size recommendations, fabric care, or order tracking.";
      matchedProducts = products.slice(0, 2);
    }

    return { text, matchedProducts };
  };

  const handleSendMessage = (userQueryText) => {
    const textToSend = userQueryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate AI Bot Response with slight natural delay
    setTimeout(() => {
      const { text, matchedProducts } = generateAiResponse(textToSend);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: text,
        suggestedProducts: matchedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(text);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Widget Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            title="Open YUMI AI Fashion & Voice Assistant"
            style={{
              background: 'linear-gradient(135deg, #1F2A44 0%, #0F172A 100%)',
              color: '#FFFFFF', border: '2px solid #C97B7B',
              borderRadius: '30px', padding: '12px 22px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 10px 30px rgba(201, 123, 123, 0.4)', transition: 'all 0.3s transform'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Sparkles size={20} color="#C97B7B" />
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px', width: '9px', height: '9px',
                backgroundColor: '#4CAF50', borderRadius: '50%', border: '2px solid #1F2A44'
              }}></span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '0.4px' }}>AI Stylist & Voice</span>
          </button>
        )}
      </div>

      {/* AI Assistant Chat Drawer / Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '380px', maxWidth: 'calc(100vw - 32px)', height: '570px', maxHeight: 'calc(100vh - 40px)',
          backgroundColor: '#FFFFFF', borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)', border: '1.5px solid #C97B7B',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }} className="animate-fade-in">
          
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1F2A44 0%, #2A3859 100%)', color: '#FFFFFF', padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #C97B7B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(201,123,123,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #C97B7B'
              }}>
                <Bot size={22} color="#C97B7B" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.3px' }}>
                  YUMI AI Stylist <Sparkles size={14} color="#C97B7B" />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>
                  Online • Voice & Text Assistant
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
              >
                {isMuted ? <VolumeX size={18} color="#999" /> : <Volume2 size={18} color="#C97B7B" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div style={{ backgroundColor: '#F5EFE6', padding: '10px 14px', borderBottom: '1px solid #E8E2D9', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {['Recommend Robes', 'Dubai Kaftans', 'Fabric Care', 'Track Order', '10% Discount'].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                style={{
                  backgroundColor: '#FFFFFF', border: '1px solid #C97B7B', color: '#1F2A44',
                  borderRadius: '16px', padding: '5px 13px', fontSize: '0.76rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'linear-gradient(180deg, #FBF8F5 0%, #F5EFE6 100%)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#1F2A44' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#1F2A44',
                  padding: '12px 16px', borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontSize: '0.88rem', lineHeight: 1.4,
                  border: msg.sender === 'ai' ? '1px solid #E8E2D9' : 'none'
                }}>
                  {msg.text}

                  {/* Inline Suggested Products */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.suggestedProducts.map(prod => (
                        <div
                          key={prod.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: '#F7F3EE', padding: '8px 10px', borderRadius: '10px',
                            border: '1px solid #E2D9CF'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={prod.images?.[0] || prod.image} alt={prod.name} style={{ width: '36px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1F2A44' }}>{prod.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#C97B7B', fontWeight: 700 }}>₹{prod.price}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onAddToCart(prod, 'M', 1);
                              setMessages(prev => [...prev, {
                                id: Date.now(), sender: 'ai', text: `Added "${prod.name}" to your shopping bag! 🛍️`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              }]);
                            }}
                            style={{
                              backgroundColor: '#C97B7B', color: '#FFF', border: 'none',
                              borderRadius: '16px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
                            }}
                          >
                            Add to Bag
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#999', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening Indicator */}
          {isListening && (
            <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D32F2F', animation: 'pulse 1s infinite' }}></span>
              Listening... Speak your fashion request now!
            </div>
          )}

          {/* Chat Input & Voice Bar */}
          <div style={{ padding: '12px 14px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E8E2D9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleListening}
              title={isListening ? "Stop Voice Listening" : "Speak with Voice Assistant"}
              style={{
                backgroundColor: isListening ? '#D32F2F' : '#F7F3EE', color: isListening ? '#FFF' : '#1F2A44',
                border: '1px solid #D5CEC4', borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} color="#C97B7B" />}
            </button>

            <input
              type="text"
              placeholder="Ask YUMI AI or speak..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1, backgroundColor: '#F7F3EE', border: '1px solid #E8E2D9',
                borderRadius: '20px', padding: '10px 16px', fontSize: '0.88rem', outline: 'none', color: '#1F2A44'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              style={{
                backgroundColor: inputQuery.trim() ? '#1F2A44' : '#D5CEC4', color: '#FFFFFF',
                border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: inputQuery.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
