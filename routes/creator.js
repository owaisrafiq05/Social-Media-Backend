import express from 'express';
import { signupController, loginController, otpVerification } from '../controller/authController.js';
import { getAllCreators, getCreatorById  } from '../controller/creatorController.js';
import avatarUpload from '../middleware/avatarUpload.js';

const router = express.Router();

// Creator Auth API
router.post('/signup', avatarUpload.single('avatar'), signupController);
router.post('/login', loginController);
router.post('/otpverification', otpVerification);
router.get('/view', getAllCreators);
router.get('/view/:id', getCreatorById);

export default router;
