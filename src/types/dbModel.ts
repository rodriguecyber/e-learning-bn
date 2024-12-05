import { ObjectId } from "mongoose";

export interface IStudent{
    name:string,
    email:string,
    phone:number,
    password:string
    lastlogin:Date
    image:string
    isactive:boolean  
}

export interface IInstructor {
  name: string;
  email: string;
  phone: number;
  password: string;
  lastlogin: Date;
  image: string;
  isactive: boolean;
}
export interface ICourse{
    instructor:ObjectId[],
    title:string,
    description:string,
    price:string,
    image:string,
    status:string,
    duration:number,

}

export interface IModules{

    course:ObjectId
    title:string,
    description:string,
    order:number
    duration:number
}
export interface ILessons {
  module:ObjectId
  title: string;
  description: string;
  order: number;
  duration: number;
  videoUrl:string,
}
export interface IResources{
    lesson:ObjectId
    title:string
    url:string,
    filesize:BigInt,
}
export interface IQuizes{
module:ObjectId,
title:string
description:string,
}
export interface QuizeQuestion{
    quiz:ObjectId,
    question:string,
    answer:string,
    points:number,
}
export interface QuizAttemptz{
    quiz:ObjectId,
    student:ObjectId,
    score:number,
}

export interface IAssignment{
    module:ObjectId
    title:string
    description:string
    due_date:Date,
    marks:number
    require_file:boolean,
}
export interface Submission {
  assignment: ObjectId;
  student: ObjectId;
  score: number;
  content:string,
  file:string
  status:string
}
export interface IEnrolment{
    module:ObjectId
    student:ObjectId
    status:string,
    completed:Date
    progress:number

}

export interface IPayment{
    student:ObjectId
    course:ObjectId,
    amount:number,
    status:string,
    transaction:ObjectId,
    
}
export interface ITransaction{
    student:ObjectId
    amount:number,
}
export interface Notification{
    user:ObjectId
    title:string
    message:string
    isRead:boolean

}
export interface ICertificate{
    user:ObjectId
    course:ObjectId
    url:string
    issued:Date,

}
