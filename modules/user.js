const passport = require("passport");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = mongoose.model('User');

module.exports = {

  /**
   * POST /login
   * connect user/admin and return an access token
   */
  signIn: function (req, res) {
    passport.authenticate('local-login', { session: false }, function (err, user, info) {
      if (err) {
        return res.status(500).send({ message: "Internal server error", errorInfo: err });
      }
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized"
        });
      }
      const token = jwt.sign({ 'username': user.username }, "SecretJwtKey");
      return res.status(200).send({ authToken: token });
    })(req, res);
  },

  /**
   * GET /logout
   * to logout the user
   */
  logout: function (req, res) {
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
      if (err) {
        return res.status(500).send({ message: "Internal server error", errorInfo: err });
      }
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized"
        });
      }
      req.logout();
      return res.status(200).send({ message: "User disconnected" });
    })(req, res);
  },

  /**
   * GET /me
   * return the current user information with an access token
   */
  me: function (req, res) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) {
        return res.status(500).send({ message: "Internal server error", errorInfo: err });
      }
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized"
        });
      }
      return res.status(200).send({
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username
      });
    })(req, res);
  },

  /**
   * POST /user
   * create a new user
   */
  register: function (req, res) {
    if (req.body.length > 1e6) {
      req.connection.destroy();
    }
    // passport.authenticate('jwt', { session: false }, function (err, user, info) {
    //   if (err) {
    //     return res.status(500).send({ message: "Internal server error", errorInfo: err });
    //   }
    //   if (!user) {
    //     return res.status(401).send({
    //       statusCode: 401,
    //       message: "Unauthorized"
    //     });
    //   }
    // if (user.role == "admin") {

    var mandatories = [];
    User.findOne({ 'username': req.body.username })
      .exec(function (err, user) {
        if (err) {
          return res.status(500).send({ message: "Internal server error", errorInfo: err });
        }
        if (user) {
          return res.status(400).send({ success: false, message: 'User already exists in database' });
        }
        var newUser = new User();
        if (req.body.username == undefined) {
          mandatories.push("username");
        }
        if (req.body.email == undefined) {
          mandatories.push("email");
        }
        if (req.body.name == undefined) {
          mandatories.push("name");
        }
        if (req.body.password == undefined) {
          mandatories.push("password")
        }
        if (req.body.role == undefined) {
          mandatories.push("role")
        }
        if (mandatories.length > 0) {
          res.status(422).send({ message: "mandatory value is missed", mandatories: mandatories });
        } else {
          newUser.username = req.body.username;
          newUser.name = req.body.name;
          newUser.password = req.body.password;
          newUser.email = req.body.email;
          newUser.role = req.body.role;
          newUser.save(function (err) {
            if (err) {
              return res.status(500).send({ message: "Internal error server, can't save the user.", errorInfo: err });
            }
            return res.status(201).send({ message: "User successfully created" });
          });
        }
      })
    // }
    // })(req, res);
  },


  /**
   * PUT /user
   * update sent user only if current user is admin
   */
  modifyUser: function (req, res) {
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
      if (err) {
        return res.status(500).send({ message: "Internal server error", errorInfo: err });
      }
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized"
        });
      }
      console.log('MODIFY USER : ' + JSON.stringify(user));
      if (user.role == "admin") {
        var newData = {};
        newData.username = req.body.username;
        newData.role = req.body.role;
        newData.email = req.body.email;
        newData.name = req.body.name;
        User.update({ username: req.body.username }, newData, { upsert: true }, function (err, user) {
          if (err) {
            res.status(400).send({ success: false, message: "Can't modify User" });
          }
        })
        return res.status(200).send({ message: "User successfully modified" });
      } else {
        return res.status(401).send({ success: false, message: "Unauthorized" });
      }
    })(req, res);
  },

  /**
   * GET /user
   * return the list of all users
   */
  listUser: function (req, res) {
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
      if (err) {
        return res.status(500).send({ message: "Internal server error", errorInfo: err });
      }
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized"
        });
      }
      User.find({})
        .exec(function (err, users) {
          var listUsers = [];
          if (err) {
            return res.status(400).send({ success: false, message: "Error happenned in the database" });
          }
          users.forEach(function (user) {
            listUsers.push({
              'username': user.username,
              'email': user.email,
              'role': user.role,
              'name': user.name
            });
          });
          return res.status(200).send({ users: listUsers, message: "Users successfully listed" });
        });
    })(req, res);

  },

  /**
   * DELETE /user/:id
   * delete sent user only if current user token is admin
   */
  deleteUser: function (req, res) {
    console.log(req.headers);
    passport.authenticate("jwt", { session: false }, function (err, user, info) {
      if (err) {
        return res.status(500).send({ message: "Internal server error", errorInfo: err });
      }
      if (!user) {
        return res.status(401).send({
          statusCode: 401,
          message: "Unauthorized"
        });
      }
      if (user.role == "admin") {
        User.deleteOne({ "username": req.params.id }, function (err) {
          if (err) return handleError(err);
          return res.status(200).send({ message: "User successfully deleted" });
        })
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    })(req, res);
  }

}
