import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').trim().notEmpty(),
  body('role').isIn(['student', 'instructor', 'admin']),
  body('phone').optional().isMobilePhone('any')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
//@ts-expect-error
router.post('/register', registerValidation, AuthController.register);
//@ts-expect-error
router.post('/login', loginValidation, AuthController.login);
//@ts-expect-error
router.post('/forgot-password', body('email').isEmail(), AuthController.forgotPassword);
router.post('/reset-password', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 })
//@ts-expect-error
], AuthController.resetPassword);
//@ts-expect-error
router.get('/verify-email', AuthController.verifyEmail);
//@ts-expect-error
router.get('/me', AuthController.loggedUser);

export default router;