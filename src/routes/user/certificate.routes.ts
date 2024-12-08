import { Router } from 'express';
import { CertificateController } from '../../controllers/user/certificate.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Public routes
//@ts-expect-error
router.get('/verify/:certificate_number', CertificateController.verifyCertificate);

// Protected routes
//@ts-expect-error
router.use(authenticateToken);

router.post(
  "/issue",
  body("course_id").isMongoId(),
  //@ts-expect-error
  CertificateController.issueCertificate
);

router.get('/user', CertificateController.getUserCertificates);

export default router;