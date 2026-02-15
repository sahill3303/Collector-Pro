const db = require('../utils/jsonDB');
const { v4: uuidv4 } = require('uuid');

class Car {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.userId = data.userId;
        this.name = data.name;
        this.type = data.type;
        this.purchasePrice = data.purchasePrice;
        this.purchaseDate = data.purchaseDate;
        this.condition = data.condition;
        this.color = data.color; // Added color field
        this.image = data.image; // Image is now optional
        this.status = data.status || 'Owned';
        this.notes = data.notes;
        this.soldPrice = data.soldPrice;
        this.soldDate = data.soldDate;
        this.tradedWith = data.tradedWith;
        this.tradeValue = data.tradeValue;
        this.tradeDate = data.tradeDate;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static find(query) {
        const cars = db.getCollection('cars');
        let filtered = cars.filter(c => {
            return Object.keys(query).every(key => c[key] === query[key]);
        });

        // Return a thenable object with sort method to mock Mongoose chain
        const queryObj = {
            sort: (sortOptions) => {
                if (sortOptions.createdAt === -1) {
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                return queryObj;
            },
            then: (resolve, reject) => {
                resolve(filtered);
            }
        };
        return queryObj;
    }

    static async findById(id) {
        const cars = db.getCollection('cars');
        const car = cars.find(c => c.id === id);
        return car ? new Car(car) : null;
    }

    static async findByIdAndUpdate(id, update, options) {
        const cars = db.getCollection('cars');
        const index = cars.findIndex(c => c.id === id);

        if (index === -1) return null;

        const currentCar = cars[index];
        const updates = update.$set || update; // Handle $set operator if present

        const updatedCarData = {
            ...currentCar,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        cars[index] = updatedCarData;
        db.saveCollection('cars', cars);

        return new Car(updatedCarData);
    }

    static async findByIdAndDelete(id) {
        const cars = db.getCollection('cars');
        const filteredCars = cars.filter(c => c.id !== id);

        if (cars.length === filteredCars.length) return null; // Nothing deleted

        db.saveCollection('cars', filteredCars);
        return { msg: 'Car deleted' };
    }

    async save() {
        const cars = db.getCollection('cars');
        const existingIndex = cars.findIndex(c => c.id === this.id);

        const carData = { ...this }; // Convert instance to plain object

        if (existingIndex !== -1) {
            cars[existingIndex] = carData;
        } else {
            cars.push(carData);
        }

        db.saveCollection('cars', cars);
        return this;
    }
}

module.exports = Car;
