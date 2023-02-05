var jwt = require("jsonwebtoken");

const ProjectSchema = require("../model/project");
const TaskSchema = require("../model/task");

const coreRequestModel = require("../model/serviceModel/project");
const joiValidationModel = require("../model/validationModel/project");


const addProject = async (req,res) => {

  let addProjectRequest = new coreRequestModel.addProjectRequest(req);
  let validateRequest = joiValidationModel.addProject(addProjectRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try{
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

  } catch (errAddProject){
    throw new Error(errAddProject.message)
  }

};

const addTask = async (req,res) => {

  let addTaskRequest = new coreRequestModel.addTaskRequest(req);
  let validateRequest = joiValidationModel.addTask(addTaskRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try{
        if(req.body.project_id == undefined){
          let message = "No Project Id Found"
            throw new Error(message);
        }
          const newTask = new TaskSchema();
          newTask.project_id = req.body.project_id;
          newTask.task_name = req.body.task_name;
          newTask.task_desc = req.body.task_desc;
          newTask.priority = req.body.priority;
          newTask.status = req.body.status;
          const saveTask = await newTask.save();  
          return saveTask

    } catch(errAddTask){
      throw new Error(errAddTask.message)
    }
};


const getProject = async (req,res) => {

  let getProjectRequest = new coreRequestModel.getProjectRequest(req);
  let validateRequest = joiValidationModel.getProject(getProjectRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try {
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
      let message = "No Result Found"
        throw new Error(message);
    }
    return existingProject;
  } catch(errgetProject){
    throw new Error(errgetProject.message)
  }
};

const getTask = async (req,res) => {

  let getTaskRequest = new coreRequestModel.getTaskRequest(req);
  let validateRequest = joiValidationModel.getTask(getTaskRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }
  
  try {
    const projectId = req.query.id
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const taskOfProject = await TaskSchema.find({project_id: projectId})
    .skip((page - 1) * limit)
    .limit(limit)
    .exec(); 
    return taskOfProject
  } catch(errGetTask){
    throw new Error(errGetTask.message)
  }
};

const filterProject = async (req,res) => {
  
  let addProjectRequest = new coreRequestModel.filterRequest(req);
  let validateRequest = joiValidationModel.filter(addProjectRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  if(req.query.greaterThenTasks == null && req.query.lessThenTasks== null && req.query.priority== null){
    let noInputMessage = "No input"
    throw new Error(noInputMessage)
  }
  if(req.query.greaterThenTasks != null && req.query.lessThenTasks != null){
    let multipleInputMessage = "Choose either Greater than or Less than"
    throw new Error(multipleInputMessage)
  }
  try {
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
            let hasMatchingPriority = key.tasks.filter(async (key2) => {
              return key2.priority == priority;
            });
          
            if (hasMatchingPriority) {
              if(key.tasks.length != 0){
                priorityArr.push(key);
              }
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
        } else if (lessThenTasks){

            projects.filter(async (key)=>{
                if(key.tasks.length<lessThenTasks && key.tasks.length != 0){
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
            if(key.tasks.length<lessThenTasks && key.tasks.length != 0){
                greaterThanArr.push(key)
            } 
          })
          return greaterThanArr;
    }
  } catch(errFilterProject){
    throw new Error(errFilterProject.message)
  }
};    



const searchAll = async(req,res) => {

  let addProjectRequest = new coreRequestModel.searchRequest(req);
  let validateRequest = joiValidationModel.search(addProjectRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }
  
  try {
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
    } catch(errSearchAll){
      throw new Error(errSearchAll.message)
    }
  };
  
module.exports = {
    addProject,
    addTask,
    getProject,
    getTask,
    filterProject,
    searchAll
  };