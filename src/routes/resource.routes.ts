import { Router } from 'express';
import { ResourceController } from '../controllers/resource/resource.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import upload from '../middleware/upload.middleware';

const router = Router();

// Validation middleware
const resourceValidation = [
  body('lesson_id').isMongoId(),
  body('title').trim().notEmpty(),
  body('resource_type').isIn(['pdf', 'doc', 'video', 'audio', 'other']),
];

// Protected routes
router.use(authenticateToken);

// Instructor routes
router.post(
  "/",
  authorizeRoles("instructor", "admin"),
  resourceValidation,upload.single('file'),
  ResourceController.createResource
);

// Student routes
router.get('/:lesson_id', ResourceController.getResources);
router.patch('/:id/download', ResourceController.incrementDownloadCount);

export default router;