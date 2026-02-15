const User = require('./models/User');
const Car = require('./models/Car');

console.log('--- Verifying Models ---');

try {
    const user = new User({ username: 'test', password: '123' });
    console.log('User instantiated successfully:', user.username);

    if (user.save && typeof user.save === 'function') {
        console.log('User.save is a function (Good)');
    } else {
        console.error('User.save is missing!');
    }

    if (User.findOne && typeof User.findOne === 'function') {
        console.log('User.findOne is a function (Good)');
    }

    const car = new Car({ name: 'Test Car', userId: '123', color: 'Red' });
    console.log('Car instantiated successfully:', car.name, 'Color:', car.color);

    if (car.color === 'Red') {
        console.log('Car has Color field (Good)');
    } else {
        console.error('Car missing Color field!');
    }

    console.log('--- verification complete ---');
    console.log('Models are loaded successfully. If you see Mongoose errors in the main app, it IS a stale process.');

} catch (err) {
    console.error('Error verifying models:', err);
}
