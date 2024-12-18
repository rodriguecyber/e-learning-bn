import { Router } from "express";
import { assignmentController } from "../controllers/assignment/assignment.controller";

const router = Router();
router.post('/',assignmentController.newAssignment)
router.get('/:module_id',assignmentController.getAssignment)
export default router;
