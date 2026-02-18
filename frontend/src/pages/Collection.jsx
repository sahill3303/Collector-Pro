import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import CarCard from '../components/CarCard';
import { Search, Filter } from 'lucide-react';

/**
 * Collection Page
 * 
 * The main view for browsing the user's entire car collection.
 * Features:
 * - Search functionality (by name).
 * - Filtering by Type (Mainline, Premium, etc.).
 * - Filtering by Status (Owned, Sold, Traded).
 * - Responsive grid layout for displaying cars.
 */
const Collection = () => {
    // Access car data from context
    const { cars } = useCollection();

    // Local state for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    /**
     * Filter Logic
     * Combines search term and dropdown filters to return matching cars.
     */
    const filteredCars = cars.filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || car.type === filterType;
        const matchesStatus = filterStatus === 'All' || car.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const types = ['Mainline', 'Premium', 'Silver Series', 'Fantasy', 'Other'];

    return (
        <div className="animate-entrance">

            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>My Collection</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                    Manage and view all your Hot Wheels.
                </p>
            </div>

            {/* 
               --- Control Panel --- 
               Contains Search bar and Filter dropdowns.
            */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

                    {/* Search Input */}
                    <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
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

                    {/* Filter Dropdowns */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <Filter size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: 'var(--color-text-muted)' }} />
                            <select
                                className="form-select"
                                style={{ width: '160px', paddingLeft: '2.2rem' }}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <select
                            className="form-select"
                            style={{ width: '160px' }}
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

            {/* 
               --- Cars Grid --- 
               Displays the filtered list of cars.
            */}
            {filteredCars.length > 0 ? (
                <div className="grid-layout">
                    {filteredCars.map((car, index) => (
                        <div key={car.id} style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }} className="animate-entrance">
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            ) : (
                // Empty State
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                    <p style={{ fontSize: '1.1rem' }}>No cars found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterStatus('All'); }}
                        className="btn btn-outline"
                        style={{ marginTop: '1rem' }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Collection;
