const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../data/database.json');

// Đảm bảo thư mục data tồn tại
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function initDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = {
            users: [
                {
                    id: "admin_001",
                    fullName: "Administrator",
                    username: "admin",
                    email: "admin@cineverse.com",
                    password: bcrypt.hashSync("admin123", 10),
                    phone: "0123456789",
                    role: "admin",
                    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                    createdAt: new Date().toISOString(),
                    status: "active"
                },
                {
                    id: "user_001",
                    fullName: "Nguyễn Văn A",
                    username: "user1",
                    email: "user1@example.com",
                    password: bcrypt.hashSync("user123", 10),
                    phone: "0987654321",
                    role: "user",
                    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
                    createdAt: new Date().toISOString(),
                    status: "active"
                }
            ],
            movies: [],
            bookings: [],
            showtimes: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

function readDB() {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

initDatabase();

module.exports = { readDB, writeDB };