const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Car = require('../models/Car');

/**
 * @route   GET api/cars
 * @desc    Get all cars for the logged-in user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        // Fetch cars associated with the user ID, sorted by newest first
        const cars = await Car.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(cars);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   POST api/cars
 * @desc    Add a new car
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
    try {
        const newCar = new Car({
            ...req.body,
            userId: req.user.id // Associate car with logged-in user
        });

        const car = await newCar.save();
        res.json(car);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT api/cars/:id
 * @desc    Update an existing car
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) return res.status(404).json({ msg: 'Car not found' });

        // Ensure user owns the car before updating
        if (car.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update logic
        car = await Car.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(car);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   DELETE api/cars/:id
 * @desc    Delete a car
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) return res.status(404).json({ msg: 'Car not found' });

        // Ensure user owns the car before deleting
        if (car.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Car.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Car removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
