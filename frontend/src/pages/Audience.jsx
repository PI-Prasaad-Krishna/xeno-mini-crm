import { useState } from 'react';
import axios from 'axios';
import { Command, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://xeno-mini-crm-backend-llhn.onrender.com/api';

export default function Audience() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [segmentData, setSegmentData] = useState(null);

  const generateSegment = async () => {
    if (!prompt) return;
    setLoading(true);
    const toastId = toast.loading('Querying natural language engine...');
    try {
      const { data } = await axios.post(`${API_BASE}/segments/query`, { description: prompt });
      setSegmentData(data);
      toast.success(`Synthesized ${data.totalCount} shopper profiles`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate segment. Check GEMINI_API_KEY.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="mb-8" style={{ maxWidth: '800px' }}>
        <h1 className="editorial-serif text-title mb-2">Audience Terminal</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Instantly query and construct high-fidelity segments from your raw customer data. Type a description below to let the natural language processor build your target.
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: '48px', maxWidth: '800px' }}>
        <Command color="var(--text-tertiary)" size={20} style={{ position: 'absolute', top: '22px', left: '20px' }} />
        <input 
          type="text" 
          className="command-input" 
          placeholder="e.g. Find all shoppers with a lifetime value over $1000..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateSegment()}
        />
        <button 
          className="btn-primary" 
          style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 16px', borderRadius: '12px' }}
          onClick={generateSegment}
          disabled={loading}
        >
          {loading ? 'Processing' : 'Execute'} <ArrowRight size={16} />
        </button>
        
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: '500' }}>SUGGESTIONS</span>
          {['Customers tagged with VIP', 'Shoppers who bought Coffee'].map(suggestion => (
             <span key={suggestion} onClick={() => setPrompt(suggestion)} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', transition: 'background 0.2s ease' }} onMouseOver={e => e.target.style.background='var(--surface-color)'} onMouseOut={e => e.target.style.background='transparent'}>
               {suggestion}
             </span>
          ))}
        </div>
      </div>

      {segmentData && (
        <div className="bento-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="flex-between" style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-hover)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Query Results</h3>
            <span className="tag" style={{ background: 'var(--surface-color)' }}>{segmentData.totalCount} Profiles Matched</span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px 32px', fontWeight: '500' }}>Name</th>
                <th style={{ padding: '16px 32px', fontWeight: '500' }}>Email</th>
                <th style={{ padding: '16px 32px', fontWeight: '500' }}>LTV</th>
                <th style={{ padding: '16px 32px', fontWeight: '500' }}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {segmentData.preview.map((customer, i) => (
                <tr key={customer._id} style={{ borderTop: '1px solid var(--border-color)', backgroundColor: i % 2 === 0 ? 'var(--surface-color)' : 'var(--surface-hover)' }}>
                  <td style={{ padding: '16px 32px', fontWeight: '500' }}>{customer.name}</td>
                  <td style={{ padding: '16px 32px', color: 'var(--text-secondary)' }}>{customer.email}</td>
                  <td style={{ padding: '16px 32px', fontWeight: '500', color: 'var(--text-primary)' }}>${customer.lifetimeValue}</td>
                  <td style={{ padding: '16px 32px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {customer.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
