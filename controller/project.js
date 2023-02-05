const Service = require('../services/project')

const addProject = async (req, res) => {
    try {
      const resultData = await Service.addProject(req);
      return res.status(200).json({ result: resultData, success: true })
    } catch (err) {
        return res.status(400).json(`${err.message}`);
    }
  };

  const addTask = async (req, res) => {
    try {
      const resultData = await Service.addTask(req);
      return res.status(200).json({ result: resultData, success: true })
    } catch (err) {
        return res.status(400).json(`${err.message}`);
    }
  };

  const getProject = async (req, res) => {
    try {
      const resultData = await Service.getProject(req);
      if(resultData == null){
        let message = "No Result Found"
        return res.status(200).json({ result: message, success: true })
      }
      return res.status(200).json({ result: resultData, success: true })
    } catch (err) {
        return res.status(400).json(`${err.message}`);
    }
  };

  const getTask = async (req, res) => {
    try {
      const resultData = await Service.getTask(req);
      if(resultData == null){
        let message = "No Result Found"
        return res.status(200).json({ result: message, success: true })
        }
      return res.status(200).json({ result: resultData, success: true })
    } catch (err) {
        return res.status(400).json(`${err.message}`);
    }
  };
  
  const filterProject = async (req, res) => {
    try {
      const resultData = await Service.filterProject(req);

      if(resultData == null){
      let message = "No Result Found"
      return res.status(200).json({ result: message, success: true })
      }
      return res.status(200).json({ result: resultData, success: true })

    } catch (err) {
        return res.status(400).json(`${err.message}`);
    }
  };

  const searchAll = async (req, res) => {
    try {
      const resultData = await Service.searchAll(req);
      if(resultData == null){
        let message = "No Result Found"
        return res.status(200).json({ result: message, success: true })
        }
      return res.status(200).json({ result: resultData, success: true })

    } catch (err) {
        return res.status(400).json(`${err.message}`);
    }
  };


  module.exports = {
    addProject,
    addTask,
    getProject,
    getTask,
    filterProject,
    searchAll
  }