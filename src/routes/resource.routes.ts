import { Router } from 'express';
import { ResourceController } from '../controllers/resource/resource.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const resourceValidation = [
  body('lesson_id').isMongoId(),
  body('title').trim().notEmpty(),
  body('file_url').isURL(),
  body('resource_type').isIn(['pdf', 'doc', 'video', 'audio', 'other']),
  body('file_size').isInt({ min: 0 })
];

// Protected routes
//@ts-expect-error
router.use(authenticateToken);

// Instructor routes
router.post(
  "/",
  //@ts-expect-error
  authorizeRoles("instructor", "admin"),
  resourceValidation,
  ResourceController.createResource
);

// Student routes
router.get('/', ResourceController.getResources);
//@ts-expect-error
router.patch('/:id/download', ResourceController.incrementDownloadCount);

export default router;