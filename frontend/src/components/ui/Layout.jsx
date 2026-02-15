import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backdropFilter: 'blur(12px)', // Ensure header is also glassy
                WebkitBackdropFilter: 'blur(12px)'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img src="/logo.png" alt="HW" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                            Collector Pro
                        </span>
                    </div>

                    <nav className="desktop-nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            style={navLinkStyle}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/collection"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            style={navLinkStyle}
                        >
                            <Car size={20} />
                            <span>Collection</span>
                        </NavLink>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <NavLink to="/add" className="btn btn-primary header-actions" style={{ textDecoration: 'none' }}>
                            <PlusCircle size={18} />
                            <span>Add Car</span>
                        </NavLink>

                        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                                <div style={{ padding: '0.5rem', background: 'var(--color-surface)', borderRadius: '50%', border: '1px solid var(--color-border)' }}>
                                    <User size={16} />
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.username}</span>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn btn-outline btn-icon"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="btn btn-outline btn-icon"
                                title="Sign Out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container" style={{ flex: 1, paddingBlock: '2rem' }}>
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-nav">
                <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/collection" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <Car />
                    <span>My Cars</span>
                </NavLink>
                <NavLink to="/add" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <PlusCircle />
                    <span>Add</span>
                </NavLink>
            </nav>

            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
            }}>
                © {new Date().getFullYear()} HW Collector Pro. Manage your collection.
            </footer>
        </div>
    );
};

// Inline helper for now, usually would go to CSS or stay here if specific
const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
    fontWeight: isActive ? 600 : 500,
    transition: 'color 0.2s'
});

export default Layout;
