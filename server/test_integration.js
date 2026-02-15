const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const testUser = {
    username: 'test_json_db_' + Date.now(),
    password: 'password123'
};
let token = '';
let carId = '';

async function runTests() {
    try {
        console.log('--- Starting Integration Tests ---');

        // 1. Register
        console.log('1. Registering user...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
        if (registerRes.status === 200 && registerRes.data.token) {
            token = registerRes.data.token;
            console.log('   Success: User registered.');
        } else {
            throw new Error('Registration failed');
        }

        // 2. Login (optional, since register returns token, but good to test)
        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, testUser);
        if (loginRes.status === 200 && loginRes.data.token) {
            token = loginRes.data.token; // Update token
            console.log('   Success: Login successful.');
        } else {
            throw new Error('Login failed');
        }

        const config = {
            headers: { 'x-auth-token': token }
        };

        // 3. Add Car
        console.log('3. Adding car...');
        const newCar = {
            name: 'Test Car',
            type: 'Hot Wheels',
            purchasePrice: 1.00,
            purchaseDate: '2023-01-01',
            condition: 'Mint',
            status: 'Owned'
        };
        const addCarRes = await axios.post(`${API_URL}/cars`, newCar, config);
        if (addCarRes.status === 200 && addCarRes.data.id) {
            carId = addCarRes.data.id;
            console.log('   Success: Car added. ID:', carId);
        } else {
            throw new Error('Add car failed');
        }

        // 4. Get Cars
        console.log('4. Getting cars...');
        const getCarsRes = await axios.get(`${API_URL}/cars`, config);
        if (getCarsRes.status === 200 && Array.isArray(getCarsRes.data) && getCarsRes.data.length > 0) {
            console.log('   Success: Cars retrieved. Count:', getCarsRes.data.length);
        } else {
            throw new Error('Get cars failed');
        }

        // 5. Update Car
        console.log('5. Updating car...');
        const updateData = { name: 'Updated Test Car', status: 'Sold', soldPrice: 5.00 };
        const updateCarRes = await axios.put(`${API_URL}/cars/${carId}`, updateData, config);
        if (updateCarRes.status === 200 && updateCarRes.data.name === 'Updated Test Car') {
            console.log('   Success: Car updated.');
        } else {
            throw new Error('Update car failed');
        }

        // 6. Delete Car
        console.log('6. Deleting car...');
        const deleteCarRes = await axios.delete(`${API_URL}/cars/${carId}`, config);
        if (deleteCarRes.status === 200 && deleteCarRes.data.msg === 'Car removed') {
            console.log('   Success: Car deleted.');
        } else {
            throw new Error('Delete car failed');
        }

        console.log('--- All Tests Passed ---');
    } catch (error) {
        console.error('--- Test Failed ---');
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

runTests();
