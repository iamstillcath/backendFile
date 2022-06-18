const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check.auth");
const Admin = require("../middleware/admin");
const Order = require("../models/order.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * components:
 *      schema:
 *          Parcels:
 *                type: object
 *                properties:
 *
 *                    product:
 *                        type: string
 *                    price:
 *                        type: integer
 *                    pickupLocation:
 *                         type: string
 *                    destination:
 *                         type: string
 *                    currentLocation:
 *                         type: string
 *                    recipientName:
 *                         type: string
 *                    recipientNumber:
 *                         type: string
 *
 */

/**
 * @swagger
 * components:
 *      schema:
 *          Parcel:
 *                type: object
 *                properties:
 *                    destination:
 *                         type: string
 */

/**
 * @swagger
 * components:
 *      schema:
 *          Parce:
 *                type: object
 *                properties:
 *                    status:
 *                         type: string
 */

/**
 * @swagger
 * components:
 *      schema:
 *          Parc:
 *                type: object
 *                properties:
 *                    currentLocation:
 *                         type: string
 */

/**
 * @swagger
 * /parcels:
 *   get:
 *       tags:
 *         - Parcels
 *       security:
 *        - bearerAuth: []
 *       summary: Get all parcels
 *       description: to get all parcel
 *       responses:
 *           200:
 *               description: To fetch all parcels
 *               content:
 *                   application/json:
 *                        schema:
 *                            type: object
 *                            items:
 *                                $ref:'#components/schema/Parcels'
 *
 *
 */

router.get("/", Admin, (req, res, next) => {
  Order.find()
    .select(" product price quantity destination status pickupLocation recipientName recipientNumber currentLocation userId")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        parcels: doc,
      };
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

/**
 * @swagger
 * /parcels:
 *   post:
 *       tags:
 *           - Parcels
 *       security:
 *        - bearerAuth: []
 *       summary: To insert new data
 *       description: add
 *       requestBody:
 *           required:  true
 *           content:
 *               application/json:
 *                     schema:
 *                         $ref: '#components/schema/Parcels'
 *       responses:
 *           200:
 *               description: Successfully Added
 *
 */

router.post("/",checkAuth, (req, res, next) => {
  const user = req.userData;
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    userId: user.userId,
    product: req.body.product,
    price: req.body.price,
    pickupLocation: req.body.pickupLocation,
    destination: req.body.destination,
    status: "created",
    currentLocation: req.body.currentLocation,
    recipientName: req.body.recipientName,
    recipientNumber: req.body.recipientNumber,
  });
  order.save().then((result) => {
    res.status(200).json({
      message: "order successfully created",
      id: result._id,
      product: result.product,
      price:result.price,
      pickupLocation:result.pickupLocation,
      destination:result.destination,
      status:result.status,
      currentLocation:result.currentLocation,
      recipientName:result.recipientName,
      recipientNumber:result.recipientNumber
    })
    
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
  });
});

/**
 * @swagger
 * /parcels/user:
 *   get:
 *       tags:
 *         - Parcels
 *       security:
 *        - bearerAuth: []
 *       summary: Get user parcels
 *       description: to get user parcel
 *       responses:
 *           200:
 *               description: To fetch user parcels
 *               content:
 *                   application/json:
 *                        schema:
 *                            type: object
 *                            items:
 *                                $ref:'#components/schema/Parcels'
 *
 *
 */

router.get("/user", checkAuth, (req, res, next) => {
  const user = req.userData;
  Order.find({ userId: user.userId })
    .select(" product price quantity destination status pickupLocation recipientName recipientNumber currentLocation userId")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        parcels: doc,
      };
      return res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).json({ message: "you have no parcel order" });
    });
});

/**
 * @swagger
 * /parcels/{id}/destination:
 *   put:
 *       tags:
 *           - Parcels
 *       security:
 *          - bearerAuth: []
 *       summary: Update Destination
 *       description: add
 *       parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: Numeric ID required
 *              schema:
 *               type: string
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                     schema:
 *                         $ref: '#components/schema/Parcel'
 *       responses:
 *           200:
 *               description: Successfully updated destination
 *               content:
 *               application/json:
 *                     schema:
 *                        type:
 *                         items:
 *                              $ref: '#components/schema/Parcels'
 *
 */

router.put("/destination", checkAuth, (req, res, next) => {
  const id = req.body.ordersId;
  const destination = req.body.destination;
  Order.updateOne(
    { _id: id },
    {
      destination: destination,
    },
    { upsert: true }
  )
    .then((result) => res.status(200).json({ message: "Destination updated" }))
    .catch((err) => {
      res.status(500).json({ error: "no request found with this Id" });
    });
});

/**
 * @swagger
 * /parcels/{id}/status:
 *   put:
 *       tags:
 *           - Parcels
 *       security:
 *          - bearerAuth: []
 *       summary: Update Status
 *       description: add
 *       parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: ID required
 *              schema:
 *               type: string
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                     schema:
 *                         $ref: '#components/schema/Parce'
 *       responses:
 *           200:
 *               description: Successfully updated status
 *               content:
 *               application/json:
 *                     schema:
 *                        type:
 *                         items:
 *                              $ref: '#components/schema/Parcels'
 *
 */

router.put("/status", Admin, (req, res, next) => {
  const id = req.body.statusId;
  const statuss = ["created", "in-transit", "delivered"];
  const status = req.body.status;
  if (!statuss.includes(status))
    return res.status(401).json({ message: "Status invalid" ,status:0});

  Order.updateOne(
    { _id: id },
    {
      status: status,
    },
    { upsert: true }
  )
    .then((result) => res.status(200).json({ message: "Status  updated ",status:1 }))
    .catch((err) => {
      res.status(500).json({ error: "no request found with this Id",status:0 });
    });
});

/**
 * @swagger
 * /parcels/{id}/currentLocation:
 *   put:
 *       tags:
 *           - Parcels
 *       security:
 *          - bearerAuth: []
 *       summary: Update CurrentLocation
 *       description: add
 *       parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: ID required
 *              schema:
 *               type: string
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                     schema:
 *                         $ref: '#components/schema/Parc'
 *       responses:
 *           200:
 *               description: Successfully updated current Location
 *               content:
 *               application/json:
 *                     schema:
 *                        type:
 *                         items:
 *                              $ref: '#components/schema/Parcels'
 *
 */

router.put("/currentLocation", Admin, (req, res, next) => {
  const id = req.body.statusId;
  console.log("this is the id==>" ,id)
  const CurrentLocation = req.body.currentLocation;
  console.log("this is the location==>" ,CurrentLocation)
  Order.updateOne(
    { _id: id },
    {
      currentLocation: CurrentLocation,
    },
    { upsert: true }
  )
    .then(() => res.status(200).json({ message: "Current Location  updated " }))
    .catch((err) => {
      res.status(500).json({ error: "no request found with this Id" });
    });
});

/**
 * @swagger
 * /parcels/{id}/delete:
 *   delete:
 *       tags:
 *           - Parcels
 *       security:
 *          - bearerAuth: []
 *       summary: Delete id parcel
 *       description: to delete a specific parcel
 *       parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: Numeric ID required
 *              schema:
 *               type: string
 *       responses:
 *           200:
 *               description: Order deleted
 *
 */

router.delete("/delete", checkAuth, (req, res, next) => {
  const id = req.body.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Order Deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "no request found with this Id" });
    });
});

module.exports = router;
