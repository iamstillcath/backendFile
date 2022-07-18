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
 *                    itemDescription:
 *                        type: string
 *                    price:
 *                        type: integer
 *                    pickupLocation:
 *                         type: string
 *                    destination:
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
    .select(
      " itemDescription price quantity destination status pickupLocation recipientName recipientNumber currentLocation userId"
    )
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        data: doc,
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


 const errorFormatter = e => {
  let errors = {};

  // "User validation failed: email: Enter a valid email address!, phoneNumber: phoneNumber is not a valid!"

  const allErrors = e.substring(e.indexOf(":") + 1).trim();
  const allErrorsFormatted = allErrors.split(",").map((err) => err.trim());
  allErrorsFormatted.forEach((error) => {
    const [key, value] = error.split(":").map((err) => err.trim());
    errors[key]=value
  });
  return errors
};

router.post("/", checkAuth, (req, res, next) => {
  const user = req.userData;
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    userId: user.userId,
    itemDescription: req.body.itemDescription,
    price: req.body.price,
    pickupLocation: req.body.pickupLocation,
    destination: req.body.destination,
    status: "created",
    currentLocation: " ",
    recipientName: req.body.recipientName,
    recipientNumber: req.body.recipientNumber,
  });
  order
    .save()
    .then((result) => {
      res.status(200).json({
        message: "order successfully created",
        data:{
        id: result._id,
        itemDescription: result.itemDescription,
        price: result.price,
        pickupLocation: result.pickupLocation,
        destination: result.destination,
        status: result.status,
        currentLocation: result.currentLocation,
        recipientName: result.recipientName,
        recipientNumber: result.recipientNumber,
        }
      });
    })
    .catch((e) => {
      res.status(500).json({
        errors:errorFormatter(e.message)
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
    .select(
      " itemDescription price quantity destination status pickupLocation recipientName recipientNumber currentLocation userId"
    )
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        parcels: doc,
      };
      return res.status(200).send(doc);
    })
    .catch((e) => {
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

router.put("/:ordersId/destination", checkAuth, (req, res, next) => {
  const id = req.params.ordersId;
  Order.findOne({ _id: id })
    .exec()
    .then((ras) => {
      const foundStatus = ras.status;
      if (foundStatus === "delivered") {
         res
          .status(400)
          .json({ error: "This package has been delivered" });
      } else {
        const destination = req.body.destination;
        Order.updateOne(
          { _id: id },
          {
            destination: destination,
          },
          { upsert: true }
        )
          .then((result) =>
            res.status(200).json({ message: "Destination updated" })
          )
          .catch((err) => {
            res.status(500).json({ error: "no request found with this Id" });
          });
      }
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

router.put("/:statusId/status", Admin, (req, res, next) => {
  const id = req.params.statusId;
  const statuss = ["created", "in-transit", "delivered"];
  const status = req.body.status;
  if (!statuss.includes(status))
    return res.status(401).json({ message: "Status invalid", status: 0 });

  Order.findOne({ _id: id })
    .exec()
    .then((ras) => {
      const foundStatus = ras.status;
      if (foundStatus === "delivered") {
        return res
          .status(400)
          .json({ error: "This package has been delivered" });
      } else {
        Order.updateOne(
          { _id: id },
          {
            status: status,
          },
          { upsert: true }
        )
          .then((result) =>
            res.status(200).json({ message: "Status  updated ", status: 1 })
          )
          .catch((err) => {
            res
              .status(500)
              .json({ error: "no request found with this Id", status: 0 });
          });
      }
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

router.put("/:statusId/currentLocation", Admin, (req, res, next) => {
  const id = req.params.statusId;
  Order.findOne({ _id: id })
  .exec()
  .then((ras) => {
    const foundStatus = ras.status;
    if (foundStatus === "delivered") {
      return res
        .status(400)
        .json({ error: "This package has been delivered" });
    } else {
  const CurrentLocation = req.body.currentLocation;
  Order.updateOne(
    { _id: id },
    {
      currentLocation: CurrentLocation,
    },
    { upsert: true }
  )
    .then(() => res.status(200).json({ message: "Current Location  updated" }))
    .catch((err) => {
      res.status(500).json({ error: "no request found with this Id" });
    });
  }
})
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

router.delete("/:orderId/delete", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findOne({ _id: id })
  .exec()
  .then((ras) => {
    const foundStatus = ras.status;
    if (foundStatus === "delivered") {
      return res
        .status(400)
        .json({ error: "You cannot delete,this package has been delivered" });
    } else {
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Order Deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "no request found with this Id" });
    });
  }
})
});

module.exports = router;
