import express from 'express';
import { signupUser, loginUser, subscribeToCreator } from '../controller/userController.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/subscribe', subscribeToCreator);

export default router;
