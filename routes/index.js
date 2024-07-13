import express from "express";
import postRoutes from "./posts.js";
import authRoutes from "./creator.js";
import userRoutes from './users.js';

const router = express.Router();

// Routes for posts and creator authentication
router.use('/post', postRoutes);
router.use('/creator', authRoutes);
router.use('/user', userRoutes);

// Root route
router.get("/", (req, res) => {
    res.send("HELLO SERVER MVC");
});

export default router;
