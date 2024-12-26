import { Router } from 'express';
import { CertificateController } from '../../controllers/user/certificate.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Public routes

router.get('/verify/:certificate_number', CertificateController.verifyCertificate);

// Protected routes
router.use(authenticateToken);

router.post(
  "/issue",
  body("course_id").isMongoId(),
  CertificateController.issueCertificate
);

router.get('/user', CertificateController.getUserCertificates);

export default router;