import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { TrendingUp, DollarSign, Car, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { stats, cars } = useCollection();

    // Get recent 4 cars
    const recentCars = cars.slice(0, 4);

    return (
        <div className="animate-entrance" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Overview of your collection performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid-layout stagger-1 animate-entrance" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <StatCard
                    title="Total Cars Owned"
                    value={stats.totalOwned}
                    icon={<Car size={24} />}
                    color="blue"
                />
                <StatCard
                    title="Total Invested"
                    value={`₹${stats.totalInvested.toLocaleString('en-IN')}`}
                    icon={<DollarSign size={24} />}
                    color="slate"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
                    icon={<DollarSign size={24} />}
                    color="purple"
                    subValue="Gross sales"
                />
                <StatCard
                    title="Net Profit/Loss"
                    value={`₹${stats.totalProfit.toLocaleString('en-IN')}`}
                    icon={<TrendingUp size={24} />}
                    color={stats.totalProfit >= 0 ? "green" : "red"}
                    subValue="From sold items"
                />
                <StatCard
                    title="Sold / Traded"
                    value={`${stats.soldCount} / ${stats.tradedCount}`}
                    icon={<Package size={24} />}
                    color="orange"
                />
            </div>

            {/* Recent Activity / Quick View */}
            <section className="stagger-2 animate-entrance">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Recently Added</h2>
                    <Link to="/collection" className="btn btn-outline">View All</Link>
                </div>

                <div className="grid-layout">
                    {recentCars.map((car, index) => (
                        <div key={car.id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', animationDelay: `${index * 100}ms` }}>
                            <div style={{
                                width: '80px',
                                height: '60px',
                                background: '#f1f5f9',
                                borderRadius: '8px',
                                flexShrink: 0,
                                backgroundImage: `url(${car.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} />
                            <div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{car.name}</h4>
                                <span className={`badge badge-${car.condition.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                                    {car.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, subValue }) => {
    const getColors = (c) => {
        switch (c) {
            case 'blue': return { bg: '#eff6ff', text: '#3b82f6' };
            case 'green': return { bg: '#ecfdf5', text: '#10b981' };
            case 'red': return { bg: '#fef2f2', text: '#ef4444' };
            case 'orange': return { bg: '#fff7ed', text: '#f97316' };
            case 'purple': return { bg: '#f3e8ff', text: '#9333ea' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    }

    const colors = getColors(color);

    return (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</p>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{value}</h3>
                {subValue && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{subValue}</span>}
            </div>
            <div style={{
                padding: '0.75rem',
                borderRadius: '12px',
                background: colors.bg,
                color: colors.text
            }}>
                {icon}
            </div>
        </div>
    );
};

export default Dashboard;
