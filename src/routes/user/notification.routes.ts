import { Router } from 'express';
import { NotificationController } from '../../controllers/user/notification.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

//@ts-expect-error
// Protected routes
router.use(authenticateToken);

router.post(
  '/',
  [
    body('title').trim().notEmpty(),
    body('message').trim().notEmpty(),
    body('notification_type').isIn(['course_update', 'assignment_due', 'quiz_reminder', 'system'])
  ],
  NotificationController.createNotification
);

router.get('/', NotificationController.getUserNotifications);

router.patch(
  '/mark-read',
  body('notification_ids').isArray(),
  NotificationController.markAsRead
);
//@ts-expect-error
router.delete('/:id', NotificationController.deleteNotification);

export default router;