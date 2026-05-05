const { readDB, writeDB } = require('../config/database');

const getMyBookings = async (req, res) => {
    try {
        const db = readDB();
        const bookings = db.bookings.filter(b => b.userId === req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const db = readDB();
        res.json(db.bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBooking = async (req, res) => {
    try {
        const db = readDB();
        const newBooking = { id: `BKG${Date.now()}`, userId: req.user.id, ...req.body, bookingDate: new Date().toISOString(), status: 'confirmed' };
        db.bookings.push(newBooking);
        writeDB(db);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const db = readDB();
        const index = db.bookings.findIndex(b => b.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Không tìm thấy đặt vé' });
        db.bookings.splice(index, 1);
        writeDB(db);
        res.json({ message: 'Hủy vé thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMyBookings, getAllBookings, createBooking, cancelBooking };