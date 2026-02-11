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


/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */

validate.addInventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric('en-US')
            .withMessage("Please provide a correct inventory make."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric('en-US')
            .withMessage("Please provide a correct inventory model."),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isInt({min:1980})
            .withMessage("Please provide a correct inventory year."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a correct inventory description."),
        body("inv_image")
            .trim()
            .notEmpty()
            .matches(/^\/[\w\-\/\.]+\.(jpg|jpeg|png|gif|webp)$/i)
            .withMessage("Please provide a correct inventory image path."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .matches(/^\/[\w\-\/\.]+\.(jpg|jpeg|png|gif|webp)$/i)
            .withMessage("Please provide a correct inventory thumbnail path."),
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat()
            .withMessage("Please provide a correct inventory price."),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isFloat()
            .withMessage("Please provide a correct inventory miles."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha()
            .withMessage("Please provide a correct inventory color."),
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a correct classification."),
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

/* ******************************
* Check data and return errors or continue to Add Inventory
* ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
    const { inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classificationOptions = await utilities.buildClassificationOptions(classification_id);
        
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            classificationOptions
        })
        return
    }
    next()
}

/* ******************************
* Check Update data and return errors or continue to Edit Inventory
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
    } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classificationOptions = await utilities.buildClassificationOptions(classification_id);
        
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            classificationOptions,
            inv_id
        })
        return
    }
    next()
}


/*  **********************************
  *  Book Appointment Data Validation Rules
  * ********************************* */
validate.bookAppointmentRules = () => {
    return [
        // valid email is required
        body("appointment_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),
        body("appointment_phone_number")
            .trim()
            .escape()
            .notEmpty()
            .isMobilePhone()
            .withMessage("A valid phone number is required."),
        body("appointment_message")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a correct appointment message."),    
    ]
}

/* ******************************
* Check Appointment data and return errors or continue to Book the appointment
* ***************************** */
validate.checkAppointmentData = async (req, res, next) => {
    const { 
        appointment_email,
        appointment_phone_number,
        appointment_message,
        inv_id
    } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();          
        res.render("inventory/appointment", {
            errors,
            title: "Book an appointment",
            nav,
            appointment_email,
            appointment_phone_number,
            appointment_message,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate;