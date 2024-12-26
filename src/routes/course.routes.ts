import { Router } from 'express';
import { CourseController } from '../controllers/course/course.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { moduleController } from '../controllers/modules/modules.controllers';
import { assignmentController } from '../controllers/assignment/assignment.controller';
import upload from '../middleware/upload.middleware';

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

router.get('/:id', CourseController.getCourseById);
router.get('/:courseId/modules',moduleController.courseModule)
router.get('/modules/:moduleId/lessons',moduleController.moduleLessons) 



// Protected routes

router.use(authenticateToken);

router.get('/', CourseController.getCourses);

// Instructor routes
router.post(
  "/",upload.single('thumbnail'),
  
  authorizeRoles("instructor", "admin"),
  // courseValidation,
  CourseController.createCourse
);

router.put(
  "/:id",
  
  authorizeRoles("instructor", "admin"),
  courseValidation,
  CourseController.updateCourse
);

router.delete(
  "/:id",
  authorizeRoles("instructor", "admin"),
  CourseController.deleteCourse
);

router.patch(
  "/:id/publish",
  authorizeRoles("instructor", "admin"),
  CourseController.publishCourse
);
router.post('/module',moduleController.newModule)
router.post('/lesson',upload.single('video'),moduleController.newLesson)
router.post('/assignment',assignmentController.newAssignment)
router.post('/assignment/submit',assignmentController.submit)
router.post('/assignment/grade',assignmentController.grade)

export default router;