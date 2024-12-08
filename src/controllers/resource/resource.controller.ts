import { Request, Response } from 'express';
import Resource from '../../models/Resource';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ResourceController {
  static async createResource(req: AuthRequest, res: Response) {
    try {
      const resource = new Resource(req.body);
      await resource.save();
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create resource', error });
    }
  }

  static async getResources(req: Request, res: Response) {
    try {
      const { lesson_id, type } = req.query;
      let query: any = {};

      if (lesson_id) query.lesson_id = lesson_id;
      if (type) query.resource_type = type;

      const resources = await Resource.find(query)
        .populate('lesson_id', 'title');
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch resources', error });
    }
  }

  static async incrementDownloadCount(req: Request, res: Response) {
    try {
      const resource = await Resource.findByIdAndUpdate(
        req.params.id,
        { $inc: { download_count: 1 } },
        { new: true }
      );

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update download count', error });
    }
  }
}