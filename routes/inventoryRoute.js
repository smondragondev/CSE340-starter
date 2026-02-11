// Needed Resources 
const express = require("express");
const utilities = require("../utilities/")
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require("../utilities/inventory-validator");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to detail inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
// Route to error
router.get("/temporal-error", utilities.handleErrors(invController.generateError));

// Management Paths
router.get("/", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.buildManagementInv))
// Add classification Get
router.get("/add-classification", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.buildAddClassification));
// Add Classification
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkPermissions,
    regValidate.addClassificationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.processAddClassification)
)
// Add Inventory Get
router.get("/add-inventory", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.buildAddInventory));
// Add Inventory
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkPermissions,
    regValidate.addInventoryRules(),
    regValidate.checkAddInventoryData,
    utilities.handleErrors(invController.processAddInventory)
)

router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inventory_id", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.buildEditInventory));
router.post(
    "/update/",
    utilities.checkLogin,
    utilities.checkPermissions,
    regValidate.addInventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// This will display a confirmation view 
router.get("/delete/:inventory_id", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.buildConfirmationView))
// This will delete the iventory item
router.post("/delete", utilities.checkLogin, utilities.checkPermissions, utilities.handleErrors(invController.deleteInventoryItem))

// The Render View for appointment form
router.get("/book-appointment/:inv_id",
    utilities.checkLogin, 
    utilities.handleErrors(invController.buildBookAppointment))
// The Post view to process the book appointment process
router.post("/book-appointment",
    utilities.checkLogin,
    regValidate.bookAppointmentRules(),
    regValidate.checkAppointmentData,
    utilities.handleErrors(invController.processBookAppointment)
)

module.exports = router;