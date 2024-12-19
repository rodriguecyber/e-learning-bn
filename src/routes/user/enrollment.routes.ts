import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";
import { EnrollmentController } from "../../controllers/course/enllorments/enllorment";
import { dashboardController } from "../../controllers/user/dashboard.controllers";

const router = Router();
//@ts-ignore
router.use(authenticateToken);
router.get('/:course_id',EnrollmentController.getEnrollment)
export default router
