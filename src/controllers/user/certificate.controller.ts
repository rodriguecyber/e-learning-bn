import { Request, Response } from 'express';
import UserCertificate from '../../models/UserCertificate';
import Course from '../../models/Course';
import { AuthRequest } from '../../middleware/auth.middleware';
import { generateCertificateNumber } from '../../utils/certificate';

export class CertificateController {
  static async issueCertificate(req: AuthRequest, res: Response) {
    try {
      const { course_id } = req.body;
      const user_id = req.user?._id;

      const course = await Course.findById(course_id);
      if (!course || !course.is_certified) {
        return res.status(400).json({ message: 'Course is not eligible for certification' });
      }

      const existingCertificate = await UserCertificate.findOne({ user_id, course_id });
      if (existingCertificate) {
        return res.status(400).json({ message: 'Certificate already issued' });
      }

      const certificate = new UserCertificate({
        user_id,
        course_id,
        certificate_number: generateCertificateNumber(),
        certificate_url: `https://certificates.example.com/${course_id}/${user_id}`
      });

      await certificate.save();
      res.status(201).json(certificate);
    } catch (error) {
      res.status(500).json({ message: 'Failed to issue certificate', error });
    }
  }

  static async getUserCertificates(req: AuthRequest, res: Response) {
    try {
      const certificates = await UserCertificate.find({ user_id: req.user?._id })
        .populate('course_id', 'title')
        .sort({ issued_date: -1 });

      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch certificates', error });
    }
  }

  static async verifyCertificate(req: Request, res: Response) {
    try {
      const { certificate_number } = req.params;
      const certificate = await UserCertificate.findOne({ certificate_number })
        .populate('user_id', 'full_name')
        .populate('course_id', 'title');

      if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }

      res.json({
        is_valid: certificate.is_verified,
        certificate_details: certificate
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify certificate', error });
    }
  }
}