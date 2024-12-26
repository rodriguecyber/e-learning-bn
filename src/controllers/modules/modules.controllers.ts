import { Request, Response } from "express"
import Lesson from "../../models/Lesson"
import Module from "../../models/Module";
import Enrollment from "../../models/Enrollment";


export class moduleController {

    static newLesson = async (req: any, res: Response) => {
      try {
        let fileType: string = 'text';  
  
        if (req.file) {
          fileType = 'document';
          
          if (req.file.mimetype.startsWith('image')) {
            fileType = 'image';
          } else if (req.file.mimetype.startsWith('video')) {
            fileType = 'video';
          }
        }
  
        const { module_id, title, content, duration_minutes } = req.body;
  
        const module = await Module.findById(module_id);
        if (!module) {
           res.status(404).json({ message: "Module not found" });
           return
        }
  
        const lastLesson = await Lesson.findOne({
          where: { module_id },
          order: [['order_index', 'DESC']],
        });
  
        const order_index = lastLesson ? lastLesson.order_index + 1 : 1;
  
        const lesson = await Lesson.create({
          module_id,
          title,
          content,
          content_type: fileType,
          video_url: req?.file?.path,  
          duration_minutes,
          order_index,  
        });
  
        await Module.findByIdAndUpdate(module_id, { $push: { lessons: lesson._id } });
  
        await Enrollment.findOneAndUpdate(
          { course_id: module.course_id, user_id: req.user.userId },
          { $inc: { totalLesson: 1 } }
        );
  
        res.status(201).json({ message: "Lesson created successfully" });
  
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  
  static courseModule = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;


      const modules = await Module.find({ course_id: courseId })
        .populate({
          path: 'lessons',
          //   model: 'Lesson',
          options: { sort: { order_index: 1 } },
        });

      res.status(200).json(modules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  static moduleLessons = async (req: Request, res: Response) => {
    try {
      const { moduleId } = req.params;


      const lessons = await Lesson.find({ module_id: moduleId, })

      res.status(200).json(lessons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static newModule = async (req: Request, res: Response) => {
    try {
      const { course_id, title, description, duration_hours } = req.body;
  
     
      const lastModule = await Module.findOne({
        where: { course_id },
        order: [['order_index', 'DESC']],
      });      
      const order_index = lastModule ? lastModule.order_index + 1 : 1;
      const modules = await Module.create({
        course_id,
        title,
        description,
        duration_hours,
        order_index,
      });
  
      res.status(201).json({ message: "module created", modules });
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  };
  




}