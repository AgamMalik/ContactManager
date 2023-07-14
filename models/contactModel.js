const mongoose = require("mongoose")

const contactSchema = mongoose.Schema({
    user_id: {

        // object id will be created in mongodb
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please add the contact name"],
    },
    email:  {
        type: String,
        required: [true, "Please add the contact email address"],
    },
    phone: {
        type: String,
        required: [true, "Please add the contact phone number"],
    },
   },
    {
     timestamps: true   
    }
    
)

// here contact is thwe name we are providing to the model
module.exports = mongoose.model("Contact", contactSchema)