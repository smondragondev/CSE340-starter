const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");

const validate = {};

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */

validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric('en-US')
            .withMessage("Please provide a correct classification name")
    ]
}


/* ******************************
* Check data and return errors or continue to Add Classification
* ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}


module.exports = validate;