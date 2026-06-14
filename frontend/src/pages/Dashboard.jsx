import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { io } from 'socket.io-client';

const API_BASE = 'https://xeno-mini-crm-backend-llhn.onrender.com/api';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
    
    // Connect to real-time socket server
    const socket = io('https://xeno-mini-crm-backend-llhn.onrender.com');
    
    socket.on('campaign-progress', (event) => {
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(c => {
          if (c._id === event.campaignId) {
            return {
              ...c,
              stats: {
                ...c.stats,
                [event.status]: (c.stats[event.status] || 0) + 1
              }
            };
          }
          return c;
        })
      );
    });

    socket.on('campaign-status-update', (event) => {
      setCampaigns(prev => prev.map(c => 
        c._id === event.campaignId ? { ...c, status: event.status } : c
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/campaigns`);
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aggregateStats = () => {
    return campaigns.reduce((acc, c) => {
      acc.sent += c.stats.sent;
      acc.delivered += c.stats.delivered;
      acc.opened += c.stats.opened;
      acc.clicked += c.stats.clicked;
      return acc;
    }, { sent: 0, delivered: 0, opened: 0, clicked: 0 });
  };

  const stats = aggregateStats();
  const deliveryRate = stats.sent > 0 ? Math.round((stats.delivered / stats.sent) * 100) : 0;
  const clickRate = stats.opened > 0 ? Math.round((stats.clicked / stats.opened) * 100) : 0;

  const trendValue = deliveryRate > 0 ? (Math.abs(deliveryRate - 65) / 10).toFixed(1) : 0;
  const isPositive = deliveryRate >= 65;

  const chartData = [
    { name: 'Sent', value: stats.sent },
    { name: 'Delivered', value: stats.delivered },
    { name: 'Opened', value: stats.opened },
    { name: 'Clicked', value: stats.clicked },
  ];

  const historicalData = [
    { day: 'Mon', volume: 1200 },
    { day: 'Tue', volume: 2100 },
    { day: 'Wed', volume: 1800 },
    { day: 'Thu', volume: 3400 },
    { day: 'Fri', volume: 2800 },
    { day: 'Sat', volume: 1500 },
    { day: 'Sun', volume: 4200 },
  ];

  if (loading) return <div className="main-content">Loading data...</div>;

  return (
    <div className="main-content">
      <div className="mb-8">
        <h1 className="editorial-serif text-title mb-2">Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Performance insights across all marketing initiatives. <span style={{ color: '#10b981', fontWeight: '500', fontSize: '0.85rem', marginLeft: '12px', background: '#dcfce7', padding: '4px 8px', borderRadius: '100px' }}>● REAL-TIME SYNC</span></p>
      </div>

      <div className="dashboard-grid">
        
        {/* Full Width Engagement Chart */}
        <div className="bento-card" style={{ gridColumn: 'span 3' }}>
           <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1.2rem' }}>Engagement Volume (7d)</h3>
           <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="volume" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Rate</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '16px' }}>
            <span className="editorial-serif text-massive">{deliveryRate}%</span>
            {stats.sent > 0 && (
              <span style={{ color: isPositive ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />} 
                {isPositive ? '+' : '-'}{trendValue}%
              </span>
            )}
          </div>
        </div>

        <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Click-to-Open</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '16px' }}>
            <span className="editorial-serif text-massive">{clickRate}%</span>
          </div>
        </div>

        <div className="bento-card" style={{ gridRow: 'span 2' }}>
           <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1.2rem' }}>Funnel Dropoff</h3>
           <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} width={80} />
                <Tooltip cursor={{ fill: 'var(--surface-hover)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--text-primary)' : 'var(--primary-color)'} opacity={1 - (index * 0.2)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card" style={{ gridColumn: 'span 2' }}>
           <div className="flex-between mb-4">
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Recent Dispatches</h3>
           </div>
           
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead>
               <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 <th style={{ paddingBottom: '16px', fontWeight: '500' }}>Campaign</th>
                 <th style={{ paddingBottom: '16px', fontWeight: '500' }}>Status</th>
                 <th style={{ paddingBottom: '16px', fontWeight: '500' }}>Sent</th>
                 <th style={{ paddingBottom: '16px', fontWeight: '500' }}>Delivered</th>
               </tr>
             </thead>
             <tbody>
               {campaigns.slice(0, 4).map((c, i) => (
                 <tr key={c._id} style={{ borderTop: '1px solid var(--border-color)' }}>
                   <td style={{ padding: '16px 0', fontWeight: '500' }}>{c.name}</td>
                   <td style={{ padding: '16px 0' }}><span className="tag">{c.status}</span></td>
                   <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{c.stats.sent}</td>
                   <td style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>{c.stats.delivered}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

      </div>
    </div>
  );
}
