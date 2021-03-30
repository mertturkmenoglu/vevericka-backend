import express, { Request, Response } from 'express';
import UserController from '../../controllers/v2/UserController';
import UserRepository from '../../repositories/UserRepository';
import UserService from '../../services/v2/UserService';
import logger from '../../utils/winstonLogger';

const router = express.Router();

const userRepository = new UserRepository(logger);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/username/:username', (req: Request, res: Response) => userController.getUserByUsername(req, res));

router.get('/:id', (req: Request, res: Response) => userController.getUserById(req, res));

export default router;
