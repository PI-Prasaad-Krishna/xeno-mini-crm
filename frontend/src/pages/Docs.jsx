import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Database, Server } from 'lucide-react';

export default function Docs() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 64px', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 className="editorial-serif" style={{ fontSize: '24px', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Xeno Docs.</h2>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 0' }}>
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--surface-color)', padding: '6px 16px', borderRadius: '100px', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>
            <BookOpen size={14} color="var(--primary-color)" /> DEVELOPER GUIDE
          </div>
          <h1 className="editorial-serif text-massive" style={{ marginBottom: '24px' }}>Architecture & Integration</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Learn how Xeno weaves an LLM natively into a robust CRM backend to power seamless audience segmentation and lifecycle dispatching.
          </p>
        </div>

        <div className="clay-card" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Database size={24} color="var(--primary-color)" />
            <h2 className="editorial-serif" style={{ fontSize: '1.8rem' }}>AI-Native Segmentation</h2>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            Traditional CRMs rely on complex rule builders. Xeno leverages Google's Gemini to translate natural language intent directly into structural MongoDB query objects.
          </p>
          
          <div className="liquid-glass" style={{ padding: '24px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>// POST /api/segments/query</div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#ec4899' }}>const</span> prompt <span style={{ color: '#06b6d4' }}>=</span> `You are a CRM Data Assistant. 
              Translate natural language into a valid MongoDB query...`;
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#ec4899' }}>const</span> response <span style={{ color: '#06b6d4' }}>=</span> <span style={{ color: '#ec4899' }}>await</span> ai.models.generateContent(&#123;<br/>
              &nbsp;&nbsp;model: <span style={{ color: '#10b981' }}>'gemini-2.5-flash'</span>,<br/>
              &nbsp;&nbsp;contents: <span style={{ color: '#10b981' }}>`&#36;&#123;prompt&#125;\nUser: "&#36;&#123;description&#125;"`</span><br/>
              &#125;);
            </div>
            <div>
              <span style={{ color: '#ec4899' }}>const</span> mongoQuery <span style={{ color: '#06b6d4' }}>=</span> JSON.parse(response.text);<br/>
              <span style={{ color: '#ec4899' }}>const</span> audience <span style={{ color: '#06b6d4' }}>=</span> <span style={{ color: '#ec4899' }}>await</span> Customer.find(mongoQuery);
            </div>
          </div>
        </div>

        <div className="clay-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Server size={24} color="var(--primary-color)" />
            <h2 className="editorial-serif" style={{ fontSize: '1.8rem' }}>Asynchronous Delivery Loop</h2>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            Xeno separates concerns by dispatching communications to an external channel-service stub. This stub simulates real-world delivery latency and engagement, feeding back into the CRM via a webhook receiver.
          </p>
          
          <div className="liquid-glass" style={{ padding: '24px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
             <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>// POST /api/webhooks/channel-receipt</div>
             <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#ec4899' }}>const</span> &#123; communicationId, status &#125; <span style={{ color: '#06b6d4' }}>=</span> req.body;
             </div>
             <div>
               <span style={{ color: '#ec4899' }}>await</span> Communication.findByIdAndUpdate(communicationId, &#123; status &#125;);<br/><br/>
               <span style={{ color: 'var(--text-secondary)' }}>// Atomically update campaign analytics</span><br/>
               <span style={{ color: '#ec4899' }}>await</span> Campaign.findByIdAndUpdate(campaignId, &#123;<br/>
               &nbsp;&nbsp;&#36;inc: &#123; [<span style={{ color: '#10b981' }}>`stats.&#36;&#123;status.toLowerCase()&#125;`</span>]: 1 &#125;<br/>
               &#125;);
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
