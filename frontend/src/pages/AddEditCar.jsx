import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';
import { Upload, ArrowLeft, Save, RefreshCw } from 'lucide-react';

/**
 * AddEditCar Page
 * 
 * A unified form component used for:
 * 1. Adding a new car.
 * 2. Editing an existing car.
 * 3. Handling "Trade-Ins" (where a new car replaces an old one).
 */
const AddEditCar = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // If present, we are in Edit mode
    const [searchParams] = useSearchParams();
    const tradeSourceId = searchParams.get('tradeSourceId'); // If present, we are in Trade mode

    // Access collection context
    const { addCar, updateCar, tradeCar, cars, loading } = useCollection();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        color: '', // Optional hex color for card styling
        type: 'Mainline',
        purchasePrice: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        condition: 'Mint',
        notes: '',
        image: null // Stores data URL of the image
    });

    const [preview, setPreview] = useState(null);

    // Effect: Load existing data if editing
    useEffect(() => {
        if (id && cars.length > 0) {
            const carToEdit = cars.find(c => c.id === id);
            if (carToEdit) {
                setFormData({
                    name: carToEdit.name,
                    color: carToEdit.color || '',
                    type: carToEdit.type,
                    purchasePrice: carToEdit.purchasePrice,
                    purchaseDate: carToEdit.purchaseDate || new Date().toISOString().split('T')[0],
                    condition: carToEdit.condition,
                    notes: carToEdit.notes || '',
                    image: carToEdit.image
                });
                setPreview(carToEdit.image);
            }
        }
    }, [id, cars]);

    if (id && loading) return <div className="container" style={{ padding: '2rem' }}>Loading car details...</div>;

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Image Upload (User FileReader to show preview immediately)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name) return alert('Name is required');

        const carData = {
            ...formData,
            purchasePrice: parseFloat(formData.purchasePrice) || 0
        };

        if (id) {
            // Update existing car
            await updateCar(id, carData);
            navigate('/collection');
        } else {
            // Add new car
            const newCar = await addCar(carData);

            // Handle Trade Logic: If this car was bought by trading another
            if (tradeSourceId && newCar) {
                await tradeCar(tradeSourceId, {
                    tradedWith: newCar.name,
                    value: newCar.purchasePrice, // Assuming trade value matches new car price
                    date: new Date().toISOString().split('T')[0]
                });
                alert('Trade completed successfully!');
            }
            navigate('/collection');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div className="card animate-entrance" style={{ padding: '2.5rem' }}>

                {/* Header */}
                <h1 style={{
                    marginBottom: '2rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1.75rem'
                }}>
                    {tradeSourceId && <RefreshCw size={28} style={{ color: 'var(--color-warning)' }} />}
                    {id ? 'Edit Car' : tradeSourceId ? 'Trade In Car' : 'Add New Car'}
                </h1>

                {/* Trade Notice Alert */}
                {tradeSourceId && (
                    <div style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        color: 'var(--color-warning)', // using warning color usually amber/orange
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '2rem',
                        border: '1px solid rgba(249, 115, 22, 0.2)'
                    }}>
                        <p style={{ fontSize: '0.9rem' }}>
                            You are adding a new car received from trading. The previous car will be automatically marked as <strong>Traded</strong>.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-split">

                        {/* Left Column: Input Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Name Input */}
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Car Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g. '67 Camaro"
                                    required
                                />
                            </div>

                            {/* Color Selector */}
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Custom Color (Optional)</label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color || '#000000'}
                                        onChange={handleChange}
                                        style={{
                                            width: '50px',
                                            height: '42px',
                                            padding: '0',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            background: 'none'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="#000000"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                    This color will tint the card background.
                                </p>
                            </div>

                            {/* Type & Condition Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                                        <option value="Mainline">Mainline</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Silver Series">Silver Series</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Condition</label>
                                    <select name="condition" value={formData.condition} onChange={handleChange} className="form-select">
                                        <option value="Mint">Mint (Carded)</option>
                                        <option value="Good">Good</option>
                                        <option value="Opened">Opened / Loose</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price & Date Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Purchase Price (₹)</label>
                                    <input
                                        name="purchasePrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.purchasePrice}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date</label>
                                    <input
                                        name="purchaseDate"
                                        type="date"
                                        value={formData.purchaseDate}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Where did you find it? Any special details?"
                                />
                            </div>
                        </div>

                        {/* Right Column: Image Upload */}
                        <div>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Photo</label>
                            <div
                                style={{
                                    border: '2px dashed var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    height: '280px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--color-surface-pure)', // lighter bg for contrast
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    transition: 'border-color 0.2s'
                                }}
                                onClick={() => document.getElementById('file-upload').click()}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                                        <div style={{
                                            width: '48px', height: '48px',
                                            background: 'var(--color-background)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1rem auto'
                                        }}>
                                            <Upload size={24} style={{ color: 'var(--color-text-muted)' }} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 500, display: 'block' }}>Upload Image</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Click to browse</span>
                                    </div>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                            <Save size={18} /> Save Car
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditCar;

