import express from 'express';
import AuthController from '../../controllers/v2/AuthController';
import AuthService from '../../services/v2/AuthService';

const router = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));

export default router;
