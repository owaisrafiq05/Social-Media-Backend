import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controller/postController.js';
import { uploadFields } from '../middleware/upload.js';

const router = express.Router();

router.post('/add', uploadFields, createPost);
router.get('/view', getPosts);
router.get('/view/:id', getPostById);  // Ensure this route is correctly defined
router.put('/update/:id', uploadFields, updatePost);
router.delete('/delete/:id', deletePost);

export default router;
