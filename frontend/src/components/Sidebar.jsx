import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Send, ArrowLeft } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Audience', path: '/audience', icon: Users },
    { name: 'Campaigns', path: '/campaigns', icon: Send },
  ];

  return (
    <div className="sidebar" style={{ borderRight: 'none', backgroundColor: 'transparent' }}>
      <div style={{ marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '8px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--text-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '20px', fontFamily: 'Playfair Display, serif' }}>X</div>
        <h2 className="editorial-serif" style={{ fontSize: '24px', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Xeno.</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 20px',
                borderRadius: '100px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'white' : 'transparent',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.95rem'
              }}
            >
              <Icon size={20} color={isActive ? 'var(--primary-color)' : 'var(--text-tertiary)'} strokeWidth={isActive ? 2.5 : 2} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Exit Workspace
        </Link>
      </div>
    </div>
  );
}
