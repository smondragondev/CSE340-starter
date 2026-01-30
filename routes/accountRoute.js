// Needed Resources 
const express = require("express");
const utilities = require("../utilities/")
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validator");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));


// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;