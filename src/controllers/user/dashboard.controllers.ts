import { Response } from "express"
import Enrollment from "../../models/Enrollment"
import Course from "../../models/Course"
import Module from "../../models/Module"

export const  dashboardController=async(req:any,res:Response)=>{
    try {
const {userId} = req.user
let dashboard:any={}
if(req.user.role==='student'){
    const enrollment = await Enrollment.find({user_id:userId}).populate('course_id')
    res.status(200).json(enrollment)
    return

}
if(req.user.role==='instructor'){
    var hours=0
    const courses = await Course.find({instructor_id:userId})
   await Promise.all(courses.map(async(course)=>{
       const module= await  Module.findOne({course_id:course._id})
       if(module){

           hours+=module.duration_hours
       }
    }))
   dashboard.courses = courses.length
   dashboard.students =courses.reduce((total,course)=>total+(course.totalStudent||0),0) 
   dashboard.hours = hours
   res.status(200).json(dashboard)

return
}
res.status(401).json({message:"you are not user"})
        
    } catch (error) {
        res.status(200).json({message:"failed to fetch"})
    }

}