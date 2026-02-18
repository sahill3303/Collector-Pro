import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';
import { ArrowLeft, Edit2, DollarSign, RefreshCw, Trash2, Calendar, FileText } from 'lucide-react';
import SellModal from '../components/SellModal';

/**
 * CarDetails Page
 * 
 * Displays full information about a specific car.
 * Actions available:
 * - Edit Car details.
 * - Delete Car.
 * - Sell Car (updates status to 'Sold' and records sale price).
 * - Trade Car (initiates a trade flow).
 */
const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cars, deleteCar, sellCar, loading } = useCollection();

    // Find the specific car from the context
    const car = cars.find(c => c.id === id);

    const [showSell, setShowSell] = useState(false);

    // Handle Delete Action
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
            await deleteCar(id);
            navigate('/collection');
        }
    };

    // Handle Sell Action (triggered from Modal)
    const handleSell = async (sellPrice) => {
        await sellCar(id, sellPrice);
        setShowSell(false);
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading details...</div>;
    if (!car) return <div className="container" style={{ padding: '2rem' }}>Car not found.</div>;

    return (
        <div className="animate-entrance" style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* Navigation Back */}
            <button onClick={() => navigate('/collection')} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0, color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={18} /> Back to Collection
            </button>

            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', minHeight: '500px' }}>

                    {/* Left Panel: Hero Image */}
                    <div style={{
                        background: 'var(--color-surface)',
                        backgroundImage: `url(${car.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        minHeight: '300px',
                        borderRight: '1px solid var(--color-border)'
                    }}>
                        {/* Overlay Gradient for text readability at bottom */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0, left: 0, right: 0,
                            height: '80px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                        }}></div>

                        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                            <span className="badge" style={{
                                background: 'rgba(255,255,255,0.95)',
                                color: '#000',
                                fontWeight: 700,
                                marginRight: '0.5rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                {car.status}
                            </span>
                            <span className="badge" style={{
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                {car.condition}
                            </span>
                        </div>
                    </div>

                    {/* Right Panel: Detailed Info */}
                    <div style={{ padding: '3rem 2.5rem' }}>

                        {/* Header: Title & Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                                    {car.type}
                                </span>
                                <h1 style={{ fontSize: '2.5rem', lineHeight: '1.1', margin: '0.5rem 0 0 0', fontWeight: 800 }}>{car.name}</h1>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/edit/${car.id}`} className="btn btn-outline btn-icon" title="Edit Car">
                                    <Edit2 size={18} />
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-outline btn-icon"
                                    style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                                    title="Delete Car"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'var(--color-border)', margin: '2rem 0' }} />

                        {/* Financials Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <DollarSign size={16} /> Purchase Info
                                </h4>
                                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                    ₹{car.purchasePrice?.toLocaleString('en-IN')}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={14} /> {car.purchaseDate}
                                </p>
                            </div>

                            {/* Conditional Rendering based on Status */}
                            {car.status === 'Sold' && (
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                        <DollarSign size={16} /> Sale Info
                                    </h4>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success)' }}>
                                        ₹{car.soldPrice?.toLocaleString('en-IN')}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                        Net Profit: <span style={{ fontWeight: 600, color: (car.soldPrice - car.purchasePrice) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            ₹{(car.soldPrice - car.purchasePrice).toLocaleString('en-IN')}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {car.status === 'Traded' && (
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                        <RefreshCw size={16} /> Trade Info
                                    </h4>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Swapped for: {car.tradedWith}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>est. Value: ₹{car.tradeValue?.toLocaleString('en-IN')}</p>
                                </div>
                            )}
                        </div>

                        {/* Notes Section */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <FileText size={16} /> Notes
                            </h4>
                            <div style={{
                                lineHeight: '1.7',
                                background: 'var(--color-background)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-secondary)',
                                border: '1px solid var(--color-border)'
                            }}>
                                {car.notes || 'No notes added for this car.'}
                            </div>
                        </div>

                        {/* Primary Actions (Sell/Trade) - Only if Owned */}
                        {car.status === 'Owned' && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setShowSell(true)} className="btn btn-primary" style={{ flex: 1, padding: '1rem', justifyContent: 'center' }}>
                                    <DollarSign size={18} /> Sell Car
                                </button>
                                <button onClick={() => navigate(`/add?tradeSourceId=${car.id}`)} className="btn btn-outline" style={{
                                    flex: 1,
                                    padding: '1rem',
                                    justifyContent: 'center',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-main)',
                                }}>
                                    <RefreshCw size={18} /> Trade In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sell Logic Modal */}
            <SellModal
                isOpen={showSell}
                onClose={() => setShowSell(false)}
                onConfirm={handleSell}
                carName={car.name}
            />
        </div>
    );
};

export default CarDetails;
