let express = require("express");
let router = express.Router();
const Controller = require("../controller/user")
const verifyToken = require("../middleware/verify_token")
//POST request
router.post('/register', Controller.registerUser);
router.post('/login', Controller.loginUser);
router.post('/forgot', Controller.forgotUser);
router.post('/forgot/:id/:token', Controller.forgotUserVerify);
router.post('/logout',Controller.logoutUser);   

//PUT request
router.put('/updateProfile', verifyToken, Controller.editUsers);
router.put('/updatePassword', verifyToken, Controller.changePassword);  


module.exports = router; 