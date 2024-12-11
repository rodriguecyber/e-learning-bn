import { Request, Response } from "express"
import Module from "../../models/Module"
import Assignment from "../../models/Assignment"
import Submission from "../../models/Submission"


export class assignmentController{
    static newAssignment =  async (req:Request,res:Response)=>{
try {
    const {module_id,title,description,due_date,max_points,requires_file,duration}=  req.body
    await Assignment.create({module_id,title,description,due_date,max_points,requires_file,duration})
    res.status(201).json({message:"assignment added created"})
} catch (error) {
    res.status(500).json({message:"internal server error"})
}
    }
    static submit= async(req:any,res:Response)=>{
        try {
            if (req.file) {

                let fileType: string = 'document';
                if (req.file.mimetype.startsWith('image')) {
                  fileType = 'image';
                } else if (req.file.mimetype.startsWith('video')) {
                  fileType = 'video';
                }
            }
            const {assignment_id,user_id,content}=req.body
            await Submission.create({assignment_id,user_id,content,file_url:req.file.path})
        res.status(201).json({message:"assignmnt submitted"})
            
        } catch (error) {
    res.status(500).json({message:"internal server error"})
            
        }
    }
static grade   = async(req:Request,res:Response)=>{
    try {
        const {feedback,score,user_id,assignment_id}=req.body
        await Submission.findOneAndUpdate({user_id,assignment_id},{feedback,score})
        res.status(201).json({message:"assignmnt submitted"})

    } catch (error) {
    res.status(500).json({message:"internal server error"})
        
    }
}

}