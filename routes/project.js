let express = require("express");
let router = express.Router();
const Controller = require("../controller/project")
const verifyToken = require("../middleware/verify_token")

//GET request
router.get('/', verifyToken, Controller.getProject);
router.get('/task', verifyToken, Controller.getTask);
router.get('/filter', verifyToken, Controller.filterProject);
router.get('/search', verifyToken, Controller.searchAll);


//POST request

router.post('/', verifyToken, Controller.addProject);
router.post('/task', verifyToken,Controller.addTask); 

module.exports = router; 