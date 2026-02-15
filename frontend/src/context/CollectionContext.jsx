import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CollectionContext = createContext();

export const useCollection = () => {
  return useContext(CollectionContext);
};

export const CollectionProvider = ({ children }) => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    if (user) {
      try {
        const res = await api.get('/cars');
        setCars(res.data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        // Optionally handle error state
      }
    } else {
      setCars([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, [user]);

  // Actions
  const addCar = async (carData) => {
    try {
      const res = await api.post('/cars', carData);
      setCars(prev => [res.data, ...prev]);
      return res.data; // Return the new car
    } catch (err) {
      console.error('Error adding car:', err);
      alert('Failed to add car');
      return null;
    }
  };

  const updateCar = async (id, updates) => {
    try {
      const res = await api.put(`/cars/${id}`, updates);
      setCars(prev => prev.map(car => (car.id === id ? res.data : car)));
    } catch (err) {
      console.error('Error updating car:', err);
      alert('Failed to update car');
    }
  };

  const deleteCar = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (err) {
      console.error('Error deleting car:', err);
      alert('Failed to delete car');
    }
  };

  const sellCar = async (id, saleDetails) => {
    updateCar(id, {
      status: 'Sold',
      soldPrice: parseFloat(saleDetails.price),
      soldDate: saleDetails.date
    });
  };

  const tradeCar = async (id, tradeDetails) => {
    updateCar(id, {
      status: 'Traded',
      tradedWith: tradeDetails.tradedWith,
      tradeValue: parseFloat(tradeDetails.value),
      tradeDate: tradeDetails.date
    });
  };

  // Dashboard Stats Helpers
  const getStats = () => {
    const owned = cars.filter(c => c.status === 'Owned');
    const sold = cars.filter(c => c.status === 'Sold');
    const traded = cars.filter(c => c.status === 'Traded');

    const totalInvested = cars.reduce((acc, curr) => acc + (parseFloat(curr.purchasePrice) || 0), 0);
    const totalSoldValue = sold.reduce((acc, curr) => acc + (curr.soldPrice || 0), 0);
    const totalProfit = totalSoldValue - sold.reduce((acc, curr) => acc + (parseFloat(curr.purchasePrice) || 0), 0);

    return {
      totalOwned: owned.length,
      totalInvested,
      totalProfit,
      totalRevenue: totalSoldValue, // Added totalRevenue
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
