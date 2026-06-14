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
    <div className="sidebar" style={{ backgroundColor: 'var(--surface-color)' }}>
      <div className="sidebar-logo-container" style={{ marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '8px' }}>
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
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} color={isActive ? 'var(--primary-color)' : 'var(--text-tertiary)'} strokeWidth={isActive ? 2.5 : 2} />
              {link.name}
            </Link>
          );
        })}
        
        <div className="mobile-exit" style={{ display: 'none' }}>
           <Link to="/" className="sidebar-link">
             <ArrowLeft size={20} color="var(--text-tertiary)" strokeWidth={2} />
             Exit
           </Link>
        </div>
      </nav>

      <div className="sidebar-bottom" style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
        <Link to="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
          <ArrowLeft size={16} /> Exit Workspace
        </Link>
      </div>
    </div>
  );
}
