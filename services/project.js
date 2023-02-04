var jwt = require("jsonwebtoken");

const ProjectSchema = require("../model/project");
const TaskSchema = require("../model/task");
const project = require("../model/project");


const addProject = async (req,res) => {

    const token = req.headers.token
    var userId;
    jwt.verify(token, 'mongoproject', async function(err, decoded) {
        if (err){
        throw new Error(err);
    }
    userId = decoded.id;
    })
          const newProject = new ProjectSchema();
          newProject.user_id = userId;
          newProject.project_name = req.body.project_name;
          newProject.project_desc = req.body.project_desc;
          newProject.status = req.body.status;

          const saveProject = await newProject.save();  
          return saveProject

};

const addTask = async (req,res) => {

        if(req.body.project_id == undefined){
            throw new Error("No project Id found")
        }
          const newTask = new TaskSchema();
          newTask.project_id = req.body.project_id;
          newTask.task_name = req.body.task_name;
          newTask.task_desc = req.body.task_desc;
          newTask.priority = req.body.priority;
          newTask.status = req.body.status;
          const saveTask = await newTask.save();  
          return saveTask
};


const getProject = async (req,res) => {

    const token = req.headers.token
    var id;
    jwt.verify(token, 'mongoproject', async function(err, decoded) {
        if (err){
        throw new Error(err);
    }
    id = decoded.id;
    })
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    const existingProject = await ProjectSchema.find({user_id: id})
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

    if(existingProject === null){
        throw new Error("No Result Found");
    }
    return existingProject;
};

const getTask = async (req,res) => {
    const projectId = req.query.id
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const taskOfProject = await TaskSchema.find({project_id: projectId})
    .skip((page - 1) * limit)
    .limit(limit)
    .exec(); 
    if(taskOfProject === null){
        throw new Error("No Result Found");
    }
    return taskOfProject
};

const filterProject = async (req,res) => {
     
    const greaterThenTasks = req.query.greaterThenTasks;
    const lessThenTasks = req.query.lessThenTasks;
    const priority = req.query.priority; 

    let greaterThanArr = []
    let priorityArr = []
    let GTpriorityArr = []
    let LTpriorityArr = []

    if (priority) {
        const projects = await ProjectSchema.aggregate([
            {
              $lookup: {
                from: 'task_details',
                localField: '_id',
                foreignField: 'project_id',
                as: 'tasks',
              },
            },
            
          ]);
        projects.filter(async (key)=>{
        if(key.priority<priority){
            priorityArr.push(key)
        } 
        })

        if (greaterThenTasks){
            priorityArr.filter(async (key)=>{
                if(key.tasks.length>greaterThenTasks){
                    GTpriorityArr.push(key)
                } 
              })

              return GTpriorityArr;
              //priority and greater than
        }else if (lessThenTasks){

            projects.filter(async (key)=>{
                if(key.tasks.length<lessThenTasks){
                    LTpriorityArr.push(key)
                } 
              })

              return LTpriorityArr;
              //priority and less than
        }
        return priorityArr
// priority end
    } else if(greaterThenTasks){
        const projects = await ProjectSchema.aggregate([
            {
                $lookup: {
                    from: 'task_details',
                    localField: '_id',
                    foreignField: 'project_id',
                    as: 'tasks',
                },
            },
        ]);
          const newVar = projects.filter(async (key)=>{
            if(key.tasks.length>greaterThenTasks){
                greaterThanArr.push(key)
            } 
          })
          return greaterThanArr;
          // Greater then end
    } else if(lessThenTasks){
        const projects = await ProjectSchema.aggregate([
            {
              $lookup: {
                from: 'task_details',
                localField: '_id',
                foreignField: 'project_id',
                as: 'tasks',
              },
            },
          ]);
          const newVar = projects.filter(async (key)=>{
            if(key.tasks.length<lessThenTasks){
                greaterThanArr.push(key)
            } 
          })
          return greaterThanArr;
    }
};    



const searchAll = async(req,res) => {
    const input = req.query.input;
    const projects = await ProjectSchema.find({
        $or: [
          { project_name: { $regex: input, $options: 'i' } },
          { project_desc: { $regex: input, $options: 'i' } },
        ],
      });
      const tasks = await TaskSchema.find({
        $or: [
          { task_name: { $regex: input, $options: 'i' } },
          { task_desc: { $regex: input, $options: 'i' } },
        ],
      });
  
      return{ projects, tasks };
  };
  
module.exports = {
    addProject,
    addTask,
    getProject,
    getTask,
    filterProject,
    searchAll
  };