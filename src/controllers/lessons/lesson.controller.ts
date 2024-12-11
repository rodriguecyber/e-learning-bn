import { Request, Response } from "express"
import Module from "../../models/Module"
import Lesson from "../../models/Lesson"
import UserProgress from "../../models/UserProgress"


export class lessonController{
    static newLesson =  async (req:Request,res:Response)=>{
try {
    const {course_id,title,description,order_index,duration}=  req.body
    await Module.create({course_id,title,description,order_index,duration})
    res.status(201).json({message:"module created"})
} catch (error) {
    res.status(500).json({message:"internal server error"})
}
    }

   
}