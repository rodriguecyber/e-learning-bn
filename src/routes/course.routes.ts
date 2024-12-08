import { Router } from 'express';
import { CourseController } from '../controllers/course/course.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const courseValidation = [
  body('title').trim().notEmpty().isLength({ min: 3, max: 100 }),
  body('description').trim().notEmpty().isLength({ min: 10 }),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('difficulty_level').isIn(['beginner', 'intermediate', 'advanced']),
  body('duration_weeks').optional().isInt({ min: 1 }),
  body('prerequisites').optional().isArray(),
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601(),
  body('is_certified').optional().isBoolean()
];

// Public routes
router.get('/', CourseController.getCourses);
//@ts-expect-error
router.get('/:id', CourseController.getCourseById);

// Protected routes
//@ts-expect-error
router.use(authenticateToken);

// Instructor routes
router.post(
  "/",
  //@ts-expect-error
  authorizeRoles("instructor", "admin"),
  courseValidation,
  CourseController.createCourse
);

router.put(
  "/:id",
  //@ts-expect-error
  authorizeRoles("instructor", "admin"),
  courseValidation,
  CourseController.updateCourse
);

router.delete(
  "/:id",
  //@ts-expect-error
  authorizeRoles("instructor", "admin"),
  CourseController.deleteCourse
);

router.patch(
  "/:id/publish",
  //@ts-expect-error
  authorizeRoles("instructor", "admin"),
  CourseController.publishCourse
);

export default router;