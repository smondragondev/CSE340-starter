// Needed Resources 
const express = require("express");
const utilities = require("../utilities/")
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validator");

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLoginManagement))
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/logout",utilities.handleErrors(accountController.accountLogout));

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// Update the account
router.get("/edit/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccount));
// Process the update
router.post("/edit/", 
  utilities.checkLogin, 
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.processUpdateAccount));

// Process the update password
router.post("/update-password/", 
  utilities.checkLogin, 
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.processUpdatePassword));


module.exports = router;