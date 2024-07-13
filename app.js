import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './routes/index.js';

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// MongoDB connection
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("MongoDB connection string is not defined. Make sure it is set in the .env file.");
    process.exit(1);  // Exit the process with a failure code
}

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected!"))
    .catch((error) => console.log("MongoDB connection error: ", error.message));

// Routes
app.use('/api', route);

// Root route
app.get("/", (req, res) => {
    res.json("Running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
