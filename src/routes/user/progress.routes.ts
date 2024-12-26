import { Router } from 'express';
import { ProgressController } from '../../controllers/user/progress.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { body } from 'express-validator';
import { dashboardController } from '../../controllers/user/dashboard.controllers';

const router = Router();

// Protected routes
router.use(authenticateToken);

router.put(
  "/lessons/:lessonId",
  // [
  //   body("time_spent").optional().isInt({ min: 0 }),
  //   body("is_completed").isBoolean(),
  //   body("notes").optional().isObject(),
  // ],
  ProgressController.updateProgress
);
router.get('/dashboard',dashboardController)

router.get('/', ProgressController.getUserProgress);

export default router;