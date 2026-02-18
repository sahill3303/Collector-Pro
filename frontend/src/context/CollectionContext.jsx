import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CollectionContext = createContext();

export const useCollection = () => {
  return useContext(CollectionContext);
};

/**
 * CollectionProvider
 * 
 * Manages the data state for the user's car collection.
 * - Fetches cars from the backend.
 * - Provides CRUD operations (add, update, delete).
 * - Provides specialized actions like 'sell' and 'trade'.
 * - Calculates aggregated statistics for the Dashboard.
 */
export const CollectionProvider = ({ children }) => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cars when the user is authenticated
  const fetchCars = async () => {
    if (user) {
      try {
        const res = await api.get('/cars');
        setCars(res.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
      }
    } else {
      setCars([]); // Clear cars if user logs out
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, [user]);

  // --- Actions ---

  /**
   * Add a new car to the collection
   */
  const addCar = async (carData) => {
    try {
      const res = await api.post('/cars', carData);
      setCars(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error('Error adding car:', err);
      alert('Failed to add car');
      return null;
    }
  };

  /**
   * Update an existing car
   */
  const updateCar = async (id, updates) => {
    try {
      const res = await api.put(`/cars/${id}`, updates);
      setCars(prev => prev.map(car => (car.id === id ? res.data : car)));
    } catch (err) {
      console.error('Error updating car:', err);
      alert('Failed to update car');
    }
  };

  /**
   * Delete a car
   */
  const deleteCar = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Failed to delete car');
    }
  };

  /**
   * Mark a car as Sold
   */
  const sellCar = async (id, saleDetails) => {
    updateCar(id, {
      status: 'Sold',
      soldPrice: parseFloat(saleDetails.price),
      soldDate: saleDetails.date
    });
  };

  /**
   * Mark a car as Traded
   */
  const tradeCar = async (id, tradeDetails) => {
    updateCar(id, {
      status: 'Traded',
      tradedWith: tradeDetails.tradedWith,
      tradeValue: parseFloat(tradeDetails.value),
      tradeDate: tradeDetails.date
    });
  };

  // --- Statistics Helpers ---

  /**
   * Computes derived stats from the current cars array.
   * Runs on every render, but fast enough for this dataset size.
   */
  const getStats = () => {
    const owned = cars.filter(c => c.status === 'Owned');
    const sold = cars.filter(c => c.status === 'Sold');
    const traded = cars.filter(c => c.status === 'Traded');

    const totalInvested = cars.reduce((acc, curr) => acc + (parseFloat(curr.purchasePrice) || 0), 0);
    const totalSoldValue = sold.reduce((acc, curr) => acc + (curr.soldPrice || 0), 0);

    // Profit = Revenue - Cost (only for items that are sold)
    const totalProfit = totalSoldValue - sold.reduce((acc, curr) => acc + (parseFloat(curr.purchasePrice) || 0), 0);

    return {
      totalOwned: owned.length,
      totalInvested,
      totalProfit,
      totalRevenue: totalSoldValue,
      soldCount: sold.length,
      tradedCount: traded.length
    };
  };

  return (
    <CollectionContext.Provider value={{
      cars,
      addCar,
      updateCar,
      deleteCar,
      sellCar,
      tradeCar,
      stats: getStats(),
      loading
    }}>
      {children}
    </CollectionContext.Provider>
  );
};
