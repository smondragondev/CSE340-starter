const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const accountController = {};

accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

accountController.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

accountController.buildLoginManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Account management",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}


/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }
            return res.redirect("/account/");
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.");
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }
    } catch (error) {
        throw new Error('Access Forbidden');
    }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
accountController.accountLogout = async function (req, res) {
    const name = res.locals.accountData.account_firstname ?? '';
    req.flash("notice", `Bye ${name}!. You are logout!`);
    res.clearCookie("jwt");
    res.redirect("/account/login")
}

accountController.buildEditAccount = async function (req, res) {
    const account_id = req.params.account_id;
    const accountData = await accountModel.getAccountById(account_id);
    const nav = await utilities.getNav();
    res.render(
        "account/edit-account",
        {
            nav,
            errors: null,
            title: "Edit your account",
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id: accountData.account_id,
        }
    )
}
accountController.processUpdateAccount = async function (req, res) {
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body;
    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    );
    if (updateResult) {
        req.flash(
            "notice",
            `Your data was successfully updated.`
        )
        res.redirect(`/account/`);
    } else {
        req.flash(
            "notice",
            "Sorry, the edit account failed."
        );
        res.redirect(`/account/edit/${account_id}`)
    }
}

accountController.processUpdatePassword = async function (req, res) {
    const {
        account_password,
        account_id
    } = req.body;
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        res.redirect(`/account/edit/${account_id}`);
    }
    const updateResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    );
    if (updateResult) {
        req.flash(
            "notice",
            `Your password was successfully updated.`
        )
        res.redirect(`/account/`);
    } else {
        req.flash(
            "notice",
            "Sorry, the update password failed."
        );
        res.redirect(`/account/edit/${account_id}`)
    }
}


module.exports = accountController