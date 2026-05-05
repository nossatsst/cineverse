const { readDB, writeDB } = require('../config/database');

const movies = [
    {
        id: "movie_001",
        title: "Jolly LLB",
        category: "Comedy",
        duration: "2h 10m",
        rating: 8.5,
        image: "https://moviebooking-backend-37gi.onrender.com/uploads/movie-1763490901238-12829.png",
        description: "A hilarious courtroom comedy that will make you laugh out loud.",
        price: 159,
        releaseDate: "2024-11-10",
        status: "now_showing",
        director: "Subhash Kapoor",
        cast: ["Akshay Kumar", "Huma Qureshi"]
    },
    {
        id: "movie_002",
        title: "Dhurandhar",
        category: "Action",
        duration: "2h 20m",
        rating: 8.4,
        image: "https://moviebooking-backend-37gi.onrender.com/uploads/movie-1773906581802-13826.jfif",
        description: "A high-octane action thriller.",
        price: 159,
        releaseDate: "2024-11-15",
        status: "now_showing",
        director: "S. S. Rajamouli",
        cast: ["Ram Charan", "Jr NTR"]
    },
    {
        id: "movie_003",
        title: "Until Dawn",
        category: "Horror",
        duration: "1h 55m",
        rating: 7.5,
        image: "https://moviebooking-backend-37gi.onrender.com/uploads/movie-1763486290718-6833.png",
        description: "A terrifying horror experience.",
        price: 159,
        releaseDate: "2024-11-05",
        status: "now_showing",
        director: "David F. Sandberg",
        cast: ["Ella Rubin"]
    }
];

const db = readDB();
db.movies = movies;
writeDB(db);

console.log(`✅ Đã thêm ${movies.length} phim vào database!`);