import { Request, Response } from "express"
import Enrollment from "../../../models/Enrollment"

export class EnrollmentController{
    static getEnrollment = async(req:any,res:Response)=>{
try {
    const {course_id} = req.params
    const user_id= req.user.userId
    const enrollment = await Enrollment.findOne({user_id,course_id})
    if(!enrollment){
        res.status(400).json({message:"no enrollment found"})
        return 
    }
    res.status(200).json(enrollment)

} catch (error) {
    res.status(500).json({message:"internal server error"})
}

    }
}