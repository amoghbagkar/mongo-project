const Service = require('../services/user')


const registerUser = async (req, res) => {
    try {
      const resultData = await Service.registerUser(req);
      return res.send(resultData);
    } catch (err) {
      return res.status(400).json(`${err.message}`);
    }
  };

  const loginUser = async (req, res) => {
    try {
      const resultData = await Service.loginUser(req);
      return res.send(resultData);
    } catch (err) {
      return res.status(400).json(`${err.message}`);
    }
  };

  const editUsers = async (req, res) => {
    try {
      const resultData = await Service.editUsers(req);
      return res.send(resultData);
    } catch (err) {
      return res.status(400).json(`${err.message}`);
    }
  };

  const changePassword = async (req, res) => {
    try {
      const resultData = await Service.changePassword(req);
      return res.send(resultData);
    } catch (err) {      
      return res.status(400).json(`${err.message}`);
    }
  };

  const forgotUser = async (req, res) => {
    try {
      const resultData = await Service.forgotUser(req);
      return res.send(resultData);
    } catch (err) {
      return res.status(400).json(`${err.message}`);
    }
  };

  const forgotUserVerify = async (req, res) => {
    try {
      const resultData = await Service.forgotUserVerify(req);
      return resultData;
    } catch (err) {
      return res.status(400).json(`${err.message}`);
    }
  };

  module.exports = {
    registerUser,
    loginUser,
    editUsers,
    changePassword,
    forgotUser,
    forgotUserVerify
  }