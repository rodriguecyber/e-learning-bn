import { Router } from 'express';
import { ProgressController } from '../../controllers/user/progress.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Protected routes
//@ts-expect-error
router.use(authenticateToken);

router.post(
  "/update",
  [
    body("lesson_id").isMongoId(),
    body("time_spent").optional().isInt({ min: 0 }),
    body("is_completed").isBoolean(),
    body("notes").optional().isObject(),
  ],
  //@ts-expect-error
  ProgressController.updateProgress
);

router.get('/', ProgressController.getUserProgress);
router.get('/summary/:course_id', ProgressController.getProgressSummary);

export default router;