const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Initialize DB if not exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], cars: [] }, null, 2));
}

class JsonDB {
    constructor() {
        this.dbPath = dbPath;
    }

    read() {
        if (!fs.existsSync(this.dbPath)) {
            return { users: [], cars: [] };
        }
        try {
            const data = fs.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading DB:', err);
            return { users: [], cars: [] };
        }
    }

    write(data) {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('Error writing DB:', err);
            return false;
        }
    }

    getCollection(name) {
        const data = this.read();
        return data[name] || [];
    }

    saveCollection(name, items) {
        const data = this.read();
        data[name] = items;
        this.write(data);
    }
}

module.exports = new JsonDB();
