import express from 'express';
import { signupController, loginController, otpVerification } from '../controller/authController.js';

const router = express.Router();

// Creator Auth API
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/otpverification', otpVerification);

export default router;
