// Add Project
class addProjectRequest {
    constructor(req) {
      this.project_name = req.body.project_name ? req.body.project_name : null;
      this.project_desc = req.body.project_desc ? req.body.project_desc : null;
      this.status = req.body.status ? req.body.status : null;
    }
  }

  // Add Task
class addTaskRequest {
    constructor(req) {
      this.task_name = req.body.task_name ? req.body.task_name : null;
      this.task_desc = req.body.task_desc ? req.body.task_desc : null;
      this.status = req.body.status ? req.body.status : null;
      this.priority = req.body.priority ? req.body.priority : null;
    }
  }

    // Get Project with Pagination
class getProjectRequest {
    constructor(req) {
      this.page = req.query.page ? req.query.page : null;
      this.limit = req.query.limit ? req.query.limit : null;
    }
  }

    // Get Task with Pagination
class getTaskRequest {
    constructor(req) {
        this.id = req.query.id ? req.query.id : null;
        this.page = req.query.page ? req.query.page : null;
        this.limit = req.query.limit ? req.query.limit : null;
    }
}

    // Filter
class filterRequest {
    constructor(req) {
        this.greaterThenTasks = req.query.greaterThenTasks ? req.query.greaterThenTasks : null;
        this.lessThenTasks = req.query.lessThenTasks ? req.query.lessThenTasks : null;
        this.priority = req.query.priority ? req.query.priority : null;
    }
}
    // Search
class searchRequest {
    constructor(req) {
        this.input = req.query.id ? req.query.id : null;
    }
}

module.exports.addProjectRequest = addProjectRequest;
module.exports.addTaskRequest = addTaskRequest;
module.exports.getProjectRequest = getProjectRequest;
module.exports.getTaskRequest = getTaskRequest;
module.exports.filterRequest = filterRequest;
module.exports.searchRequest = searchRequest;