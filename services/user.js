var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const coreRequestModel = require("../model/serviceModel/user");
const joiValidationModel = require("../model/validationModel/user");

const nodemailer = require("nodemailer");
const UserSchema = require("../model/user");
const saltRounds = 10;

const loginUser = async (req, res) => {

  let userLoginDetailsRequest = new coreRequestModel.loginRequest(req);
  let validateRequest = joiValidationModel.userLogin(userLoginDetailsRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try {
  const existingUser = await UserSchema.findOne({$or: [{ email: req.body.email }, { phone: req.body.phone }]});
  if (existingUser) {
    const comparePassword = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (comparePassword == false) {
      throw new Error(`Entered Password is Wrong!`);
    } else {
      var token = jwt.sign({ id: existingUser._id }, "mongoproject", {
        expiresIn: 86400, // expires in 24 hours
      });
      }
    }
    return {token, existingUser};

  } catch (errUserLogin) {
    throw new Error(errUserLogin.message);
  }
};


const registerUser = async (req, res) => {

  let userRegisterDetailsRequest = new coreRequestModel.registerRequest(req);
  let validateRequest = joiValidationModel.userRegister(userRegisterDetailsRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  //Check if user is already registered
  try {
    const existingUser = await UserSchema.findOne({ email: req.body.email });
    if (existingUser) {
      throw new Error(`User Already exist!`);
    } else {
      let newUser = new UserSchema();
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.phone = req.body.phone;
      newUser.age = req.body.age;
      newUser.gender = req.body.gender;

      const saveUser = await newUser.save();

      var token = jwt.sign({ id: saveUser._id }, "mongoproject", {
        expiresIn: 86400, // expires in 24 hours
      });
      var secret = "mongoproject" + saveUser.password;
      var token = jwt.sign(
        { email: saveUser.email, id: saveUser._id },
        secret,
        { expiresIn: "15m" }
      );
      const link = `http://localhost:3400/user/forgot/${saveUser._id}/${token}`;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      var mailOptions = {
        from: "MONGO PROJECT",
        to: saveUser.email,
        subject: "Password reset Link",
        text: "Change your password " + link,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        return{ code: 500, message: error.message };
        } else {
          let message = "Email Sent. Please Check your Email"
          return {message}
        }
      });
    return {token, saveUser};

    }
  } catch (errRegister) {
    throw new Error(errRegister.message);
  }
};

const editUsers = async (req) => {
  
  let editUsersRequest = new coreRequestModel.editUsersRequest(req);
  let validateRequest = joiValidationModel.editUsers(editUsersRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try{
    const editUser = await UserSchema.updateOne(
    {_id: req.query.id},
    {$set: req.body}
  );
  return {editUser};

  } catch (errEditUser){
    throw new Error(errEditUser.message);
  }
};

const changePassword = async (req) => {

  let changePasswordRequest = new coreRequestModel.changePasswordRequest(req);
  let validateRequest = joiValidationModel.changePassword(changePasswordRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try {
  var hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  await UserSchema.updateOne(
    {
      _id: req.query.id,
    },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );
  return { message: "Password has been changed! close the window!" };
  } catch (errChangePassword){
    throw new Error(errChangePassword.message);
  }
};

const forgotUser = async (req, res) => {
  let forgotPasswordRequest = new coreRequestModel.forgotRequest(req);
  let validateRequest = joiValidationModel.forgotPassword(forgotPasswordRequest);

  if (validateRequest.error) {
  throw new Error(validateRequest.error.message);
  }

  try {
    const existingUser = await UserSchema.findOne({ email: req.query.email });

    if (!existingUser) {
      let message = 'User does not exist'
      throw new Error(message);
    }
    var secret = "mongoproject" + existingUser.password;
    var token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "15m" }
    );
    const link = `http://localhost:3400/user/forgot/${existingUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: "MONGO PROJECT",
      to: req.query.email,
      subject: "Password reset Link",
      text: "Here is the password reset link " + link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      throw new Error(error.message);
      } else {
        let message = "Email Sent. Please Check your Email"
        return {message}
      }
    });
    
  } catch (errForgotPassword) {
    throw new Error(errForgotPassword.message);
  }
};

const forgotUserVerify = async (req, res) => {

  let forgotPasswordRequest = new coreRequestModel.forgotVerifyRequest(req);
  let validateRequest = joiValidationModel.forgotVerify(forgotPasswordRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try {
  const { id, token } = req.params;
  const { password } = req.body;
  const existingUser = await UserSchema.findOne({ _id: id });
  if (!existingUser) {
    let message = 'User Does Not Exist'
    throw new Error(message);
  }
  const secret = "mongoproject" + existingUser.password;

    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        return{ code: 500, message: err.message };
      }
      var hashedPassword = await bcrypt.hash(password, saltRounds);
      const userDetails = await UserSchema.updateOne(
        {_id: id,},
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
    });
    return {existingUser};

  } catch (errVerifyForgot) { 
    throw new Error(errVerifyForgot.message);
  }
};

const logoutUser = async (req, res) => {

  let userLogoutDetailsRequest = new coreRequestModel.logoutRequest(req);
  let validateRequest = joiValidationModel.userLogout(userLogoutDetailsRequest);

  if (validateRequest.error) {
    throw new Error(validateRequest.error.message);
  }

  try {
    const token = req.headers.token + "invalid"
    return {token};

  } catch (errUserLogout) {
    throw new Error(errUserLogout.message);
  }
};

module.exports = {
  loginUser,
  registerUser,
  editUsers,
  forgotUser,
  forgotUserVerify,
  changePassword,
  logoutUser
};
