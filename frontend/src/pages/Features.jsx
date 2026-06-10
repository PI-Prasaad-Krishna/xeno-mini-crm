import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageSquare, Zap, BarChart3, Database, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Database size={24} color="var(--primary-color)" />,
      title: "Audience Terminal",
      description: "Bypass complex rule builders. Type natural language commands and watch as our AI translates intent directly into precision MongoDB queries."
    },
    {
      icon: <MessageSquare size={24} color="var(--primary-color)" />,
      title: "Generative Synthesis",
      description: "Stop writing generic templates. Xeno analyzes individual shopper histories to auto-generate highly personalized copy for every single user in your segment."
    },
    {
      icon: <Zap size={24} color="var(--primary-color)" />,
      title: "Async Dispatch Engine",
      description: "Built for scale. Dispatches are handled via an asynchronous webhook architecture, simulating the real-world latency of SMS and email gateways."
    },
    {
      icon: <BarChart3 size={24} color="var(--primary-color)" />,
      title: "Real-time Telemetry",
      description: "Watch your campaigns unfold. The dashboard aggregates delivery, open, and click-through rates in real-time as webhooks return from the channel service."
    },
    {
      icon: <Shield size={24} color="var(--primary-color)" />,
      title: "Enterprise Grade",
      description: "A monolithic repository architecture separating backend API logic from simulated third-party channel delivery services for robust testing."
    },
    {
      icon: <Sparkles size={24} color="var(--primary-color)" />,
      title: "Bespoke Aesthetics",
      description: "A uniquely crafted 'Editorial Fintech' interface. Utilizing fluid typography, liquid glass, and claymorphism to create a tactile workspace."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="editorial-serif" style={{ fontSize: '24px', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Xeno Features.</h2>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 64px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px auto' }}>
          <h1 className="editorial-serif text-massive" style={{ marginBottom: '24px' }}>Everything you need. <br/> Nothing you don't.</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Xeno strips away the clutter of traditional marketing suites, leaving only a powerful, AI-native engine designed for speed and precision.
          </p>
        </div>

        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          {features.map((feat, index) => (
            <div key={index} className="clay-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(67, 56, 202, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', flexShrink: 0 }}>
                {feat.icon}
              </div>
              <h3 className="editorial-serif" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{feat.title}</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1, margin: 0 }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
