import { Bookmark, Quote, UsersRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Quotes', icon: Quote, end: true },
  { to: '/characters', label: 'Characters', icon: UsersRound },
  { to: '/favorites', label: 'Saved', icon: Bookmark },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <NavLink to="/" className="brand" aria-label="Springfield Lines home">
          <span className="brand-mark"><Quote size={20} /></span>
          <span>Springfield Lines<small>Quotes &amp; Characters</small></span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <span className="api-status">Springfield data</span>
      </div>
    </header>
  );
}
