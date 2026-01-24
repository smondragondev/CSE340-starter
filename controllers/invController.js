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
invCont.buildByInventoryId = async function (req, res, next){
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
invCont.generateError = async function (req, res,next){
  const error = new Error("A temporal Error!");
  error.status = 500;
  next(error);
}


module.exports = invCont
