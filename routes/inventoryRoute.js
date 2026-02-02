// Needed Resources 
const express = require("express");
const utilities = require("../utilities/")
const router = new express.Router(); 
const invController = require("../controllers/invController");
const regValidate = require("../utilities/inventory-validator");

// Route to build inventory by classification view
router.get("/type/:classificationId",  utilities.handleErrors(invController.buildByClassificationId));
// Route to detail inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
// Route to error
router.get("/temporal-error", utilities.handleErrors(invController.generateError));

// Management Paths
router.get("/",utilities.handleErrors(invController.buildManagementInv))
// Add classification Get
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
// Add Classification
router.post(
    "/add-classification", 
    regValidate.addClassificationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.processAddClassification)
)

module.exports = router;