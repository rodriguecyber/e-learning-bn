import { Request, Response } from "express"
import Lesson from "../../models/Lesson"
import Module from "../../models/Module";


export class moduleController{
    static newLesson =  async (req:any,res:Response)=>{
    console.log('fff')

try {
    let fileType:string= 'text'
    if (req.file) {

         fileType = 'document';
        if (req.file.mimetype.startsWith('image')) {
          fileType = 'image';
        } else if (req.file.mimetype.startsWith('video')) {
          fileType = 'video';
        }
    }
    const {module_id,title,content,duration_minutes}=  req.body
   const lesson= await Lesson.create({module_id,title,content,content_type:fileType,video_url:req?.file?.path,duration_minutes})
    await Module.findOneAndUpdate(module_id,{$push:{lessons:lesson._id}})
    res.status(201).json({message:"lessons created"})
} catch (error) {
    res.status(500).json({message:"internal server error"})
    console.log(error)
}
    }


  // In your Module model
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
  
   
      const lessons = await Lesson.find({ module_id: moduleId,})
    
      res.status(200).json(lessons);  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

    static newModule =  async (req:Request,res:Response)=>{
try {
    const {course_id,title,description,duration_hours}=  req.body
    const modules  = await Module.create({course_id,title,description,duration_hours})
    res.status(201).json({message:"module created",modules})
} catch (error) {
    res.status(500).json({message:"internal server error"})
}
    }

   

  
}