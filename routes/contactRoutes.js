const express = require("express")
const router = express.Router()
const { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact, 
} = require("../controllers/contactControllers")
const validateToken = require("../middleware/validateTokenHandler")


// use validatetoken for all the routes as middleware to make them protected/private
router.use(validateToken)

router.route("/").get(getContacts).post(createContact)

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact)

module.exports = router