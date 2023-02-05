const joi = require("joi");

module.exports.userLogin = (requestParams) => {
  let joiSchema = joi.object({
    email: joi.string().email({minDomainSegments: 2,tlds: { allow: ["com", "net"] }}).required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,16}$")).required()
  });
  return joiSchema.validate(requestParams);
};

module.exports.userLogout = (requestParams) => {
  let joiSchema = joi.object({
    token: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.userRegister = (requestParams) => {
  let joiSchema = joi.object({
    email: joi.string().email({minDomainSegments: 2,tlds: { allow: ["com", "in"] }}).required(),
    name: joi.string().required(),
    phone: joi.string().regex(/^[0-9]{10}$/).required(),
    gender: joi.string().required(),
    age: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.editUsers = (requestParams) => {
  let joiSchema = joi.object({
    id: joi.string().optional().allow(null),
    name: joi.string().required().optional().allow(null),
    gender: joi.string().required().optional().allow(null),
    password: joi.string().required().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

module.exports.changePassword = (requestParams) => {
  let joiSchema = joi.object({
    id: joi.string().required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,16}$")).required()
  });
  return joiSchema.validate(requestParams);
};

module.exports.forgotPassword = (requestParams) => {
  let joiSchema = joi.object({
    email: joi.string().email({minDomainSegments: 2,tlds: { allow: ["com", "net"] }}).required()
  });
  return joiSchema.validate(requestParams);
};

module.exports.forgotVerify = (requestParams) => {
  let joiSchema = joi.object({
    id: joi.string().required(),
    token: joi.string().required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,16}$")).required()
  });
  return joiSchema.validate(requestParams);
};
