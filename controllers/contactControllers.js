const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")
const { Error } = require("mongoose")
// @desc get all contacts
// @route get /api/contacs
// @access private

const getContacts = asyncHandler(async(req, res) => {

    // to fetch all the contacts of a logged in user
    const contacts = await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts)
})

// @desc create new contacts
// @route post /api/contacs
// @access private

const createContact = asyncHandler(async(req, res) => {
    console.log("the request body is", req.body)

    // destructuring for error handling for data recieved
    const{name, email, phone} = req.body
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    })
    res.status(201).json(contact)
})

// @desc get contacts
// @route get /api/contact:id
// @access private

const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
})

 
// @descupdate contacts
// @route put /api/contacs:id
// @access private

const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    // it means we know that a different user is trying to update contact of difgferent user
    if(contact.user_id.toString() !== req.user.id){
        
        res.status(403)
        throw new Error("user dont have the permission to update other user contact")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )

    res.json(updatedContact)
})


// @desc delete contacts    
// @route delete /api/contacs:id
// @access private

const deleteContact = asyncHandler(async(req, res) => {
    console.log(req.body)
    const contact = await Contact.findByIdAndDelete()(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
        
        res.status(403)
        throw new Error("user dont have the permission to delete other user contact")
    }

    await Contact.deleteOne({_id: req.params.id})
    res.status(200).json(contact)
})

module.exports = { 
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact, 
}