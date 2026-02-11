const invModel = require("../models/inventory-model");
const appointmentModel = require("../models/appointment-model");
const utilities = require("../utilities/");

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
  const classificationOptions = await utilities.buildClassificationOptions();
  res.render("./inventory/management", { nav, title, classificationOptions });
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
    );
    res.redirect("/inv/");
  } else {
    req.flash(
      "notice",
      "Sorry, the adding classification failed."
    );
    res.status(501).render("inventory/add-classification", {
      title,
      nav,
    });
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
    res.redirect("/inv/");
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build  edit inventory item
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryID(inv_id);
  const classificationOptions = await utilities.buildClassificationOptions(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const title = "Edit " + itemName;
  res.render("./inventory/edit-inventory", {
    title,
    nav,
    classificationOptions,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/*
 ****************************
 *  Process the adding inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Edit Inventory";
  const {
    inv_id,
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
  const updateResult = await invModel.updateInventory(
    inv_id,
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
  const classificationOptions = await utilities.buildClassificationOptions(classification_id);
  if (updateResult) {
    req.flash(
      "notice",
      `The ${inv_make} - ${inv_model} was successfully updated.`
    )

    res.redirect("/inv/");
  } else {
    req.flash(
      "notice",
      "Sorry, the edit inventory failed."
    );
    res.status(501).render("inventory/edit-inventory", {
      title,
      nav,
      classificationOptions,
      inv_id,
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
    })
  }
}

/* ***************************
 *  Build  confirmation inventory item
 * ************************** 
 * */
invCont.buildConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryID(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const title = "Delete " + itemName;
  res.render("./inventory/delete-confirm", {
    title,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/*
 ****************************
 *  Process the deleting inventory
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Delete Inventory";
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;
  const deleteResult = await invModel.deleteInventoryItem(
    inv_id,
  );
  if (deleteResult) {
    req.flash(
      "notice",
      `The ${inv_make} - ${inv_model} was successfully deleted.`
    )
    res.redirect("/inv/");
  } else {
    req.flash(
      "notice",
      "Sorry, the delete inventory failed."
    );
    res.status(501).render("inventory/delete-confirmation", {
      title,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}

/* ***************************
 *  Book an appointment View
 * ************************** */
invCont.buildBookAppointment = async function (req, res, next) {
  const nav = await utilities.getNav();
  const title = "Book an appointment";
  const inv_id = req.params.inv_id;
  const appointment_email = res.locals.accountData.account_email;
  res.render("./inventory/appointment", { nav, title, errors: null,inv_id,appointment_email })
}

/* ****************************
 *  Process the book appointment
 * ************************** */
invCont.processBookAppointment = async function (req, res, next) {
  let nav = await utilities.getNav();
  const title = "Book an appointment";
  const {
    appointment_email,
    appointment_phone_number,
    appointment_message,
    inv_id
  } = req.body;
  const account_id = res.locals.accountData.account_id ?? '';
  const registerResult = await appointmentModel.registerAppointment(
    account_id,
    inv_id,
    appointment_phone_number,
    appointment_email,
    appointment_message
  );
  if (registerResult) {
    req.flash(
      "notice",
      `The appoint was successfully register.`
    )
    res.redirect("/");
  } else {
    req.flash(
      "notice",
      "Sorry, the book an appointment failed."
    );
    res.status(501).render("inventory/appointment", {
      title,
      nav,
      appointment_email,
      appointment_phone_number,
      appointment_message,
      inv_id
    })
  }
}



module.exports = invCont
