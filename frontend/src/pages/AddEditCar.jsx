import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';
import { Upload, ArrowLeft, Save, RefreshCw } from 'lucide-react';

const AddEditCar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const tradeSourceId = searchParams.get('tradeSourceId');
    const { addCar, updateCar, tradeCar, cars, loading } = useCollection();

    const [formData, setFormData] = useState({
        name: '',
        color: '', // Added color state
        type: 'Mainline',
        purchasePrice: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        condition: 'Mint',
        notes: '',
        image: null // Photo is optional
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (id && cars.length > 0) {
            const carToEdit = cars.find(c => c.id === id);
            if (carToEdit) {
                setFormData({
                    name: carToEdit.name,
                    color: carToEdit.color || '', // Added color
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, upload to server/storage. Here use FileReader for local preview.
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate
        if (!formData.name) return alert('Name is required');

        const carData = {
            ...formData,
            purchasePrice: parseFloat(formData.purchasePrice) || 0
        };

        if (id) {
            await updateCar(id, carData);
            navigate('/collection');
        } else {
            // Add new car
            const newCar = await addCar(carData);

            // If this is a trade, mark the source car as traded
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
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0, color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {tradeSourceId && <RefreshCw size={28} className="text-orange-500" />}
                    {id ? 'Edit Car' : tradeSourceId ? 'Trade In Car' : 'Add New Car'}
                </h1>

                {tradeSourceId && (
                    <div className="alert" style={{ background: '#fff7ed', color: '#9a3412', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fed7aa' }}>
                        You are adding a new car received from trading logic. The old car will be marked as <strong>Traded</strong>.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-split">

                        {/* Left Column: Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Car Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g. '67 Camaro"
                                    required
                                />
                            </div>

                            {/* Added Color Input with Picker */}
                            <div className="form-group">
                                <label className="form-label">Color</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color || '#000000'}
                                        onChange={handleChange}
                                        style={{ width: '50px', height: '40px', padding: '0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        name="color" // Keep name same to sync? Or maybe handle manually.
                                        // Actually if I use same name, text input might override hex.
                                        // Let's rely on the text input for "value" and picker for updating it.
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Pick a color or type e.g. #ff0000"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                                        <option value="Mainline">Mainline</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Silver Series">Silver Series</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Condition</label>
                                    <select name="condition" value={formData.condition} onChange={handleChange} className="form-select">
                                        <option value="Mint">Mint (Carded)</option>
                                        <option value="Good">Good</option>
                                        <option value="Opened">Opened / Loose</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Purchase Price (₹)</label>
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
                                    <label className="form-label">Purchase Date</label>
                                    <input
                                        name="purchaseDate"
                                        type="date"
                                        value={formData.purchaseDate}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes</label>
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

                        {/* Right Column: Image (Optional/Temporary) */}
                        <div>
                            <label className="form-label">Photo (Optional)</label>
                            <div
                                style={{
                                    border: '2px dashed var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    height: '250px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--color-background)',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <Upload size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }} />
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Click to upload</span>
                                    </>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                                Supported: JPG, PNG
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} /> Save Car
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditCar;
