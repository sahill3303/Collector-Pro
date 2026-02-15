import React, { useState } from 'react';

const SellModal = ({ isOpen, onClose, onConfirm, carName }) => {
    const [sellingPrice, setSellingPrice] = useState('');
    const [sellingDate, setSellingDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ price: sellingPrice, date: sellingDate });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Sell Car</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                    Mark <strong>{carName}</strong> as sold.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Selling Price (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date Sold</label>
                        <input
                            type="date"
                            className="form-input"
                            value={sellingDate}
                            onChange={(e) => setSellingDate(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary">Confirm Sale</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellModal;
