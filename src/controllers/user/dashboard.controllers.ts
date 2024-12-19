import { Response } from "express"
import Enrollment from "../../models/Enrollment"

export const  dashboardController=async(req:any,res:Response)=>{
    try {
const {userId} = req.user
if(req.user.role==='student'){
    const enrollment = await Enrollment.find({user_id:userId}).populate('course_id')
    res.status(200).json(enrollment)

}
        
    } catch (error) {
        res.status(200).json({message:"failed to fetch"})
    }

}