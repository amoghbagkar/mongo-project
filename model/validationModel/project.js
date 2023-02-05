const joi = require("joi");

module.exports.addProject = (requestParams) => {
  let joiSchema = joi.object({
    project_name: joi.string().required(),
    project_desc: joi.string().required(),
    status: joi.string().valid("pending", "done", "progress").required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addTask = (requestParams) => {
    let joiSchema = joi.object({
      task_name: joi.string().required(),
      task_desc: joi.string().required(),
      status: joi.string().valid("pending", "done", "progress").required(),
      priority: joi.number().integer().required(),
    });
    return joiSchema.validate(requestParams);
};

module.exports.getProject = (requestParams) => {
    let joiSchema = joi.object({
      limit: joi.number().integer().required(),
      page: joi.number().integer().required(),
    });
    return joiSchema.validate(requestParams);
};

module.exports.getTask = (requestParams) => {
    let joiSchema = joi.object({
      id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      limit: joi.number().integer().required(),
      page: joi.number().integer().required(),
    });
    return joiSchema.validate(requestParams);
};

module.exports.filter = (requestParams) => {
  let joiSchema = joi.object({
    greaterThenTasks: joi.number().integer().optional().allow(null),
    lessThenTasks: joi.number().integer().optional().allow(null),
    priority: joi.number().integer().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.search = (requestParams) => {
  let joiSchema = joi.object({
    input: joi.string().required()
  });
  return joiSchema.validate(requestParams);
};