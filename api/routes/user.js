const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("../models/user");
const { token } = require("morgan");
// const { TokenExpiredError } = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *      schema:
 *          auth:
 *                type: object
 *                properties:
 *                    name:
 *                        type: string
 *                    email:
 *                        type: string
 *                    password:
 *                        type: string
 *                   
 *
 */

/**
 * @swagger
 * components:
 *      schema:
 *          aut:
 *                type: object
 *                properties:
 *                    email:
 *                        type: string
 *                    password:
 *                        type: string
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *       tags:
 *           - Auth
 *       summary: Signup
 *       description: create new user
 *       requestBody:
 *           required:  true
 *           content:
 *               application/json:
 *                     schema:
 *                         $ref: '#components/schema/auth'
 *       responses:
 *           200:
 *               description:  User Successfully created
 *
 */



router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          bcrypt.compare(req.body.password, user.password, () => {
            if (err) {
              return res.status(500).json({
                message: "Incorrect credentials",
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: req.decoded
              });
              user
          

                .save()

                .then((result) => {
                  const adminEmail = "catherine@gmail.com";
                  const role = user.email===adminEmail? "admin" : "user";
                  const token = jwt.sign( 
                  {
                      email: user.email,
                      userId: user._id,
                      role
                  },
                  process.env.JWT_KEY,
                  {
                      expiresIn : "1h"
                  });
                  return res.status(201).json({
                    message: "User Created",
                    token: token,
                    userId: user._id,
                    name: user.name,
                    role:user.role
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        });
      }
    });
});

/**
 * @swagger
 * /user/login:
 *   post:
 *       tags:
 *           - Auth
 *       summary: login
 *       description: login existing account
 *       requestBody:
 *           required:  true
 *           content:
 *               application/json:
 *                     schema:
 *                         $ref: '#components/schema/aut'
 *       responses:
 *           200:
 *               description: Login successful
 *
 */

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Wrong email",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Incorrect password",
          });
        }
        if (result) {
          const adminEmail = "catherine@gmail.com";
          const role = user[0].email===adminEmail? "admin" : "user";
          const token = jwt.sign( 
          {
              email: user[0].email,
              userId: user[0]._id,
              role
          },
          process.env.JWT_KEY,
          {
              expiresIn : "1h"
          });

          return res
            .status("200")
            .json({
              message: "login successful",
              token: token,
              role: role,
              userId: user._Id,
              name: user.name
            });
        }
        res
          .status(401)
          .send(
            'Wrong credentials'
          );
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User Deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
