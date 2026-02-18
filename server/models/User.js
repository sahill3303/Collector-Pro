const db = require('../utils/jsonDB');
const { v4: uuidv4 } = require('uuid');

/**
 * User Model
 * 
 * Represents a user in the system.
 * Uses a local JSON file via `jsonDB` for persistence instead of a real database.
 */
class User {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.username = data.username;
        this.password = data.password; // Hashed password
    }

    /**
     * Find a user by query criteria.
     * @param {Object} query - Key-value pairs to match (e.g., { username: 'admin' })
     * @returns {User|null}
     */
    static async findOne(query) {
        const users = db.getCollection('users');
        const user = users.find(u => {
            return Object.keys(query).every(key => u[key] === query[key]);
        });
        return user ? new User(user) : null;
    }

    /**
     * Find a user by ID.
     * Supports chaining `.select('-password')` to exclude fields.
     * @param {string} id 
     */
    static findById(id) {
        const users = db.getCollection('users');
        const user = users.find(u => u.id === id);

        // Chainable query object to mimic Mongoose behavior
        const queryObj = {
            select: (field) => {
                if (field === '-password' && user) {
                    queryObj._select = field;
                }
                return queryObj;
            },
            then: (resolve, reject) => {
                if (!user) return resolve(null);

                let result = new User(user);
                // Handle field exclusion
                if (queryObj._select === '-password') {
                    result = { ...result };
                    delete result.password;
                }
                resolve(result);
            }
        };
        return queryObj;
    }

    // Instance method for field selection (if needed)
    select(field) {
        if (field === '-password') {
            const { password, ...userWithoutPassword } = this;
            return userWithoutPassword;
        }
        return this;
    }

    /**
     * Save or update the user in the JSON database.
     */
    async save() {
        const users = db.getCollection('users');
        const existingIndex = users.findIndex(u => u.id === this.id);

        const userData = {
            id: this.id,
            username: this.username,
            password: this.password
        };

        if (existingIndex !== -1) {
            users[existingIndex] = userData;
        } else {
            users.push(userData);
        }

        db.saveCollection('users', users);
        return this;
    }
}

module.exports = User;
