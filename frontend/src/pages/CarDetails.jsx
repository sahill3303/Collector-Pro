import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';
import { ArrowLeft, Edit2, DollarSign, RefreshCw, Trash2, Calendar, FileText } from 'lucide-react';
import SellModal from '../components/SellModal';


const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cars, deleteCar, sellCar, loading } = useCollection();

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            await deleteCar(id);
            navigate('/collection');
        }
    };

    const handleSell = async (sellPrice) => {
        await sellCar(id, sellPrice);
        setShowSell(false);
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading details...</div>;

    const car = cars.find(c => c.id === id);

    const [showSell, setShowSell] = useState(false);

    if (!car) return <div className="container" style={{ padding: '2rem' }}>Car not found.</div>;

    return (
        <div className="animate-entrance" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <button onClick={() => navigate('/collection')} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0, color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={18} /> Back to Collection
            </button>

            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', minHeight: '500px' }}>

                    {/* Image Section */}
                    <div style={{
                        background: '#f1f5f9',
                        backgroundImage: `url(${car.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        minHeight: '300px'
                    }}>
                        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                            <span className={`badge badge-${car.condition?.toLowerCase()}`} style={{ marginRight: '0.5rem' }}>
                                {car.status}
                            </span>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.9)' }}>
                                {car.condition}
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <div>
                                <span style={{ color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.875rem' }}>
                                    {car.type}
                                </span>
                                <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', margin: '0.25rem 0' }}>{car.name}</h1>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/edit/${car.id}`} className="btn btn-outline btn-icon" title="Edit">
                                    <Edit2 size={18} />
                                </Link>
                                <button onClick={handleDelete} className="btn btn-outline btn-icon" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: 'var(--color-border)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    <DollarSign size={16} /> Purchase Details
                                </h4>
                                <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹{car.purchasePrice?.toLocaleString('en-IN')}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Bought on {car.purchaseDate}</p>
                            </div>

                            {car.status === 'Sold' && (
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        <DollarSign size={16} /> Sale Details
                                    </h4>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-success)' }}>
                                        ₹{car.soldPrice?.toLocaleString('en-IN')}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                        Profit: <span style={{ color: (car.soldPrice - car.purchasePrice) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            ₹{(car.soldPrice - car.purchasePrice).toLocaleString('en-IN')}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {car.status === 'Traded' && (
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                        <RefreshCw size={16} /> Trade Info
                                    </h4>
                                    <p style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>Traded for: {car.tradedWith}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Value: ₹{car.tradeValue?.toLocaleString('en-IN')}</p>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                <FileText size={16} /> Notes
                            </h4>
                            <p style={{ lineHeight: '1.6', background: 'var(--color-background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                {car.notes || 'No notes added.'}
                            </p>
                        </div>

                        {/* Actions */}
                        {car.status === 'Owned' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button onClick={() => setShowSell(true)} className="btn btn-primary" style={{ flex: 1, padding: '0.8rem' }}>
                                    <DollarSign size={18} /> Sell Car
                                </button>
                                <button onClick={() => navigate(`/add?tradeSourceId=${car.id}`)} className="btn btn-outline" style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderColor: 'var(--color-text-main)',
                                    color: 'var(--color-text-main)',
                                    background: 'var(--color-surface)'
                                }}>
                                    <RefreshCw size={18} /> Trade Car
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
