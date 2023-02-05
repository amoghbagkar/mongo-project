// Register
class registerRequest {
    constructor(req) {
      this.email = req.body.email ? req.body.email : null;
      this.name = req.body.name ? req.body.name : null;
      this.phone = req.body.phone ? req.body.phone : null;
      this.gender = req.body.gender ? req.body.gender : null;
      this.age = req.body.age ? req.body.age : null;
    }
  }

  //Login
  class loginRequest {
    constructor(req) {
      this.email = req.body.email ? req.body.email : null;
      this.password = req.body.password ? req.body.password : null;
    }
  }

    //Logout
    class logoutRequest {
      constructor(req) {
        this.token = req.headers.token ? req.headers.token : null;
      }
    }

  //Forgot
  class forgotRequest {
    constructor(req) {
      this.email = req.query.email ? req.query.email : null;
    }
  }
  
  //Edit User
  class editUsersRequest {
    constructor(req) {
      this.id = req.query.id ? req.query.id : null;
      this.name = req.body.name ? req.body.name : null;
      this.gender = req.body.gender ? req.body.gender : null;
      this.password = req.body.password ? req.body.password : null;

    }
  }

    //Change password
    class changePasswordRequest {
      constructor(req) {
        this.id = req.query.id ? req.query.id : null;
        this.password = req.body.password ? req.body.password : null;
      }
    }
  
    //Forgot Verify
    class forgotVerifyRequest {
      constructor(req) {
        this.id = req.params.id ? req.params.id : null;
        this.token = req.params.token ? req.params.token : null;
        this.password = req.body.password ? req.body.password : null;
      }
    }
  

module.exports.registerRequest = registerRequest;
module.exports.loginRequest = loginRequest;
module.exports.logoutRequest = logoutRequest;
module.exports.editUsersRequest = editUsersRequest;
module.exports.changePasswordRequest = changePasswordRequest;
module.exports.forgotRequest = forgotRequest;
module.exports.forgotVerifyRequest = forgotVerifyRequest;
