const db = require('../utils/jsonDB');
const { v4: uuidv4 } = require('uuid');

class User {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.username = data.username;
        this.password = data.password;
    }

    static async findOne(query) {
        const users = db.getCollection('users');
        const user = users.find(u => {
            return Object.keys(query).every(key => u[key] === query[key]);
        });
        return user ? new User(user) : null;
    }

    static findById(id) {
        const users = db.getCollection('users');
        const user = users.find(u => u.id === id);

        const queryObj = {
            select: (field) => {
                // Determine if we need to filter fields (mocking -password)
                if (field === '-password' && user) {
                    // We handle this in 'then' because 'select' modifies the query
                    queryObj._select = field;
                }
                return queryObj;
            },
            then: (resolve, reject) => {
                if (!user) return resolve(null);

                let result = new User(user);
                if (queryObj._select === '-password') {
                    // Allow removing password from the result
                    result = { ...result };
                    delete result.password;
                }
                resolve(result);
            }
        };
        return queryObj;
    }

    // Mock select specifically for password exclusion (common Mongoose pattern)
    select(field) {
        if (field === '-password') {
            const { password, ...userWithoutPassword } = this;
            return userWithoutPassword;
        }
        return this;
    }

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
