import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  CheckCircle2,
  Users,
  Play,
  Hourglass,
  Timer,
  Calendar,
  Send,
  Upload,
  Trophy,
  Star,
  Ribbon,
  Info,
  ShieldCheck,
  Megaphone,
  MessageSquare,
  Search,
  Plus,
  User,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Sparkles,
  Lock,
  LogOut
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [competition, setCompetition] = useState(null);
  const [competitionsList, setCompetitionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('details'); // 'details' | 'list'
  const [activeTab, setActiveTab] = useState('about');
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState('ENG');
  const [copied, setCopied] = useState(false);

  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('aarav@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ d: '01', h: '06', m: '28', s: '32' });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/competitions`, { headers });
      if (res.data.success && res.data.data.length > 0) {
        setCompetitionsList(res.data.data);
        setCompetition(res.data.data[0]);
      }
    } catch (err) {
      setError('Unable to load competition data. Please ensure the backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!competition?.registrationEndDate) return;

    const timer = setInterval(() => {
      const diff = new Date(competition.registrationEndDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({
        d: d < 10 ? `0${d}` : `${d}`,
        h: h < 10 ? `0${h}` : `${h}`,
        m: m < 10 ? `0${m}` : `${m}`,
        s: s < 10 ? `0${s}` : `${s}`
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [competition]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setActionLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: loginEmail,
        password: loginPassword
      });
      if (res.data.success) {
        const { user, token } = res.data.data;
        setToken(token);
        setCurrentUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setLoginModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleRegister = async () => {
    if (!token) {
      setLoginModalOpen(true);
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/competitions/${competition._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCompetition(res.data.data);
        alert('Successfully registered for competition! 🎉');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/competitions/${competition._id}/unregister`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCompetition(res.data.data);
        alert('Registration cancelled.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(competition?.referralLink || 'https://feedants.com/r/referral123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{ border: '4px solid #E0F2F1', borderTop: '4px solid #00796B', borderRadius: '50%', width: 44, height: 44, animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: 16, color: '#475569', fontWeight: 600, fontSize: 15 }}>Loading Feedants Competition Platform...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center', background: '#F8FAFC' }}>
        <Info size={54} color="#DC2626" />
        <h2 style={{ marginTop: 16, color: '#0F172A', fontSize: 20, fontWeight: 800 }}>Unable to connect to server</h2>
        <p style={{ marginTop: 8, color: '#64748B', fontSize: 14, maxWidth: 400 }}>{error}</p>
        <button onClick={fetchData} style={{ marginTop: 20, backgroundColor: '#00796B', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Retry Connection
        </button>
      </div>
    );
  }

  const isRegistered = competition?.userParticipation?.isRegistered;
  const progressPercent = Math.min(100, Math.max(0, (competition?.currentParticipants / competition?.maximumParticipants) * 100));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', color: '#0F172A' }}>
      
      {/* Header Bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '12px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#00796B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 900, fontSize: 18 }}>F</div>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#00796B', letterSpacing: '-0.5px' }}>feedants</span>
            </div>

            <nav style={{ display: 'flex', gap: 16 }}>
              {['Dance', 'Design', 'Coding', 'Drama'].map((cat) => (
                <span key={cat} onClick={() => setView('list')} style={{ fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
                  {cat}
                </span>
              ))}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', background: '#004D40', borderRadius: 20, padding: 3 }}>
              <button onClick={() => setLang('ENG')} style={{ background: lang === 'ENG' ? '#00796B' : 'transparent', color: lang === 'ENG' ? '#FFF' : '#B2DFDB', border: 'none', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>ENG</button>
              <button onClick={() => setLang('HINDI')} style={{ background: lang === 'HINDI' ? '#00796B' : 'transparent', color: lang === 'HINDI' ? '#FFF' : '#B2DFDB', border: 'none', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>हिंदी</button>
            </div>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F1F5F9', padding: '4px 12px', borderRadius: 20 }}>
                <img src={currentUser.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'} style={{ width: 28, height: 28, borderRadius: 14, objectFit: 'cover' }} alt="User" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{currentUser.name}</span>
                <button onClick={handleLogout} title="Sign Out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setLoginModalOpen(true)} style={{ background: '#00796B', color: '#FFF', border: 'none', padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,121,107,0.2)' }}>
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main style={{ maxWidth: 1280, width: '100%', margin: '24px auto', padding: '0 24px', flex: 1 }}>
        
        {view === 'list' ? (
          /* Competition Catalog List View */
          <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A' }}>Explore Competitions</h1>
                <p style={{ color: '#64748B', fontSize: 14, marginTop: 4 }}>Discover live tournaments, submit your entries, and win prize rewards.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {competitionsList.map((comp) => (
                <div key={comp._id} onClick={() => { setCompetition(comp); setView('details'); }} style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: '1px solid #E2E8F0', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <img src={comp.bannerImage} style={{ width: '100%', height: 160, objectFit: 'cover' }} alt={comp.title} />
                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#00796B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{comp.category}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#E0F2F1', color: '#00796B', padding: '3px 10px', borderRadius: 10 }}>{comp.status}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>{comp.title}</h3>
                    <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{comp.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>Prize Pool</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#00796B' }}>₹ {comp.prizePool?.toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>Entry Fee</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>₹ {comp.entryFee}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Competition Details Main View (2-Column Responsive Layout) */
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 32 }}>
            
            {/* Left Column (Main Details & Content) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Competition Banner Image & Header */}
              <div style={{ background: '#FFFFFF', borderRadius: 24, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
                <img src={competition?.bannerImage} style={{ width: '100%', height: 260, objectFit: 'cover' }} alt={competition?.title} />
                
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#00796B', background: '#E0F2F1', padding: '4px 12px', borderRadius: 12, textTransform: 'uppercase' }}>{competition?.category}</span>
                    {competition?.tags?.map((t, i) => (
                      <span key={i} style={{ fontSize: 12, fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '4px 12px', borderRadius: 12 }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', lineHeight: 1.25, flex: 1, marginRight: 16 }}>
                      {competition?.title}
                    </h1>

                    {isRegistered ? (
                      <div style={{ display: 'flex', alignItems: 'center', background: '#E0F2F1', padding: '6px 16px', borderRadius: 20 }}>
                        <CheckCircle2 size={16} color="#00796B" />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#00796B', marginLeft: 6 }}>Registered</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: 14 }}>{competition?.status}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Judge / Organizer Spotlight Card */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 20, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={competition?.organizer?.image} style={{ width: 68, height: 68, borderRadius: 34, border: '3px solid #E0F2F1', objectFit: 'cover' }} alt="Judge" />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>{competition?.organizer?.role}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginTop: 1 }}>{competition?.organizer?.name}</h3>
                    <p style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{competition?.organizer?.title} • <span style={{ color: '#00796B', fontWeight: 600 }}>{competition?.organizer?.experience}</span></p>
                  </div>
                </div>

                <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#E0F2F1', color: '#00796B', border: 'none', padding: '10px 18px', borderRadius: 14, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  <Play size={16} fill="#00796B" /> Intro Video
                </button>
              </div>

              {/* Countdown Banner */}
              <div style={{ background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #B2DFDB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Hourglass size={20} color="#004D40" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#004D40' }}>Registration closes in:</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#004D40', letterSpacing: '1px' }}>
                  {timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', padding: '6px 14px', borderRadius: 20, color: '#00796B', fontWeight: 800, fontSize: 12 }}>
                  <Timer size={14} color="#00796B" /> Hurry up!
                </div>
              </div>

              {/* 4-Column Important Dates Grid */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Important Dates & Milestones</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  
                  <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, border: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}><Calendar size={18} color="#00796B" /></div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Register Before</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#00796B', marginTop: 2 }}>10 Aug 26</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>11:50 PM</div>
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, border: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}><Send size={18} color="#00796B" /></div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Submission Starts</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#00796B', marginTop: 2 }}>6 Aug 26</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>04:00 AM</div>
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, border: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}><Upload size={18} color="#00796B" /></div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Submission Ends</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#00796B', marginTop: 2 }}>30 Aug 26</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>11:55 PM</div>
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, border: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}><Trophy size={18} color="#00796B" /></div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Result Date</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#00796B', marginTop: 2 }}>1 Sept 26</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>11:50 PM</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Previous Winners Gallery */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Previous Tournament Winners</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {competition?.previousWinners?.map((win, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      <div style={{ height: 110, position: 'relative' }}>
                        <img src={win.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={win.name} />
                        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 14, background: '#00796B', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFF' }}>
                          <Play size={12} color="#FFF" fill="#FFF" />
                        </div>
                      </div>
                      <div style={{ padding: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{win.name}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#00796B', marginTop: 2 }}>{win.rankText}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabbed Info Section */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', borderBottom: '2px solid #F1F5F9', gap: 24, marginBottom: 16 }}>
                  {['about', 'judging', 'rules'].map((tabKey) => (
                    <button key={tabKey} onClick={() => setActiveTab(tabKey)} style={{ background: 'none', border: 'none', borderBottom: activeTab === tabKey ? '3px solid #00796B' : '3px solid transparent', color: activeTab === tabKey ? '#00796B' : '#64748B', fontWeight: activeTab === tabKey ? 800 : 600, fontSize: 14, paddingBottom: 12, cursor: 'pointer', marginBottom: -2 }}>
                      {tabKey === 'about' ? 'About Competition' : tabKey === 'judging' ? 'Judging Parameters' : 'Rules & Eligibility'}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
                  {activeTab === 'about' && (
                    <div>
                      <p>{competition?.description}</p>
                    </div>
                  )}
                  {activeTab === 'judging' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {competition?.judgingParameters?.map((item, idx) => (
                        <div key={idx} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #F1F5F9' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>• {item.title}</div>
                          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{item.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'rules' && (
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 8, fontSize: 15 }}>Official Competition Rules:</div>
                      {competition?.rules?.map((rule, idx) => (
                        <div key={idx} style={{ fontSize: 13, marginBottom: 6 }}>• {rule}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rewards Table */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Rewards (All Positions)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {competition?.rewards?.map((rew, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {idx === 0 ? <Trophy size={18} color="#EAB308" /> : idx === 1 ? <Ribbon size={18} color="#94A3B8" /> : idx === 2 ? <Ribbon size={18} color="#D97706" /> : <Star size={16} color="#00796B" />}
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{rew.rankText}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 900, color: '#00796B' }}>₹ {rew.prizeAmount}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Sticky Registration & Actions Sidebar) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Registration Action Box */}
                <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Entry Fee</span>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#0F172A' }}>₹ {competition?.entryFee}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Total Prize Pool</span>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#00796B' }}>₹ {competition?.prizePool?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Availability Bar */}
                  <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 14, border: '1px solid #F1F5F9', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: '#00796B', marginBottom: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={16} /> Remaining Spots</span>
                      <span>{competition?.remainingSpots} left</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#E0F2F1', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progressPercent}%`, background: '#00796B', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 6, fontWeight: 600, textAlign: 'right' }}>
                      {competition?.currentParticipants} of {competition?.maximumParticipants} Spots Booked
                    </div>
                  </div>

                  {/* Action Button */}
                  {isRegistered ? (
                    <button onClick={handleUnregister} disabled={actionLoading} style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#00796B', color: '#FFF', border: 'none', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,121,107,0.3)' }}>
                      <span>Upload Submission</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#E0F2F1', marginTop: 2 }}>Registered (Click to cancel)</span>
                    </button>
                  ) : (
                    <button onClick={handleRegister} disabled={actionLoading} style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#00796B', color: '#FFF', border: 'none', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,121,107,0.3)' }}>
                      <span>Register Now - ₹{competition?.entryFee}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#E0F2F1', marginTop: 2 }}>Instant Backend Atomic Registration</span>
                    </button>
                  )}

                  {/* Payment Assurance */}
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={16} color="#00796B" /> 100% Refund policy guaranteed</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={16} color="#00796B" /> Secure payments powered by <b>Razorpay</b></div>
                  </div>

                </div>

                {/* Referral Box */}
                <div style={{ background: '#E8F5E9', borderRadius: 20, padding: 18, border: '1px solid #C8E6C9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Megaphone size={20} color="#00796B" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Refer & Earn Bonus</div>
                      <div style={{ fontSize: 11, color: '#00796B', fontWeight: 700 }}>Earn ₹10 for every friend signup</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', background: '#FFFFFF', borderRadius: 10, padding: 4, border: '1px solid #C8E6C9' }}>
                    <input type="text" readOnly value="https://feedants.com/r/referral123" style={{ border: 'none', padding: '6px 8px', fontSize: 11, color: '#64748B', flex: 1, outline: 'none' }} />
                    <button onClick={handleCopyLink} style={{ background: '#00796B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Login Modal */}
      {loginModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#FFF', borderRadius: 24, padding: 28, width: '100%', maxWidth: 400, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A' }}>Sign In to Feedants</h3>
              <button onClick={() => setLoginModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} color="#64748B" /></button>
            </div>

            <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>Quick Test Credentials:</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <button onClick={() => setLoginEmail('aarav@example.com')} style={{ background: '#E0F2F1', color: '#00796B', border: 'none', padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>User 1 (Aarav)</button>
              <button onClick={() => setLoginEmail('priya@example.com')} style={{ background: '#E0F2F1', color: '#00796B', border: 'none', padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>User 2 (Priya)</button>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Email Address</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14 }} required />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14 }} required />
              </div>
              <button type="submit" disabled={actionLoading} style={{ width: '100%', padding: 14, borderRadius: 12, background: '#00796B', color: '#FFF', border: 'none', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,121,107,0.3)' }}>
                {actionLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
