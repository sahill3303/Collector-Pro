import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import CarCard from '../components/CarCard';
import { Search, Filter } from 'lucide-react';

const Collection = () => {
    const { cars } = useCollection();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Filter Logic
    const filteredCars = cars.filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || car.type === filterType;
        const matchesStatus = filterStatus === 'All' || car.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const types = ['Mainline', 'Premium', 'Silver Series', 'Fantasy', 'Other'];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>My Collection</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage and view all your Hot Wheels.</p>
            </div>

            {/* Controls */}
            <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

                    {/* Search */}
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search cars..."
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            className="form-select"
                            style={{ width: '150px' }}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <select
                            className="form-select"
                            style={{ width: '150px' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Owned">Owned</option>
                            <option value="Sold">Sold</option>
                            <option value="Traded">Traded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {filteredCars.length > 0 ? (
                <div className="grid-layout animate-entrance">
                    {filteredCars.map((car, index) => (
                        <div key={car.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-pop">
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                    <p>No cars found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Collection;
