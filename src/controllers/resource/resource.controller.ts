import { Request, Response } from 'express';
import Resource, { IResource } from '../../models/Resource';
import { AuthRequest } from '../../middleware/auth.middleware';

export class ResourceController {
  static async createResource(req: AuthRequest, res: Response) {
   
  
      try {
        if (!req.file) {
           res.status(400).json({ message: 'No file uploaded' });
           return
        }
  
        const {title, resource_type, lesson_id } = req.body;
  
  
        const newResource: IResource = new Resource({
          lesson_id,
          title,
          file_url: req.file.path, 
          resource_type,
          file_size: req.file.size,
        });
  
        await newResource.save();
        res.status(201).json({message:"resourses created"});
      } catch (error) {
        res.status(500).json({ message: 'Failed to create resource', error });
      }
    
  }
  
  

  static async getResources(req: Request, res: Response) {
    try {
      const { lesson_id}= req.params;
      let query: any = {};

      if (lesson_id) query.lesson_id = lesson_id;
      // if (type) query.resource_type = type;

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
         res.status(404).json({ message: 'Resource not found' });
         return
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update download count', error });
    }
  }
}