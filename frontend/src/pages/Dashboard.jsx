import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { TrendingUp, DollarSign, Car, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';

/**
 * Dashboard Page
 * 
 * Displays an overview of the user's collection including:
 * 1. Key Statistics (Total cars, investment, revenue, profit).
 * 2. Recent Activity (The 4 most recently added cars).
 */
const Dashboard = () => {
    // Fetch stats and car data from Collection Context
    const { stats, cars } = useCollection();

    // Get the 4 most recently added cars for the "Quick View" section
    const recentCars = cars.slice(0, 4);

    return (
        <div className="animate-entrance" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* Header Section */}
            <div>
                <h1 style={{ marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Dashboard</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                    Overview of your collection performance.
                </p>
            </div>

            {/* 
               --- Statistics Grid --- 
               Displays cards with summary data.
            */}
            <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Total Cars Owned"
                    value={stats.totalOwned}
                    icon={<Car size={24} strokeWidth={2} />}
                    variant="blue"
                />
                <StatCard
                    title="Total Invested"
                    value={`₹${stats.totalInvested.toLocaleString('en-IN')}`}
                    icon={<DollarSign size={24} strokeWidth={2} />}
                    variant="slate"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
                    icon={<DollarSign size={24} strokeWidth={2} />}
                    variant="purple"
                    subValue="Gross sales"
                />
                <StatCard
                    title="Net Your Profit"
                    value={`₹${stats.totalProfit.toLocaleString('en-IN')}`}
                    icon={<TrendingUp size={24} strokeWidth={2} />}
                    variant={stats.totalProfit >= 0 ? "success" : "danger"}
                    subValue="Realized profit"
                />
            </div>

            {/* 
               --- Recent Activity Section --- 
               Shows a glimpse of the collection.
            */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Recently Added</h2>
                    <Link to="/collection" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                        View All
                    </Link>
                </div>

                {recentCars.length > 0 ? (
                    <div className="grid-layout">
                        {recentCars.map((car, index) => (
                            <div key={car.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-entrance">
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p>No cars in your collection yet.</p>
                        <Link to="/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Add First Car
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
};

/**
 * StatCard Component
 * 
 * Reusable component for displaying a single statistic.
 * 
 * @param {string} title - The label for the stat.
 * @param {string|number} value - The main value to display.
 * @param {ReactNode} icon - Icon component.
 * @param {string} variant - Theme color variant (blue, slate, purple, success, danger).
 * @param {string} [subValue] - Optional helper text below the value.
 */
const StatCard = ({ title, value, icon, variant, subValue }) => {
    // Helper to determine styles based on variant
    const getVariantStyles = (v) => {
        const variants = {
            blue: { bg: '#eff6ff', text: '#3b82f6', border: '#dbeafe' },
            slate: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' }, // Standard
            purple: { bg: '#f3e8ff', text: '#9333ea', border: '#e9d5ff' },
            success: { bg: '#ecfdf5', text: '#10b981', border: '#d1fae5' },
            danger: { bg: '#fef2f2', text: '#ef4444', border: '#fee2e2' },
        };
        // fallback to slate if variant not found
        return variants[v] || variants.slate;
    };

    const styles = getVariantStyles(variant);

    return (
        <div className="card" style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            // Specific overrides for stats cards if needed
        }}>
            <div>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>{title}</p>

                <h3 style={{
                    fontSize: '1.85rem',
                    marginBottom: '0.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)'
                }}>{value}</h3>

                {subValue && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {subValue}
                    </span>
                )}
            </div>

            <div style={{
                padding: '0.75rem',
                borderRadius: '12px',
                background: styles.bg,
                color: styles.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // In dark mode we might want to adjust these backgrounds
                // For simplified "glass" feel, we could use transparency
            }}>
                {icon}
            </div>
        </div>
    );
};

export default Dashboard;

