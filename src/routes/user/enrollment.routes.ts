import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { EnrollmentController } from "../../controllers/course/enllorments/enllorment";

const router = Router();
//@ts-ignore
router.use(authenticateToken);
//@ts-ignore
router.get('/:course_id',EnrollmentController.getEnrollment)
export default router
