const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("../models/user");
const { token } = require("morgan");

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
 *                    phoneNumber:
 *                        type: string
 *                    address:
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
 *
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
          message: "Account already exist for this Email",
        });
      } else {  
        const {password} = req.body;
        if(password.length < 6  ) {
          res.status(400).json({message:'Password must be more than 6 characters long'});
            }else{
        bcrypt.hash(password, 10, (err, hash) => {
          bcrypt.compare(password, user.password, () => {
            if (err) {
              return res.status(500).json({
                message: "Incorrect credentials",
              });
            
            }
             else {
            
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: hash,
                confirmPassword: hash,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
              });
              user

                .save()

                .then((result) => {
                  const adminEmail = "catherine@gmail.com";
                  const role = user.email === adminEmail ? "admin" : "user";
                  const token = jwt.sign(
                    {
                      email: user.email,
                      userId: user._id,
                      role,
                    },
                    process.env.JWT_KEY,
                    {
                      expiresIn: "1h",
                    }
                  );
                  const decoded = jwt.verify(token, process.env.JWT_KEY);
                  return res.status(201).json({
                    message: "User Created",
                    token: token,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    message: err,
                  });
                });
            }
          });
        });
            
      }}
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
          const role = user[0].email === adminEmail ? "admin" : "user";
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              role,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          const decoded = jwt.verify(token, process.env.JWT_KEY);
          return res.status("200").json({
            message: "login successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Incorrect credentials",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "please check and correct the required fields",
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
