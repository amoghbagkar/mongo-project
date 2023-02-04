var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const UserSchema = require("../model/user");
const saltRounds = 10;

const loginUser = async (req, res) => {
  const existingUser = await UserSchema.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
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

      return { existingUser, token };
    }
  } else {
    throw new Error("Wrong Email/Number");
  }
};

const registerUser = async (req, res) => {
  //Check if user is already registered
  try {
    const existingUser = await UserSchema.findOne({ email: req.body.email });
    if (existingUser) {
      throw new Error("User Already exist", 400);
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
          throw new Error(error);
        } else {
          return "Email sent: " + info.response;
        }
      });
      return { saveUser, token };
    }
  } catch (err) {
    throw err;
  }
};

const editUsers = async (req) => {
  
  try{
    const editUser = await UserSchema.updateOne(
    {
      _id: req.query.id,
    },
    { $set: req.body }
  );

  return editUser;
  } catch (err){
    throw err
  }
};

const changePassword = async (req) => {
  try{
  var hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  await UserSchema.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );
  return { status: "Password has been changed! close the window!" };
  } catch (err){
    throw err
  }
};

const forgotUser = async (req, res) => {
  try {
    const existingUser = await UserSchema.findOne({ email: req.query.email });

    if (!existingUser) {
      throw new Error("No User Found")
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
        throw error
      } else {
        return "Email sent: " + info.response;
      }
    });
  } catch (err) {
    throw err
  }
};

const forgotUserVerify = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const existingUser = await UserSchema.findOne({ _id: id });
  if (!existingUser) {
    return res.status(400).json("user does not exist");
  }
  const secret = "mongoproject" + existingUser.password;

  try {

    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        throw err;
      }
      var hashedPassword = await bcrypt.hash(password, saltRounds);
      const userDetails = await UserSchema.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      return userDetails
    });
  } catch (err) { 
    throw err
  }
};

module.exports = {
  loginUser,
  registerUser,
  editUsers,
  forgotUser,
  forgotUserVerify,
  changePassword,
};
