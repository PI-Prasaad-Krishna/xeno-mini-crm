import { useState } from 'react';
import axios from 'axios';
import { Send, Zap } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

export default function Campaigns() {
  const [name, setName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftPreview, setDraftPreview] = useState('');

  const handleCreate = async () => {
    if (!name || !segmentDescription || !messageTemplate) return alert('Fill all fields');
    setLoading(true);
    try {
      const segRes = await axios.post(`${API_BASE}/segments/query`, { description: segmentDescription });
      const campRes = await axios.post(`${API_BASE}/campaigns/create`, {
        name,
        segmentDescription,
        segmentQuery: segRes.data.segmentQuery,
        messageTemplate
      });

      await axios.post(`${API_BASE}/campaigns/${campRes.data._id}/send`);
      
      alert('Campaign successfully dispatched.');
      setName('');
      setSegmentDescription('');
      setMessageTemplate('');
      setDraftPreview('');
    } catch (err) {
      console.error(err);
      alert('Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  const previewDraft = async () => {
    try {
      const { data } = await axios.post(`${API_BASE}/campaigns/draft`, {
        messageTemplate,
        customerId: 'replace_with_real_id' 
      });
      setDraftPreview(data.message);
    } catch (err) {
      setDraftPreview('System notice: Ensure seed database is hydrated to preview user data.');
    }
  };

  return (
    <div className="main-content">
      <div className="mb-8" style={{ maxWidth: '800px' }}>
        <h1 className="editorial-serif text-title mb-2">Campaign Canvas</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Compose and dispatch highly targeted messaging sequences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>
        <div className="bento-card" style={{ padding: '40px' }}>
          <div className="mb-8">
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>CAMPAIGN NOMENCLATURE</label>
            <input type="text" className="clean-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer VIP Outreach" style={{ fontSize: '1.2rem', padding: '16px' }} />
          </div>
          
          <div className="mb-8">
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>TARGET AUDIENCE CONFIG</label>
            <input type="text" className="clean-input" value={segmentDescription} onChange={e => setSegmentDescription(e.target.value)} placeholder="Describe your audience..." />
          </div>

          <div className="mb-8">
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>MESSAGE ARCHITECTURE</label>
            <textarea 
              className="clean-textarea" 
              rows={6} 
              value={messageTemplate} 
              onChange={e => setMessageTemplate(e.target.value)} 
              placeholder="Hi {name}, we've curated a special offer just for you based on your past preferences..."
            />
          </div>

          <div className="flex-between">
            <button className="btn-secondary" onClick={previewDraft}><Zap size={16} /> Simulate Draft</button>
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              <Send size={16} />
              {loading ? 'Transmitting' : 'Dispatch'}
            </button>
          </div>
        </div>

        <div className="bento-card" style={{ backgroundColor: 'var(--text-primary)', color: 'white', position: 'sticky', top: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--text-tertiary)' }}>
            <Zap size={18} />
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>AI SYNTHESIS</h3>
          </div>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.6', fontFamily: 'Playfair Display, serif', color: 'white' }}>
            {draftPreview ? (
              <p>"{draftPreview}"</p>
            ) : (
              <p style={{ color: 'var(--text-tertiary)' }}>Run a draft simulation to preview how the AI will personalize your template for individual targets.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
