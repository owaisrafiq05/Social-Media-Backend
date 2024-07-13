import express from 'express';
import { signupUser, loginUser, subscribeToCreator, getAllUsers, getUserByID  } from '../controller/userController.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/subscribe', subscribeToCreator);
router.get('/view', getAllUsers);
router.get('/view/:id', getUserByID);

export default router;
