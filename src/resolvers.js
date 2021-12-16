"use strict";
const connectDB = require("./database");
const { ObjectId } = require("mongodb");
module.exports = {
  Query: {
    getProjects: async () => {
      let db;
      let Projects = [];
      try {
        db = await connectDB();
        Projects = await db.collection("Projects").find().toArray();
      } catch (error) {
        console.log(error);
      }
      return Projects;
    },
    getActiveProjects: async () => {
      let db;
      let Projectsact = [];
      try {
        db = await connectDB();
        Projectsact = await db
          .collection("Projects")
          .find({ state: true })
          .toArray();
      } catch (error) {
        console.log(error);
      }
      return Projectsact;
    },
    getProjectByID: async (root, { id }) => {
      let db;
      let Project;
      try {
        db = await connectDB();
        Project = await db
          .collection("Projects")
          .findOne({ _id: ObjectId(id) });
      } catch (error) {
        console.log(error);
      }
      return Project;
    },
    getAdvances: async () => {
      let db;
      let Advances;
      try {
        db = await connectDB();
        Advances = await db.collection("Advances").find().toArray();
      } catch (error) {
        console.log(error);
      }
      return Advances;
    },
    getUsers: async ()=>{
      let db
      let users=[];
      try{
        db=await connectDB();
        users= await db.collection("Users").find().toArray();
      }catch(error){
        console.error(error)
      }
      return users
    },
    getStudents: async()=>{
      let db
      let students=[];
      try{
        db=await connectDB();
        students= await db.collection("Users").find({rol: "student"}).toArray();        
      }catch(error){
        console.error(error)
      }
      return students
    },
    getLeaderProject: async(root, {mandated})=>{
      let db;
      let leader;
      try {
        db = await connectDB();
        leader = await db.collection("Projects").findOne({mandated});
      } catch (error) {
        console.log(error)
      }
      return leader
    },
    authUser:async(root,{input})=>{
      let db;
      let user;
      let auth;
      try{
        db=await connectDB();
        user=await db.collection("Users").findOne(input);
        if(user==null){
          auth =false;
        }else{
          auth=true;
        }
      }catch(error){
        console.error(error)
      }
      return auth
    },
    getApplicationList: async(root,{mandated})=>{
      let db;
      let students=[];
      let projects
      let student
      try{
        db= await connectDB();
        projects=await db.collection("Projects").find({mandated}).toArray();
        for(const project of projects){
          student=await db.collection("Users").find({"application.project_applied":project._id, rol:"student"}).toArray();
          students=students.concat(student);
        };   
      }catch{
        console.error(error);
      }
     return students
    }
  },
  Mutation: {

    createAdvance: async (root, { input }) => {
      const newAdvance = Object.assign(input);
      let db;
      let Advances;
      try {
        db = await connectDB();
        Advances = db.collection("Advances").insertOne(newAdvance);
      } catch (error) {
        console.log(error);
      }
      return newAdvance;
    },
    addAdvance: async (root, { id, input }) => {
      let db;
      let Project;
      try {
        db = await connectDB();
        await db
          .collection("Projects")
          .updateOne({ _id: ObjectId(id) }, { $push: input });
        Project = await db
          .collection("Projects")
          .findOne({ _id: ObjectId(id) });
      } catch (error) {
        console.log(error);
      }
      return Project;
    },
    editAdvance: async (root, { id, input }) => {
      let db;
      let Advance;
      try {
        db = await connectDB();
        await db
          .collection("Advances")
          .updateOne({ _id: ObjectId(id) }, { $set: input });
        Advance = await db
          .collection("Advances")
          .findOne({ _id: ObjectId(id) });
      } catch (error) {
        console.log(error);
      }
      return Advance;
    },
    acceptUser: async(root, {id, input}) =>{
      let db;
      let user;
      try{
        db= await connectDB();
        await db.collection("Users").updateOne({_id:ObjectId(id)},{$set: input});
        user=await db.collection("Users").findOne({_id:ObjectId(id)});
      }catch(error){
        console.error(error)
      }
      return user
    },
    editStateProject: async(root,{id,input}) =>{
      let db;
      let project;
      try{
        db=await connectDB();
        await db.collection("Projects").updateOne({_id:ObjectId(id)},{$set:input});
        project= db.collection("Projects").findOne({_id:ObjectId(id)});
      }catch(error){
        console.error(error)
      }
      return project
    },
    editStateStudent: async(root, {rol,id, input})=>{
      let db;
      let user;
      try{
        db= await connectDB();
        await db.collection("Users").updateOne({rol:"student", _id:ObjectId(id)},{$set:input});
        user=db.collection("Users").findOne({rol:"student", _id:ObjectId(id)});
      }catch(error){
        console.error(error)
      }
      return user
    },
    changePhaseProject: async(root,{id,input}) =>{
      let db;
      let project;
      try{
        db=await connectDB();
        await db.collection("Projects").updateOne({_id:ObjectId(id)},{$set:input});
        project= db.collection("Projects").findOne({_id:ObjectId(id)});
      }catch(error){
        console.error(error)
      }
      return project
    },
    createProject: async(root, {input})=>{
      const defaults={
        description: '',
        phase: '',
        mandated: '',
        budget: 0,
        general_obj: '',
        specific_obj:'',
        advances:''
      }
      const newProject = Object.assign(defaults, input);
      let db;
      let project;
      try{
        db=await connectDB()
        project = await db.collection("Projects").insertOne(newProject)
        newProject._id=project.insertedId
      }catch(error){
        console.error(error);
      }
      return newProject
    },
    editProject: async(root,{mandated, input}) =>{
      let db;
      let editProject;
      try{
        db=await connectDB();
        await db.collection("Projects").updateOne({mandated},{$set:input});
        editProject= db.collection("Projects").findOne({mandated});
      }catch(error){
        console.error(error)
      }
      return editProject
    },
    regUser:async(root,{input})=>{
      const defaults={
        name: '',
        rol: '',
        email: '',
        password: '',
        authorization:false,
        active_project: [],
        application:{}
      }
      let db;
      let user;
      let newuser=Object.assign(defaults,input)
      try{
        db=await connectDB();
        user=await db.collection("Users").insertOne(newuser);
        newuser._id=user.insertedId;
        }catch(error){
          console.error(error);
        }
        return newuser
    },
    updateUser: async (root, {id,input})=>{
      let db;
      let user;
      try{
        db= await connectDB();
        await db.collection("Users").updateOne({_id:ObjectId(id)},{$set:input});
        user= await db.collection("Users").findOne({_id:ObjectId(id)});
      }catch(error){
        console.error(error)
      }
      return user
    },
    acceptStudentApplication: async (root, {id,input})=>{
      let db;
      let student;
      try{
        db=await connectDB();
        await db.collection("Users").updateOne({_id:ObjectId(id)},{$set:{"application.aplication_state":input}});
        student=await db.collection("Users").findOne({_id:ObjectId(id)});
      }catch(error){
        console.error(error)
      }
      return student
    }
  },

};
