import express from 'express';
import authMiddleware from 'middlewares/auth-middleware';
import { login } from './login';
import { register } from './register';
import { auth } from './auth';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/auth', authMiddleware, auth);

export default router;
