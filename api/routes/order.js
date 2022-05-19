const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check.auth");


/**
 * @swagger
 * components:
 *      schema:
 *          Parcels:
 *                type: object
 *                properties:
 *                    _id:
 *                        type: string
 *                    product:
 *                        type: string
 *                    price:
 *                        type: integer
 *                    quantity:
 *                         type: integer
 *                    destination:
 *                         type: string
 *                    status:
 *                         type: string
 *                    currentLocation:
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



router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select(" product price quantity destination status _id currentLocation")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        parcels: doc,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

/**
 * @swagger
 * /parcel:
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

router.post("/", checkAuth, (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.product,
    price: req.body.price,
    quantity: req.body.quantity,
    destination: req.body.destination,
    status: req.body.status,
    currentLocation: req.body.currentLocation,
  });
  order.save().then((result) => {
    res.status(200).json({
      message: "order successfully created",
      output: order,
    });
    // .catch((err) => {
    //   // console.log(err);
    //   res.status(500).json({
    //     error: err
    //   });
    // });
  });
});

/**
 * @swagger
 * /parcels/{id}:
 *   get:
 *       tags:
 *           - Parcels
 *       security:
 *          - bearerAuth: []
 *       summary: Fetch id parcel
 *       description: to get a specific parcel
 *       parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: Numeric ID required
 *              schema:
 *               type: string
 *       responses:
 *           200:
 *               description: To fetch all parcels
 *               content:
 *                   application/json:
 *                        schema:
 *                            type: object
 *                            items:
 *                                $ref: '#components/schema/Parcels'
 *
 */

router.get("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  Order.findById(id)
    .select("_id product price quantity destination status currentLocation")
    .exec()
    .then((docu) => {
      if (docu) {
        res.status(200).json(docu);
      } else {
        res.status(404).json({ message: "no valid id for this" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
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
      res.status(500).json({ error: "this an error request" });
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
 *              description: Numeric ID required
 *              schema:
 *               type: "status"
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

router.put("/:statusId/status", checkAuth, (req, res, next) => {
  const id = req.params.statusId;
  const status = req.body.status;

  Order.updateOne(
    { _id: id },
    {
      status: status,
    },
    { upsert: true }
  )
    .then((result) => res.status(200).json({ message: "Status  updated " }))
    .catch((err) => {
      res.status(500).json({ error: "this an error request" });
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
 *              description: Numeric ID required
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

router.put("/:statusId/currentLocation", checkAuth, (req, res, next) => {
  const id = req.params.statusId;
  const CurrentLocation = req.body.currentLocation;

  Order.updateOne(
    { _id: id },
    {
      currentLocation: CurrentLocation,
    },
    { upsert: true }
  )
    .then(() => res.status(200).json({ message: "Current Location  updated " }))
    .catch((err) => {
      res.status(500).json({ error: "this an error request" });
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

router.delete("/:orderId/delete", checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Order Deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "this is an error" });
    });
});

module.exports = router;
