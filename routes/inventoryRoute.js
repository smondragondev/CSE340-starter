// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to detail inventory
router.get("/detail/:inventoryId", invController.buildByInventoryId);
// Route to error
router.get("/temporal-error", invController.generateError);


module.exports = router;