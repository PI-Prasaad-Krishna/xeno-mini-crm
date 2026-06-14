import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', overflowY: 'auto' }}>
      
      {/* Navigation */}
      <nav className="landing-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--text-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '20px', fontFamily: 'Playfair Display, serif' }}>X</div>
          <h2 className="editorial-serif" style={{ fontSize: '24px', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Xeno.</h2>
        </div>
        <div className="landing-nav-links" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/features" style={{ textDecoration: 'none' }}>
            <span className="nav-link">Features</span>
          </Link>
          <Link to="/docs" style={{ textDecoration: 'none' }}>
            <span className="nav-link">Documentation</span>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '10px 24px' }}>
              Launch CRM <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', alignItems: 'center', minHeight: 'calc(100vh - 89px)' }}>
        
        {/* Left Column: Typography */}
        <div>
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--surface-color)', padding: '6px 16px', borderRadius: '100px', border: '1px solid var(--border-color)', marginBottom: '32px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px', animationDelay: '0s' }}>
            <Sparkles size={14} color="var(--primary-color)" /> INTELLIGENCE WOVEN IN
          </div>
          
          <h1 className="editorial-serif animate-fade-up" style={{ fontSize: '6rem', lineHeight: '1.05', marginBottom: '32px', color: 'var(--text-primary)', animationDelay: '0.15s' }}>
            Reach <br/>
            shoppers with <br/>
            <span style={{ color: 'var(--primary-color)' }}>pure intent.</span>
          </h1>
          
          <p className="animate-fade-up" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '48px', lineHeight: '1.6', animationDelay: '0.3s' }}>
            Translate natural language directly into robust data segments. Dispatch highly personalized lifecycle campaigns in seconds, without writing a single rule.
          </p>
          
          <div className="animate-fade-up" style={{ display: 'flex', gap: '16px', animationDelay: '0.45s' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="clay-btn" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Open Workspace <ArrowRight size={18}/>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Clean Floating Cards */}
        <div className="landing-hero-gfx" style={{ position: 'relative', height: '600px', width: '100%' }}>

          {/* Foreground UI Elements */}
          <div className="animate-fade-up" style={{ position: 'absolute', top: '15%', right: '5%', width: '85%', zIndex: '2', animationDelay: '0.8s' }}>
            <div className="floating-card" style={{ padding: '24px', transform: 'rotate(2deg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginLeft: '12px', fontFamily: 'monospace' }}>~/ai/segment.js</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>&gt; Translating intent...</span><br/>
                <span style={{ color: '#ec4899' }}>const</span> query <span style={{ color: '#06b6d4' }}>=</span> <span style={{ color: '#ec4899' }}>await</span> ai.parse(<br/>
                &nbsp;&nbsp;<span style={{ color: '#10b981' }}>"Shoppers with LTV &gt; $1000"</span><br/>
                );<br/>
                <span style={{ color: 'var(--text-tertiary)' }}>&gt; Found 1,245 profiles.</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-up" style={{ position: 'absolute', bottom: '15%', left: '5%', width: '70%', zIndex: '3', animationDelay: '1.0s' }}>
            <div className="floating-card" style={{ padding: '24px', transform: 'rotate(-3deg)' }}>
               <div className="flex-between" style={{ marginBottom: '16px' }}>
                 <h4 className="editorial-serif" style={{ fontSize: '1.2rem', margin: '0' }}>Summer VIP Outreach</h4>
                 <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600' }}>DISPATCHED</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                 <div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Delivery Rate</div>
                   <div className="editorial-serif" style={{ fontSize: '2.5rem', lineHeight: '1' }}>98.2%</div>
                 </div>
                 <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px' }}>
                   <div style={{ width: '8px', height: '20px', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                   <div style={{ width: '8px', height: '30px', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                   <div style={{ width: '8px', height: '15px', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                   <div style={{ width: '8px', height: '40px', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                 </div>
               </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="landing-features" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          
          <div className="bento-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(67, 56, 202, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Target size={24} color="var(--primary-color)" />
              </div>
              <h3 className="editorial-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>Audience Terminal</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '400px' }}>
                Type exactly who you want to reach. Our AI translates natural language directly into robust database queries, carving out precise segments instantly.
              </p>
            </div>
          </div>

          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(67, 56, 202, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Zap size={24} color="var(--primary-color)" />
              </div>
              <h3 className="editorial-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>AI Synthesis</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Drafting is obsolete. Our AI assistant analyzes individual customer histories and generates bespoke message copy for every single shopper in your segment.
              </p>
            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}
