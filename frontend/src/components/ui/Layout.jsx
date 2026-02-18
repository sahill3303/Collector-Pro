import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

/**
 * Layout Component
 * 
 * This component serves as the main shell for the authenticated part of the application.
 * It includes:
 * 1. A sticky Header with Logo, Navigation, and User Actions.
 * 2. A Main Content area where page content is rendered via <Outlet />.
 * 3. A responsive Mobile Navigation bar fixed at the bottom.
 */
const Layout = () => {
    // Access authentication context
    const { user, logout } = useAuth();
    // Access theme context
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Handler for user logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* 
              --- Sticky Header ---
              Uses glassmorphism effects via CSS variables.
            */}
            <header style={{
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(var(--backdrop-blur))',
                WebkitBackdropFilter: 'blur(var(--backdrop-blur))'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

                    {/* Brand / Logo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--color-primary)', // Brand color background
                            borderRadius: '8px',
                            color: 'white'
                        }}>
                            {/* Placeholder Icon if no image */}
                            <Car size={20} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                            Collector<span style={{ color: 'var(--color-primary)' }}>Pro</span>
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="desktop-nav" style={{ gap: '2.5rem' }}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={navLinkStyle}
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/collection"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={navLinkStyle}
                        >
                            <Car size={18} />
                            <span>Collection</span>
                        </NavLink>
                    </nav>

                    {/* User Actions (Add Car, Profile, Theme, Logout) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                        {/* Primary Action: Add Car */}
                        <NavLink to="/add" className="btn btn-primary header-actions" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                            <PlusCircle size={16} />
                            <span>Add Car</span>
                        </NavLink>

                        <div className="header-actions" style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 0.5rem' }}></div>

                        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {/* User Profile Indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user?.username}</span>
                            </div>

                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="btn-ghost"
                                title="Toggle Theme"
                                style={{ borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="btn-ghost"
                                title="Sign Out"
                                style={{ borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container" style={{ flex: 1, paddingBlock: '2.5rem' }}>
                {/* Renders the child route element */}
                <Outlet />
            </main>

            {/* 
              --- Mobile Bottom Navigation ---
              Visible only on small screens via CSS media queries in index.css
            */}
            <nav className="mobile-nav">
                <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/collection" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <Car size={20} />
                    <span>Collection</span>
                </NavLink>
                <NavLink to="/add" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <PlusCircle size={20} />
                    <span>Add</span>
                </NavLink>
                <button onClick={toggleTheme} className="mobile-nav-item">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>Theme</span>
                </button>
                <button onClick={handleLogout} className="mobile-nav-item" style={{ color: 'var(--color-danger)' }}>
                    <LogOut size={20} />
                    <span>Exit</span>
                </button>
            </nav>

        </div>
    );
};

// Helper for NavLink styling logic
const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
    fontWeight: isActive ? 600 : 500,
    transition: 'color 0.2s',
    fontSize: '0.9rem',
    padding: '0.5rem'
});

export default Layout;

