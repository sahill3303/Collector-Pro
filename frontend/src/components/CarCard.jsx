import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, DollarSign } from 'lucide-react';

const CarCard = ({ car }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Owned': return 'badge-mint';
            case 'Sold': return 'badge-good'; // Use blue for sold to differentiate? Or maybe just status based logic. Keeping simple for now. 
            // Actually standard badges: Mint (green), Good (blue), Opened (red) were for CONDITION.
            // Status badges needed.
            case 'Traded': return 'badge-opened'; // Redish?
            default: return 'badge-mint';
        }
    };

    const getStatusStyle = (status) => {
        // Sold = Red, Owned = Green, Traded = Orange
        if (status === 'Owned') return { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }; // Green
        if (status === 'Sold') return { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }; // Red
        if (status === 'Traded') return { background: '#ffedd5', color: '#c2410c', border: '1px solid #fdba74' }; // Orange
        return { background: '#f1f5f9', color: '#475569' };
    };

    const cardStyle = {
        background: car.color
            ? `linear-gradient(145deg, color-mix(in srgb, ${car.color}, var(--color-surface) 90%), color-mix(in srgb, ${car.color}, var(--color-surface) 98%))`
            : 'var(--color-surface)', // Slightly less transparent for better visibility

        // Stronger border for light mode visibility
        border: `1px solid ${car.color ? `color-mix(in srgb, ${car.color}, var(--color-border) 65%)` : 'var(--color-border-strong)'}`, // Increased mix percentage and used stronger border var
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: 'var(--color-text-main)',
        boxShadow: 'var(--shadow-md)', // Consistent shadow for visibility
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease'
    };

    return (
        <div className="card animate-pop" style={cardStyle}>
            {/* Top section: Main Info */}
            <div style={{
                padding: '1rem', // Reduced padding
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {/* Status Badge - Top Right */}
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span className="badge" style={getStatusStyle(car.status)}>
                        {car.status}
                    </span>
                </div>

                <div style={{ marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, fontWeight: 600 }}>
                        {car.type}
                    </span>
                    <h3 style={{
                        fontSize: '1.15rem', // Slightly smaller title
                        margin: '0.15rem 0',
                        fontWeight: 700,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)' // enhance text clarity 
                    }}>{car.name}</h3>
                </div>

                <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                    Condition: <span style={{ fontWeight: 500 }}>{car.condition}</span>
                </p>
                {car.notes && (
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{car.notes}"
                    </p>
                )}
            </div>

            {/* Bottom Section: Image, Price, Actions */}
            <div style={{
                padding: '0.6rem 1rem', // Compact footer
                borderTop: `1px solid ${car.color ? `color-mix(in srgb, ${car.color}, transparent 80%)` : 'var(--color-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                background: 'rgba(var(--color-background), 0.3)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Small Image Frame */}
                    <div style={{
                        width: '42px', // Slightly smaller
                        height: '42px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'var(--color-surface)', // Use theme surface
                        border: '1px solid var(--color-border)',
                        flexShrink: 0
                    }}>
                        {car.image ? (
                            <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            // Placeholder
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.6rem' }}>
                                No Pic
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>Paid</span>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                            ₹{car.purchasePrice?.toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>

                {/* View Button - Stronger border/visuals */}
                <Link to={`/car/${car.id}`} className="btn" style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid var(--color-text-secondary)', // Visible border
                    color: 'var(--color-text-main)',
                    background: 'rgba(255,255,255,0.1)'
                }}>
                    View
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
