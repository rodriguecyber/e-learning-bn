import { Router } from 'express';
import { CourseController } from '../controllers/course/course.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { moduleController } from '../controllers/modules/modules.controllers';
import { lessonController } from '../controllers/lessons/lesson.controller';
import { assignmentController } from '../controllers/assignment/assignment.controller';

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
router.get('/:courseId/modules',moduleController.courseModule)
router.get('/modules/:moduleId/lessons',moduleController.courseModule)



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
router.post('/module',moduleController.newModule)
router.post('/lesson',lessonController.newLesson)
router.post('/assignment',assignmentController.newAssignment)
router.post('/assignment/submit',assignmentController.submit)
router.post('/assignment/grade',assignmentController.grade)

export default router;