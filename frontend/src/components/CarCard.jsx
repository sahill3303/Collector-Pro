import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CarCard Component
 * 
 * A reusable card component to display individual car details in a grid.
 * DESIGN: Modern, simplistic, glassmorphism-inspired.
 * 
 * @param {Object} car - The car data object containing name, image, price, status, etc.
 */
const CarCard = ({ car }) => {
    // Helper to get consistent badge styles based on car Status
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Owned': return { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }; // Emerald
            case 'Sold': return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }; // Red
            case 'Traded': return { background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.2)' }; // Orange
            default: return { background: 'var(--color-background)', color: 'var(--color-text-muted)' };
        }
    };

    /**
     * Card Container Style
     * Uses dynamic color mixing if a custom color is defined for the car,
     * otherwise falls back to the default glass surface.
     */
    const cardStyle = {
        background: car.color
            ? `linear-gradient(145deg, color-mix(in srgb, ${car.color}, var(--color-surface) 90%), color-mix(in srgb, ${car.color}, var(--color-surface) 95%))`
            : 'var(--color-surface)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none' // Ensure link styles don't conflict
    };

    return (
        <Link to={`/car/${car.id}`} className="card" style={cardStyle}>

            {/* 
              --- Image Section --- 
              Dominates the top of the card for visual impact.
            */}
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9', // Fixed aspect ratio for consistency
                backgroundColor: 'var(--color-background)',
                borderBottom: '1px solid var(--color-border)',
                overflow: 'hidden'
            }}>
                {car.image ? (
                    <img
                        src={car.image}
                        alt={car.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                        }}
                        className="card-image" // Helper class for hover zoom effects if added globally
                    />
                ) : (
                    // Placeholder State
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>No Image</span>
                    </div>
                )}

                {/* Status Badge Overlaid on Image */}
                <span className="badge" style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backdropFilter: 'blur(8px)',
                    ...getStatusStyle(car.status),
                    background: 'var(--color-surface)', // Override transparency for legibility on image
                }}>
                    {car.status}
                </span>
            </div>

            {/* 
              --- Content Section --- 
              Minimal textual details.
            */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Car Type (Small Label) */}
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    {car.type}
                </div>

                {/* Car Name */}
                <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    lineHeight: 1.3,
                    color: 'var(--color-text-main)' // Ensure text contrast
                }}>
                    {car.name}
                </h3>

                {/* Price / Value Display */}
                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                        ₹{car.purchasePrice?.toLocaleString('en-IN') || 0}
                    </div>

                    {/* Condition Indicator */}
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', background: 'var(--color-background)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {car.condition}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;

