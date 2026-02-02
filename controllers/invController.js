const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryID(inventory_id);
  const detail = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const title = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    nav,
    detail,
    title
  });
}

/* ***************************
 *  Temporal Error View
 * ************************** */
invCont.generateError = async function (req, res, next) {
  const error = new Error("A temporal Error!");
  error.status = 500;
  next(error);
}

/* ***************************
 *  Management View
 * ************************** */
invCont.buildManagementInv = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Vehicle Management";
  res.render("./inventory/management", { nav, title });
}

/* ***************************
 *  Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Add Classification";
  res.render("./inventory/add-classification", { nav, title, errors: null })
}

/* ***************************
 *  Process the adding classification
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  const title = "Add Classification";
  const { classification_name } = req.body;
  const regResult = await invModel.addNewClassification(classification_name);
  if (regResult) {
    req.flash(
      "notice",
      `The ${classification_name} was successfully registered.`
    )
    res.status(201).render("inventory/management", {
      title,
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice",
      "Sorry, the adding classification failed."
    );
    res.status(501).render("inventory/add-classification", {
      title,
      nav,
    })
  }
}

/* ***************************
 *  Add Item View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationOptions = await utilities.buildClassificationOptions();
  const title = "Add Inventory";
  res.render("./inventory/add-inventory", { nav, title, errors: null, classificationOptions })
}

/* ***************************
 *  Process the adding inventory
 * ************************** */
invCont.processAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Add Inventory";
  const { 
    inv_make,
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
  const regResult = await invModel.addNewInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_make} - ${inv_model} was successfully registered.`
    )
    res.status(201).render("inventory/management", {
      title,
      nav,
      errors: null,
    })
  } else {
    const classificationOptions = await utilities.buildClassificationOptions(classification_id);
    req.flash(
      "notice",
      "Sorry, the adding inventory failed."
    );
    res.status(501).render("inventory/add-inventory", {
      title,
      nav,
      classificationOptions,
    })
  }
}

module.exports = invCont
