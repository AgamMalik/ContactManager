// we are creating a custom middleware as to translate from html format to json....so thatt error handler doesnt throw only html code directly


const {constants} = require("../constants")
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: "Validation failed", message: err.message, stackTrace: err.stack})
            break;
    
        case constants.NOT_FOUND:
            res.json({ title: "Not found", message: err.message, stackTrace: err.stack})
            break;

        case constants.UNAUTHORIZED:
            res.json({ title: "un authorized", message: err.message, stackTrace: err.stack})
            break;
    
        case constants.FORBIDDEN:
            res.json({ title: "forbidden", message: err.message, stackTrace: err.stack})
            break;

        case constants.SERVER_ERROR:
            res.json({ title: "Server error", message: err.message, stackTrace: err.stack})
            break;
    
    
    

        default:
            console.log("No error")
            break;
    }
    
}



module.exports = errorHandler