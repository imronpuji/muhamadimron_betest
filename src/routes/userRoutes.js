import express from 'express';
import * as userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/users', auth, userController.createUser);
router.get('/users/account/:accountNumber', auth, userController.getUserByAccountNumber);
router.get('/users/identity/:identityNumber', auth, userController.getUserByIdentityNumber);
router.patch('/users/account/:accountNumber', auth, userController.updateUser);
router.delete('/users/account/:accountNumber', auth, userController.deleteUser);

export default router;